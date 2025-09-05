import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SearchFilters from "@/components/SearchFilters";
import FeaturedProperties from "@/components/FeaturedProperties";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        
        {/* Search Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Find Your Perfect Property
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Use our advanced search filters to discover properties that match your exact requirements and budget.
              </p>
            </div>
            <SearchFilters />
          </div>
        </section>

        <FeaturedProperties />
        <StatsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
