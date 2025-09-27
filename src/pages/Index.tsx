import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SearchFilters from "@/components/SearchFilters";
import FeaturedProperties from "@/components/FeaturedProperties";
import StatsSection from "@/components/StatsSection";
import Footer from "@/components/Footer";
import BlogShowcase from "@/components/BlogShowcase";
import NewsSection from "@/components/NewsSection";

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
                Tìm Bất Động Sản Hoàn Hảo
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Sử dụng bộ lọc tìm kiếm nâng cao để khám phá những bất động sản phù hợp với yêu cầu và ngân sách của bạn.
              </p>
            </div>
            <SearchFilters />
          </div>
        </section>

        <FeaturedProperties />
        <StatsSection />
        <BlogShowcase />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
