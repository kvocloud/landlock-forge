import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, slug, name, cover_image_url, location_text")
        .order("created_at", { ascending: false });
      setProjects(data || []);
    })();
  }, []);

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

        <section className="py-12 container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Link
                key={p.id}
                to={`/du-an/${p.slug}`}
                className="block rounded-xl overflow-hidden border hover:shadow-md"
              >
                <img
                  src={p.cover_image_url || ""}
                  alt={p.name}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2">{p.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {p.location_text}
                  </p>
                </div>
              </Link>
            ))}
            {projects.length === 0 && (
              <div className="text-muted-foreground">Chưa có dự án nào.</div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
