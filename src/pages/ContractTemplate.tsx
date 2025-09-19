// src/pages/contracts/ContractTemplate.tsx
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, User, MapPin, DollarSign, Calendar } from "lucide-react";

// NEW: libs xuất file
import { saveAs } from "file-saver";
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle
} from "docx";

const ContractTemplate = () => {
  const { toast } = useToast();
  // NEW: vùng ẩn để render HTML xuất PDF
  const printRef = useRef<HTMLDivElement>(null);

  const [contractData, setContractData] = useState({
    // Buyer information
    buyerName: "",
    buyerIdCard: "",
    buyerAddress: "",
    buyerPhone: "",

    // Seller information
    sellerName: "",
    sellerIdCard: "",
    sellerAddress: "",
    sellerPhone: "",

    // Property information
    propertyAddress: "",
    propertyArea: "",
    propertyDescription: "",

    // Financial information
    totalPrice: "",
    depositAmount: "",
    paymentTerms: "",

    // Contract information
    contractDate: new Date().toISOString().split("T")[0],
    handoverDate: "",
    additionalTerms: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setContractData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatCurrency = (amount: string) => {
    if (!amount) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));
  };

  const generateContractHTML = () => {
    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hợp đồng mua bán nhà đất</title>
        <style>
          body { font-family: 'Times New Roman', serif; line-height: 1.6; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 20px; font-weight: bold; text-transform: uppercase; }
          .subtitle { font-size: 16px; margin-top: 10px; }
          .content { margin: 20px 0; }
          .section { margin: 15px 0; }
          .section-title { font-weight: bold; margin-bottom: 10px; }
          .party { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
          .signature-section { margin-top: 40px; display: flex; justify-content: space-between; gap: 40px; }
          .signature-box { text-align: center; width: 50%; }
          .signature-line { border-top: 1px solid #000; margin-top: 60px; padding-top: 5px; }
          @media print { body { margin: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
          <div class="subtitle">Độc lập - Tự do - Hạnh phúc</div>
          <div style="margin: 20px 0;">***---***</div>
          <div class="title">HỢP ĐỒNG MUA BÁN NHÀ ĐẤT</div>
        </div>

        <div class="content">
          <div class="section">
            <div class="section-title">Căn cứ:</div>
            <div>- Bộ luật Dân sự năm 2015;</div>
            <div>- Luật Nhà ở năm 2014;</div>
            <div>- Luật Đất đai năm 2013;</div>
            <div>- Các văn bản pháp luật có liên quan khác.</div>
          </div>

          <div class="section">
            <div class="section-title">Hôm nay, ngày ${new Date(contractData.contractDate).toLocaleDateString('vi-VN')}, tại ${contractData.propertyAddress || "____________"}, chúng tôi gồm:</div>
          </div>

          <div class="party">
            <div class="section-title">BÊN A (BÊN BÁN):</div>
            <div>Họ và tên: ${contractData.sellerName || "____________"}</div>
            <div>CMND/CCCD số: ${contractData.sellerIdCard || "____________"}</div>
            <div>Địa chỉ thường trú: ${contractData.sellerAddress || "____________"}</div>
            <div>Số điện thoại: ${contractData.sellerPhone || "____________"}</div>
          </div>

          <div class="party">
            <div class="section-title">BÊN B (BÊN MUA):</div>
            <div>Họ và tên: ${contractData.buyerName || "____________"}</div>
            <div>CMND/CCCD số: ${contractData.buyerIdCard || "____________"}</div>
            <div>Địa chỉ thường trú: ${contractData.buyerAddress || "____________"}</div>
            <div>Số điện thoại: ${contractData.buyerPhone || "____________"}</div>
          </div>

          <div class="section">
            <div class="section-title">ĐIỀU 1: ĐỐI TƯỢNG MUA BÁN</div>
            <div>Bên A đồng ý bán và Bên B đồng ý mua bất động sản có thông tin như sau:</div>
            <div>- Địa chỉ: ${contractData.propertyAddress || "____________"}</div>
            <div>- Diện tích: ${contractData.propertyArea || "____________"} m²</div>
            <div>- Mô tả: ${contractData.propertyDescription || "____________"}</div>
          </div>

          <div class="section">
            <div class="section-title">ĐIỀU 2: GIÁ BÁN VÀ PHƯƠNG THỨC THANH TOÁN</div>
            <div>- Tổng giá trị hợp đồng: ${contractData.totalPrice ? formatCurrency(contractData.totalPrice) : "____________"}</div>
            <div>- Tiền đặt cọc: ${contractData.depositAmount ? formatCurrency(contractData.depositAmount) : "____________"}</div>
            <div>- Phương thức thanh toán: ${contractData.paymentTerms || "____________"}</div>
          </div>

          <div class="section">
            <div class="section-title">ĐIỀU 3: THỜI GIAN GIAO NHẬN</div>
            <div>Thời gian giao nhận bất động sản: ${contractData.handoverDate ? new Date(contractData.handoverDate).toLocaleDateString('vi-VN') : "____________"}</div>
          </div>

          ${contractData.additionalTerms ? `
          <div class="section">
            <div class="section-title">ĐIỀU 4: CÁC ĐIỀU KHOẢN KHÁC</div>
            <div>${contractData.additionalTerms}</div>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">HIỆU LỰC HỢP ĐỒNG</div>
            <div>Hợp đồng có hiệu lực kể từ ngày ký và được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.</div>
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <div><strong>BÊN A (BÊN BÁN)</strong></div>
              <div style="font-style: italic;">(Ký và ghi rõ họ tên)</div>
              <div class="signature-line">${contractData.sellerName || ""}</div>
            </div>
            <div class="signature-box">
              <div><strong>BÊN B (BÊN MUA)</strong></div>
              <div style="font-style: italic;">(Ký và ghi rõ họ tên)</div>
              <div class="signature-line">${contractData.buyerName || ""}</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // (giữ nguyên) Tải HTML
  const downloadContract = () => {
    const htmlContent = generateContractHTML();
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    saveAs(blob, `hop-dong-mua-ban-nha-dat-${contractData.contractDate}.html`);
    toast({
      title: "Thành công",
      description: "Hợp đồng (HTML) đã được tải xuống. Bạn có thể mở và in ra PDF.",
    });
  };

  // NEW: Tải PDF (ESM dynamic import để tránh require)
const downloadPDF = async () => {
  const { default: html2pdf } = await import("html2pdf.js");

  // Parse lấy phần <body> để tránh lồng <html> trong <div>
  const parser = new DOMParser();
  const doc = parser.parseFromString(generateContractHTML(), "text/html");

  // Tạo container tạm (khổ A4 ~ 794x1123px ở 96dpi)
  const container = document.createElement("div");
  container.style.width = "794px";
  container.style.minHeight = "1123px";
  container.style.background = "#fff";
  container.style.padding = "0";
  container.style.margin = "0 auto";
  container.innerHTML = doc.body.innerHTML; // chỉ nhét nội dung body

  document.body.appendChild(container);

  const opt = {
    margin: 0,
    filename: `hop-dong-mua-ban-nha-dat-${contractData.contractDate}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
    jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css", "legacy"] },
  };

  await html2pdf().from(container).set(opt).save(); // <— dùng container, KHÔNG dùng printRef
  document.body.removeChild(container);

  toast({ title: "Thành công", description: "Hợp đồng (PDF) đã được tạo." });
};

  // NEW: Tải DOCX (văn bản để chỉnh trong Word)
  const downloadDOCX = async () => {
  // Helpers
  const P = (text: string, opts: Partial<Paragraph> = {}) =>
    new Paragraph({
      children: [new TextRun({ text })],
      spacing: { after: 120 },
      ...opts,
    });

  const LabelValue = (label: string, value: string) =>
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: `${label}: `, bold: true }),
        new TextRun({ text: value }),
      ],
    });

  const SectionTitle = (text: string) =>
    new Paragraph({
      spacing: { before: 200, after: 120 },
      children: [new TextRun({ text, bold: true })],
    });

  // Data
  const f = (n: string) => (n ? new Intl.NumberFormat("vi-VN").format(Number(n)) + " ₫" : "____________");

  // Document
  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: "Times New Roman", size: 24 }, paragraph: { spacing: { line: 276 } } }, // 12pt, 1.15
      },
    },
    sections: [
      {
        properties: {
          page: { margin: { top: 720, right: 720, bottom: 720, left: 960 } }, // 2cm/2.54cm
        },
        children: [
          // Quốc hiệu - Tiêu ngữ
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [new TextRun({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({ text: "Độc lập - Tự do - Hạnh phúc" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 240 },
            children: [new TextRun({ text: "HỢP ĐỒNG MUA BÁN NHÀ ĐẤT", bold: true })],
          }),

          LabelValue("Ngày ký", new Date(contractData.contractDate).toLocaleDateString("vi-VN")),
          LabelValue("Địa điểm", contractData.propertyAddress || "____________"),

          // BÊN A
          SectionTitle("BÊN A (BÊN BÁN)"),
          LabelValue("Họ và tên", contractData.sellerName || "____________"),
          LabelValue("CMND/CCCD", contractData.sellerIdCard || "____________"),
          LabelValue("Địa chỉ", contractData.sellerAddress || "____________"),
          LabelValue("Số điện thoại", contractData.sellerPhone || "____________"),

          // BÊN B
          SectionTitle("BÊN B (BÊN MUA)"),
          LabelValue("Họ và tên", contractData.buyerName || "____________"),
          LabelValue("CMND/CCCD", contractData.buyerIdCard || "____________"),
          LabelValue("Địa chỉ", contractData.buyerAddress || "____________"),
          LabelValue("Số điện thoại", contractData.buyerPhone || "____________"),

          // ĐIỀU 1
          SectionTitle("ĐIỀU 1: ĐỐI TƯỢNG MUA BÁN"),
          LabelValue("Địa chỉ BĐS", contractData.propertyAddress || "____________"),
          LabelValue("Diện tích", (contractData.propertyArea ? contractData.propertyArea + " m²" : "____________")),
          LabelValue("Mô tả", contractData.propertyDescription || "____________"),

          // ĐIỀU 2
          SectionTitle("ĐIỀU 2: GIÁ BÁN & THANH TOÁN"),
          LabelValue("Tổng giá trị", contractData.totalPrice ? f(contractData.totalPrice) : "____________"),
          LabelValue("Đặt cọc", contractData.depositAmount ? f(contractData.depositAmount) : "____________"),
          LabelValue("Phương thức thanh toán", contractData.paymentTerms || "____________"),

          // ĐIỀU 3
          SectionTitle("ĐIỀU 3: THỜI GIAN GIAO NHẬN"),
          LabelValue("Bàn giao", contractData.handoverDate
            ? new Date(contractData.handoverDate).toLocaleDateString("vi-VN")
            : "____________"),

          // ĐIỀU 4 (nếu có)
          ...(contractData.additionalTerms
            ? [SectionTitle("ĐIỀU 4: CÁC ĐIỀU KHOẢN KHÁC"), P(contractData.additionalTerms)]
            : []),

          SectionTitle("HIỆU LỰC HỢP ĐỒNG"),
          P(
            "Hợp đồng có hiệu lực kể từ ngày ký và được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản."
          ),

          // Ký tên (bảng 2 cột)
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "BÊN A (BÊN BÁN)", bold: true })],
                      }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true })] }),
                      new Paragraph({ spacing: { before: 720 }, alignment: AlignmentType.CENTER, children: [new TextRun(contractData.sellerName || "")] }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "BÊN B (BÊN MUA)", bold: true })],
                      }),
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "(Ký và ghi rõ họ tên)", italics: true })] }),
                      new Paragraph({ spacing: { before: 720 }, alignment: AlignmentType.CENTER, children: [new TextRun(contractData.buyerName || "")] }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `hop-dong-mua-ban-nha-dat-${contractData.contractDate}.docx`);
  toast({ title: "Thành công", description: "Đã xuất hợp đồng DOCX." });
};

  // KHÔNG bọc Layout ở đây; DashboardLayout sẽ bọc qua <Outlet />
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <FileText className="h-8 w-8" />
          Mẫu hợp đồng mua bán nhà đất
        </h1>
        <p className="text-muted-foreground">
          Điền thông tin để tạo hợp đồng mua bán nhà đất chuẩn
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Buyer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin bên mua
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="buyerName">Họ và tên</Label>
                <Input
                  id="buyerName"
                  value={contractData.buyerName}
                  onChange={(e) => handleInputChange("buyerName", e.target.value)}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div>
                <Label htmlFor="buyerIdCard">CMND/CCCD</Label>
                <Input
                  id="buyerIdCard"
                  value={contractData.buyerIdCard}
                  onChange={(e) => handleInputChange("buyerIdCard", e.target.value)}
                  placeholder="123456789"
                />
              </div>
              <div>
                <Label htmlFor="buyerAddress">Địa chỉ thường trú</Label>
                <Input
                  id="buyerAddress"
                  value={contractData.buyerAddress}
                  onChange={(e) => handleInputChange("buyerAddress", e.target.value)}
                  placeholder="123 Phố ABC, Quận XYZ, Hà Nội"
                />
              </div>
              <div>
                <Label htmlFor="buyerPhone">Số điện thoại</Label>
                <Input
                  id="buyerPhone"
                  value={contractData.buyerPhone}
                  onChange={(e) => handleInputChange("buyerPhone", e.target.value)}
                  placeholder="0123456789"
                />
              </div>
            </CardContent>
          </Card>

          {/* Seller Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Thông tin bên bán
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sellerName">Họ và tên</Label>
                <Input
                  id="sellerName"
                  value={contractData.sellerName}
                  onChange={(e) => handleInputChange("sellerName", e.target.value)}
                  placeholder="Trần Thị B"
                />
              </div>
              <div>
                <Label htmlFor="sellerIdCard">CMND/CCCD</Label>
                <Input
                  id="sellerIdCard"
                  value={contractData.sellerIdCard}
                  onChange={(e) => handleInputChange("sellerIdCard", e.target.value)}
                  placeholder="987654321"
                />
              </div>
              <div>
                <Label htmlFor="sellerAddress">Địa chỉ thường trú</Label>
                <Input
                  id="sellerAddress"
                  value={contractData.sellerAddress}
                  onChange={(e) => handleInputChange("sellerAddress", e.target.value)}
                  placeholder="456 Phố DEF, Quận GHI, Hà Nội"
                />
              </div>
              <div>
                <Label htmlFor="sellerPhone">Số điện thoại</Label>
                <Input
                  id="sellerPhone"
                  value={contractData.sellerPhone}
                  onChange={(e) => handleInputChange("sellerPhone", e.target.value)}
                  placeholder="0987654321"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Property Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Thông tin bất động sản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="propertyAddress">Địa chỉ bất động sản</Label>
                <Input
                  id="propertyAddress"
                  value={contractData.propertyAddress}
                  onChange={(e) => handleInputChange("propertyAddress", e.target.value)}
                  placeholder="789 Phố JKL, Quận MNO, Hà Nội"
                />
              </div>
              <div>
                <Label htmlFor="propertyArea">Diện tích (m²)</Label>
                <Input
                  id="propertyArea"
                  type="number"
                  value={contractData.propertyArea}
                  onChange={(e) => handleInputChange("propertyArea", e.target.value)}
                  placeholder="100"
                />
              </div>
              <div>
                <Label htmlFor="propertyDescription">Mô tả bất động sản</Label>
                <Textarea
                  id="propertyDescription"
                  value={contractData.propertyDescription}
                  onChange={(e) => handleInputChange("propertyDescription", e.target.value)}
                  placeholder="Nhà 3 tầng, 4 phòng ngủ, có sân vườn..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Thông tin tài chính
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="totalPrice">Tổng giá trị (VNĐ)</Label>
                <Input
                  id="totalPrice"
                  type="number"
                  value={contractData.totalPrice}
                  onChange={(e) => handleInputChange("totalPrice", e.target.value)}
                  placeholder="2000000000"
                />
                {contractData.totalPrice && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatCurrency(contractData.totalPrice)}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="depositAmount">Tiền đặt cọc (VNĐ)</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  value={contractData.depositAmount}
                  onChange={(e) => handleInputChange("depositAmount", e.target.value)}
                  placeholder="200000000"
                />
                {contractData.depositAmount && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatCurrency(contractData.depositAmount)}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="paymentTerms">Phương thức thanh toán</Label>
                <Textarea
                  id="paymentTerms"
                  value={contractData.paymentTerms}
                  onChange={(e) => handleInputChange("paymentTerms", e.target.value)}
                  placeholder="Thanh toán 2 đợt: 50% khi ký hợp đồng, 50% khi bàn giao nhà..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contract Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Thông tin hợp đồng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contractDate">Ngày ký hợp đồng</Label>
                <Input
                  id="contractDate"
                  type="date"
                  value={contractData.contractDate}
                  onChange={(e) => handleInputChange("contractDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="handoverDate">Ngày bàn giao</Label>
                <Input
                  id="handoverDate"
                  type="date"
                  value={contractData.handoverDate}
                  onChange={(e) => handleInputChange("handoverDate", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="additionalTerms">Điều khoản bổ sung</Label>
                <Textarea
                  id="additionalTerms"
                  value={contractData.additionalTerms}
                  onChange={(e) => handleInputChange("additionalTerms", e.target.value)}
                  placeholder="Các điều khoản bổ sung (nếu có)..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button onClick={downloadDOCX} className="w-full" size="lg">
              <Download className="h-5 w-5 mr-2" />
              Tải DOCX
            </Button>
            <Button onClick={downloadPDF} variant="secondary" className="w-full" size="lg">
              <Download className="h-5 w-5 mr-2" />
              Tải PDF
            </Button>
            <Button onClick={downloadContract} variant="outline" className="w-full" size="lg">
              <Download className="h-5 w-5 mr-2" />
              Tải HTML
            </Button>
          </div>
        </div>
      </div>

      {/* vùng ẩn để html2pdf đọc DOM */}
      <div ref={printRef} style={{ position: "fixed", left: -99999, top: -99999 }} />
    </div>
  );
};

export default ContractTemplate;
