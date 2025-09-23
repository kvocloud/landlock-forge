import { useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import PropertyCard from "@/components/PropertyCard";
import { mockProperties } from "@/data/mockProperties";
import { BUY_CATS, RENT_CATS, PROJECT_CATS } from "@/constants/categories";

export default function ListingByCategory({ mode }: { mode: "buy" | "rent" | "project" }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const categoryQS = params.get("category") || "";
  const [category, setCategory] = useState<string>(categoryQS);

  const cats = mode === "buy" ? BUY_CATS : mode === "rent" ? RENT_CATS : PROJECT_CATS;

  const list = useMemo(() => {
  let rows = mockProperties.filter((p) =>
    mode === "buy" ? p.status === "Cần bán" : mode === "rent" ? p.status === "Cho thuê" : p.status === "Dự án"
  );
  if (category) rows = rows.filter((p) => p.category === category);
  return rows;
}, [mode, category]);

  return (
    <div className="container mx-auto px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>
            {mode === "buy"
              ? "Nhà đất bán"
              : mode === "rent"
              ? "Nhà đất cho thuê"
              : "Dự án bất động sản"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v);
              const u = new URL(window.location.href);
              if (v) u.searchParams.set("category", v);
              else u.searchParams.delete("category");
              window.history.replaceState({}, "", u.toString());
            }}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Chọn loại" />
            </SelectTrigger>
            <SelectContent>
              {cats.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {category && (
            <Link
              to={location.pathname}
              className="text-sm text-primary underline underline-offset-4"
              onClick={() => setCategory("")}
            >
              Xoá lọc
            </Link>
          )}
        </CardContent>
      </Card>

      <div className="mb-4 text-sm text-muted-foreground">
        Tìm thấy <b>{list.length}</b> kết quả
        {category ? ` • Loại: ${cats.find(c => c.slug === category)?.label}` : ""}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {list.map((p) => (
          <PropertyCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}
