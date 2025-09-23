import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchFilters from "@/components/SearchFilters";
import PropertyCard from "@/components/PropertyCard";
import { mockProperties } from "@/data/mockProperties";
import ListingByCategorySupabase from "@/pages/ListingByCategorySupabase";

const Rent = () => {
  const propertiesForRent = mockProperties.filter(property => property.status === "Cho thuê");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Thuê Bất Động Sản
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Tìm kiếm căn hộ, nhà ở cho thuê với giá tốt nhất thị trường
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <SearchFilters />
          </div>
        </section>

        {/* Properties Grid */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Bất động sản cho thuê</h2>
              <p className="text-muted-foreground">
                Tìm thấy {propertiesForRent.length} bất động sản phù hợp
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {propertiesForRent.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </div>
        </section>
        <section className="py-12">
          <ListingByCategorySupabase mode="rent" />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Rent;
