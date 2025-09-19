import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { estimatePropertyValue, ltvMax } from "@/lib/finance";

export default function CollateralEstimator() {
  const [form, setForm] = useState({
    areaM2: 60,
    basePricePerM2: 40000000, // 40 triệu/m2
    frontageM: 4,
    alleyWidthM: 4,
    floors: 2,
    conditionFactor: 1,   // 0.8..1.1
    legalFactor: 1,       // 0.7..1.05
    marketFactor: 1,      // 0.9..1.1
    corner: false,
    nearMainRoad: false,
    shapePenalty: 1,      // 0.9..1
    ltvPct: 70,
  });

  const res = useMemo(() => estimatePropertyValue(form), [form]);
  const maxLoan = useMemo(() => ltvMax(res.estimatedValue, form.ltvPct), [res, form.ltvPct]);
  const nf = (n: number) => new Intl.NumberFormat("vi-VN").format(Math.round(n));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Tool Ước tính Giá trị TSBĐ (BĐS)</h1>

      <Card>
        <CardHeader><CardTitle>Thông tin đầu vào</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Diện tích (m²)" value={form.areaM2}
                 onChange={(v) => setForm({ ...form, areaM2: +v })} />
          <Field label="Đơn giá tham chiếu (đ/m²)" value={form.basePricePerM2}
                 onChange={(v) => setForm({ ...form, basePricePerM2: +v })} />
          <Field label="Mặt tiền (m)" value={form.frontageM}
                 onChange={(v) => setForm({ ...form, frontageM: +v })} />
          <Field label="Lộ giới/Hẻm (m)" value={form.alleyWidthM}
                 onChange={(v) => setForm({ ...form, alleyWidthM: +v })} />
          <Field label="Số tầng" value={form.floors}
                 onChange={(v) => setForm({ ...form, floors: +v })} />
          <Field label="Condition factor (0.8–1.1)" value={form.conditionFactor}
                 onChange={(v) => setForm({ ...form, conditionFactor: +v })} step="0.01" />
          <Field label="Legal factor (0.7–1.05)" value={form.legalFactor}
                 onChange={(v) => setForm({ ...form, legalFactor: +v })} step="0.01" />
          <Field label="Market factor (0.9–1.1)" value={form.marketFactor}
                 onChange={(v) => setForm({ ...form, marketFactor: +v })} step="0.01" />
          <Field label="Shape penalty (0.9–1)" value={form.shapePenalty}
                 onChange={(v) => setForm({ ...form, shapePenalty: +v })} step="0.01" />

          <div className="flex items-center gap-2">
            <Checkbox checked={form.corner} onCheckedChange={(c) => setForm({ ...form, corner: Boolean(c) })} />
            <Label>Nhà góc 2 mặt</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={form.nearMainRoad} onCheckedChange={(c) => setForm({ ...form, nearMainRoad: Boolean(c) })} />
            <Label>Gần trục chính</Label>
          </div>

          <Field label="Tỷ lệ LTV tối đa (%)" value={form.ltvPct}
                 onChange={(v) => setForm({ ...form, ltvPct: +v })} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Kết quả</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Stat label="Giá trị ước tính" value={`${nf(res.estimatedValue)} đ`} />
          <Stat label="Vay tối đa (LTV)" value={`${nf(maxLoan)} đ`} />
          <Stat label="Đơn giá sau điều chỉnh" value={`${nf(res.breakdown.perM2)} đ/m²`} />
        </CardContent>

        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {Object.entries(res.breakdown).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-muted-foreground">{k}</span>
              <span>{typeof v === "number" ? nf(v) : String(v)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label, value, onChange, step,
}: { label: string; value: number; onChange: (v: string) => void; step?: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input type="number" step={step || "1"} value={value} onChange={(e) => onChange(e.target.value)} />
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
