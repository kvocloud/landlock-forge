import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListingByCategorySupabase from "@/pages/listings/ListingByCategorySupabase";

const Projects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="bg-gradient-hero py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Dự án bất động sản
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Khám phá các dự án căn hộ, khu đô thị, nghỉ dưỡng nổi bật
            </p>
          </div>
        </section>

        <section className="py-12">
          <ListingByCategorySupabase mode="project" />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Projects;
