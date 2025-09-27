import { Heart, MapPin, Bed, Bath, Square, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

/** ---------------- Types ---------------- */
type Status = "Cần bán" | "Cho thuê" | "Đã bán";

interface PropertyCardProps {
  id: number | string;
  title?: string;
  price?: number | string | null;
  location?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  area?: number | null;
  parking?: number | null;
  image?: string | null;
  status?: Status;
  featured?: boolean;
}

/** ---------------- Helpers ---------------- */
function toNumber(value: unknown): number | null {
  if (typeof value === "number") return isFinite(value) ? value : null;
  if (typeof value === "string") {
    // Lấy số trong chuỗi, bỏ dấu chấm phẩy, VND, …
    const numeric = value.replace(/[^\d.-]/g, "");
    const n = Number(numeric);
    return isFinite(n) ? n : null;
  }
  return null;
}

function formatPrice(raw: unknown): string {
  const price = toNumber(raw);
  if (price === null) return "Giá thỏa thuận";

  if (price >= 1_000_000_000) {
    return `${(price / 1_000_000_000).toFixed(1)}B VND`;
  }
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(1)}M VND`;
  }
  return `${price.toLocaleString()} VND`;
}

const IMG_FALLBACK =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
       <rect width='100%' height='100%' fill='#f3f4f6'/>
       <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
             font-family='Inter,system-ui' font-size='16' fill='#9ca3af'>
         No Image
       </text>
     </svg>`
  );

/** ---------------- Component ---------------- */
export default function PropertyCard({
  id,
  title,
  price,
  location,
  bedrooms,
  bathrooms,
  area,
  parking,
  image,
  status = "Cần bán",
  featured = false,
}: PropertyCardProps) {
  const safeTitle = title || "Bất động sản";
  const safeImage = image || IMG_FALLBACK;
  const priceText = formatPrice(price);

  const showBedrooms = typeof bedrooms === "number";
  const showBathrooms = typeof bathrooms === "number";
  const showArea = typeof area === "number";
  const showParking = typeof parking === "number" && (parking ?? 0) > 0;

  return (
    <Link
      to={`/property/${id}`}
      className="group relative block overflow-hidden rounded-xl bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-hover"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={safeImage}
          alt={safeTitle}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = IMG_FALLBACK;
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Action */}
        <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
          <Button size="icon" variant="secondary" className="h-8 w-8 bg-card/80 backdrop-blur-sm">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Status */}
        <div className="absolute left-4 top-4">
          <Badge
            variant={status === "Đã bán" ? "destructive" : "default"}
            className={`${status === "Cần bán" ? "bg-accent" : status === "Cho thuê" ? "bg-warning" : ""} text-white`}
          >
            {status}
          </Badge>
        </div>

        {featured && (
          <div className="absolute left-20 top-4">
            <Badge className="bg-gradient-price text-white">Nổi bật</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Price */}
        <div className="mb-3">
          <span className="text-2xl font-bold text-price-text">{priceText}</span>
          {status === "Cho thuê" && <span className="ml-1 text-sm text-muted-foreground">/tháng</span>}
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold transition-colors group-hover:text-primary">
          {safeTitle}
        </h3>

        {/* Location */}
        {location && (
          <div className="mb-4 flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            {location}
          </div>
        )}

        {/* Specs */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            {showBedrooms && (
              <div className="flex items-center">
                <Bed className="mr-1 h-4 w-4" />
                {bedrooms}
              </div>
            )}
            {showBathrooms && (
              <div className="flex items-center">
                <Bath className="mr-1 h-4 w-4" />
                {bathrooms}
              </div>
            )}
            {showArea && (
              <div className="flex items-center">
                <Square className="mr-1 h-4 w-4" />
                {area}m²
              </div>
            )}
            {showParking && (
              <div className="flex items-center">
                <Car className="mr-1 h-4 w-4" />
                {parking}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
