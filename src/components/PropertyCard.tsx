import { Heart, MapPin, Bed, Bath, Square, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

interface PropertyCardProps {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking?: number;
  image: string;
  status?: "Cần bán" | "Cho thuê" | "Đã bán";
  featured?: boolean;
}

const PropertyCard = ({
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
  featured = false
}: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)}B VND`;
    } else if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M VND`;
    } else {
      return `${price.toLocaleString()} VND`;
    }
  };

  return (
    <Link to={`/property/${id}`} className="group relative overflow-hidden rounded-xl bg-card shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 block">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Overlay actions */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" className="h-8 w-8 bg-card/80 backdrop-blur-sm">
            <Heart className="h-4 w-4" />
          </Button>
        </div>

        {/* Status badge */}
        <div className="absolute top-4 left-4">
          <Badge 
            variant={status === "Đã bán" ? "destructive" : "default"}
            className={`${status === "Cần bán" ? "bg-accent" : status === "Cho thuê" ? "bg-warning" : ""} text-white`}
          >
            {status}
          </Badge>
        </div>

        {featured && (
          <div className="absolute top-4 left-20">
            <Badge className="bg-gradient-price text-white">
              Nổi bật
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Price */}
        <div className="mb-3">
          <span className="text-2xl font-bold text-price-text">
            {formatPrice(price)}
          </span>
          {status === "Cho thuê" && (
            <span className="text-muted-foreground text-sm ml-1">/tháng</span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="h-4 w-4 mr-1" />
          {location}
        </div>

        {/* Property details */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {bedrooms}
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {bathrooms}
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              {area}m²
            </div>
            {parking && parking > 0 && (
              <div className="flex items-center">
                <Car className="h-4 w-4 mr-1" />
                {parking}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;