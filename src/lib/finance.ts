// Công thức chuẩn: lãi tính theo tháng, kỳ trả góp bằng nhau (annuity).
export function monthlyPayment(principal: number, annualRatePct: number, months: number) {
  const r = (annualRatePct / 100) / 12;
  if (r === 0) return principal / months;
  return principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export type AmortRow = {
  period: number;        // kỳ thứ n (tháng)
  payment: number;       // tiền trả kỳ này
  interest: number;      // tiền lãi
  principal: number;     // tiền gốc
  balance: number;       // dư nợ còn lại
};

export function amortizationSchedule(
  principal: number,
  annualRatePct: number,
  months: number,
  extraPerMonth = 0      // trả thêm gốc hàng tháng
): { schedule: AmortRow[]; totalInterest: number; lastPeriod: number } {
  const r = (annualRatePct / 100) / 12;
  const base = monthlyPayment(principal, annualRatePct, months);
  const schedule: AmortRow[] = [];
  let bal = principal;
  let totalInterest = 0;
  let p = 0;

  while (bal > 0 && p < 3600) { // chặn vô hạn
    p += 1;
    const interest = r * bal;
    let principalPay = base - interest + extraPerMonth;
    if (principalPay < 0) principalPay = 0;
    if (principalPay > bal + interest) principalPay = bal + interest;

    const payment = interest + principalPay;
    bal = Math.max(0, bal - principalPay);
    totalInterest += interest;

    schedule.push({
      period: p,
      payment,
      interest,
      principal: principalPay,
      balance: bal,
    });

    if (bal <= 0) break;
  }

  return { schedule, totalInterest, lastPeriod: p };
}

export function totalPaid(schedule: AmortRow[]) {
  return schedule.reduce((s, r) => s + r.payment, 0);
}

export function daysToMonths(days: number) {
  return Math.round(days / 30.4375);
}

// ===== ƯỚC TÍNH GIÁ TRỊ TÀI SẢN (BĐS) =====

export type ValuationInput = {
  areaM2: number;                  // diện tích sử dụng/đất
  basePricePerM2: number;          // đơn giá tham chiếu khu vực (VND/m2)
  frontageM: number;               // mặt tiền
  alleyWidthM: number;             // hẻm/đường trước nhà
  floors?: number;                 // số tầng (nếu nhà)
  conditionFactor?: number;        // 0.8..1.1 chất lượng/khấu hao
  legalFactor?: number;            // 0.7..1.0..1.05 sổ đỏ/công chứng/giấy tay
  marketFactor?: number;           // 0.9..1.1 tín hiệu thị trường
  corner?: boolean;                // nhà góc 2 mặt
  nearMainRoad?: boolean;          // gần trục chính
  shapePenalty?: number;           // 0.9 nếu nở hậu/xéo, 1 nếu vuông
};

export type ValuationOutput = {
  estimatedValue: number;          // VND
  breakdown: Record<string, number>;
};

// Quy tắc điều chỉnh đơn giản (comparative/hedonic nhẹ):
export function estimatePropertyValue(input: ValuationInput): ValuationOutput {
  const {
    areaM2,
    basePricePerM2,
    frontageM,
    alleyWidthM,
    floors = 1,
    conditionFactor = 1,
    legalFactor = 1,
    marketFactor = 1,
    corner = false,
    nearMainRoad = false,
    shapePenalty = 1,
  } = input;

  // Hệ số theo hẻm/đường
  let roadFactor = 1;
  if (alleyWidthM >= 12) roadFactor = 1.10;
  else if (alleyWidthM >= 8) roadFactor = 1.06;
  else if (alleyWidthM >= 5) roadFactor = 1.03;
  else if (alleyWidthM <= 2) roadFactor = 0.92;

  // Hệ số theo mặt tiền
  let frontageFactor = 1;
  if (frontageM >= 8) frontageFactor = 1.08;
  else if (frontageM >= 6) frontageFactor = 1.05;
  else if (frontageM < 3.2) frontageFactor = 0.95;

  // Góc 2 mặt tiền/ gần trục chính
  const cornerFactor = corner ? 1.05 : 1;
  const mainRoadFactor = nearMainRoad ? 1.03 : 1;

  // Số tầng (thô): mỗi tầng thêm 3% (ví dụ nhà phố), capped 15%
  const floorsFactor = Math.min(1 + 0.03 * (floors - 1), 1.15);

  const perM2 = basePricePerM2
    * roadFactor
    * frontageFactor
    * cornerFactor
    * mainRoadFactor
    * conditionFactor
    * legalFactor
    * marketFactor
    * shapePenalty;

  const landComponent = areaM2 * perM2;
  const buildingComponent = areaM2 * basePricePerM2 * (floorsFactor - 1); // phần cộng thêm do tầng

  const estimatedValue = Math.max(0, Math.round(landComponent + buildingComponent));

  return {
    estimatedValue,
    breakdown: {
      perM2,
      roadFactor,
      frontageFactor,
      cornerFactor,
      mainRoadFactor,
      conditionFactor,
      legalFactor,
      marketFactor,
      shapePenalty,
      floorsFactor,
      landComponent,
      buildingComponent,
    },
  };
}

// Loan-To-Value: số tiền vay tối đa theo % tài sản (thường 60–80%)
export function ltvMax(estimatedValue: number, ltvPct: number) {
  return Math.max(0, Math.round(estimatedValue * (ltvPct / 100)));
}
