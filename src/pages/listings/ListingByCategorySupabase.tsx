import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import PropertyCard from "@/components/PropertyCard";
import { BUY_CATS, RENT_CATS, PROJECT_CATS } from "@/constants/categories";

type Mode = "buy" | "rent" | "project";

type Listing = {
  id: string | number;
  title: string;
  image?: string;
  price?: number;
  area?: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  segment?: "BUY" | "RENT" | "PROJECT";
  category_slug?: string;
};

// Mock dữ liệu tạm
const MOCK_ITEMS: Listing[] = [
  {
    id: 1,
    title: "Căn hộ cao cấp Quận 1",
    image: "https://via.placeholder.com/400x250",
    price: 5000000000,
    area: 75,
    location: "Quận 1, TP.HCM",
    bedrooms: 2,
    bathrooms: 2,
    segment: "BUY",
    category_slug: "can-ho-chung-cu",
  },
  {
    id: 2,
    title: "Nhà nguyên căn cho thuê Quận 7",
    image: "https://via.placeholder.com/400x250",
    price: 15000000,
    area: 120,
    location: "Quận 7, TP.HCM",
    bedrooms: 3,
    bathrooms: 3,
    segment: "RENT",
    category_slug: "nha-rieng",
  },
];

export default function ListingByCategorySupabase({ mode }: { mode: Mode }) {
  const { search, pathname } = useLocation();
  const params = useMemo(() => new URLSearchParams(search), [search]);

  const [category, setCategory] = useState<string>(params.get("category") || "");
  const [items, setItems] = useState<Listing[]>([]);

  const cats = mode === "buy" ? BUY_CATS : mode === "rent" ? RENT_CATS : PROJECT_CATS;

  // Đồng bộ category từ URL
  useEffect(() => {
    setCategory(params.get("category") || "");
  }, [params]);

  // Load mock data
  useEffect(() => {
    const segment: Listing["segment"] =
      mode === "buy" ? "BUY" : mode === "rent" ? "RENT" : "PROJECT";

    let data = MOCK_ITEMS.filter((i) => i.segment === segment);

    if (category) {
      data = data.filter((i) => i.category_slug === category);
    }

    setItems(data);
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
              to={pathname}
              className="text-sm text-primary underline underline-offset-4"
              onClick={() => setCategory("")}
            >
              Xoá lọc
            </Link>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((p) => (
          <PropertyCard
            key={String(p.id)}
            id={String(p.id)}
            title={p.title}
            image={p.image}
            price={p.price}
            area={p.area}
            location={p.location}
            bedrooms={p.bedrooms}
            bathrooms={p.bathrooms}
          />
        ))}
      </div>
    </div>
  );
}
