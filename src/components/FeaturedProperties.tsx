import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "./PropertyCard";
import { getFeaturedProperties } from "@/data/mockProperties";

const FeaturedProperties = () => {
  const featuredProperties = getFeaturedProperties();

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bất Động Sản Nổi Bật
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Khám phá bộ sưu tập những bất động sản cao cấp được chọn lọc kỹ lưỡng, nổi bật về chất lượng và vị trí đắc địa.
            </p>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              price={property.price}
              location={property.location}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              area={property.area}
              parking={property.parking}
              image={property.image}
              status={property.status}
              featured={property.featured}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button size="lg" variant="hero">
            Xem Tất Cả Bất Động Sản
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;