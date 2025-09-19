import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { monthlyPayment, amortizationSchedule, totalPaid } from "@/lib/finance";

export default function LoanCalculator() {
  const [form, setForm] = useState({
    principal: 2000000000,   // 2 tỷ
    annualRatePct: 11,       // 11%/năm
    months: 240,             // 20 năm
    extraPerMonth: 0,
  });

  const result = useMemo(() => {
    const base = monthlyPayment(form.principal, form.annualRatePct, form.months);
    const { schedule, totalInterest, lastPeriod } =
      amortizationSchedule(form.principal, form.annualRatePct, form.months, form.extraPerMonth);

    return {
      baseMonthly: base,
      totalInterest,
      totalPaid: totalPaid(schedule),
      monthsActually: lastPeriod,
      schedule,
    };
  }, [form]);

  const nf = (n: number) => new Intl.NumberFormat("vi-VN").format(Math.round(n));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Tool Tính Lãi Suất Vay (Amortization)</h1>

      <Card>
        <CardHeader><CardTitle>Nhập thông tin</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Số tiền vay (VND)</Label>
            <Input type="number" value={form.principal}
              onChange={(e) => setForm({ ...form, principal: +e.target.value })} />
          </div>
          <div>
            <Label>Lãi suất %/năm</Label>
            <Input type="number" step="0.01" value={form.annualRatePct}
              onChange={(e) => setForm({ ...form, annualRatePct: +e.target.value })} />
          </div>
          <div>
            <Label>Thời hạn (tháng)</Label>
            <Input type="number" value={form.months}
              onChange={(e) => setForm({ ...form, months: +e.target.value })} />
          </div>
          <div>
            <Label>Trả thêm gốc mỗi tháng (VND)</Label>
            <Input type="number" value={form.extraPerMonth}
              onChange={(e) => setForm({ ...form, extraPerMonth: +e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <Button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}>
              Xem bảng chi tiết
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Kết quả nhanh</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Gốc+lãi / tháng" value={`${nf(result.baseMonthly + form.extraPerMonth)} đ`} />
          <Stat label="Tổng lãi phải trả" value={`${nf(result.totalInterest)} đ`} />
          <Stat label="Tổng tiền phải trả" value={`${nf(result.totalPaid)} đ`} />
          <Stat label="Số tháng thực tế" value={`${result.monthsActually} tháng`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Bảng khấu hao (12 kỳ đầu)</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left p-2">Kỳ</th>
                <th className="text-right p-2">Trả kỳ này</th>
                <th className="text-right p-2">Lãi</th>
                <th className="text-right p-2">Gốc</th>
                <th className="text-right p-2">Dư nợ</th>
              </tr>
            </thead>
            <tbody>
              {result.schedule.slice(0, 12).map((r) => (
                <tr key={r.period} className="border-b">
                  <td className="p-2">{r.period}</td>
                  <td className="p-2 text-right">{nf(r.payment)}</td>
                  <td className="p-2 text-right">{nf(r.interest)}</td>
                  <td className="p-2 text-right">{nf(r.principal)}</td>
                  <td className="p-2 text-right">{nf(r.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className="text-base font-semibold">{value}</div>
    </div>
  );
}
