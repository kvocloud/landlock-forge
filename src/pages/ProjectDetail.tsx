// src/pages/ProjectDetail.tsx
import React from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import {
  MapPin,
  Building2,
  Phone,
  Globe,
  Mail,
  Facebook,
  Youtube,
  Music4,
} from "lucide-react";

type Project = {
  id: string;
  slug: string;
  name: string;
  slogan?: string;
  cover_image_url?: string;
  overview_html?: string;
  location_text?: string;
  total_area_ha?: number | null;
  units_count?: number | null;
  product_types?: string[];
  email?: string;
  // các trường chi tiết bổ sung
  owner?: string; // chủ đầu tư
  manager?: string; // đơn vị quản lý, vận hành
  distributor?: string; // đơn vị phân phối
  social_links?: {
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    hotline?: string;
    website?: string;
  };
};

type ProjectDoc = {
  id: string;
  project_id: string;
  title: string;
  type: string;
  file_url: string;
  thumb_url?: string;
};

type ProjectMedia = {
  id: string;
  project_id: string;
  kind: "image" | "video";
  url: string;
  caption?: string;
  order?: number | null;
};

function KV({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-semibold">{children}</div>
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [project, setProject] = React.useState<Project | null>(null);
  const [docs, setDocs] = React.useState<ProjectDoc[]>([]);
  const [media, setMedia] = React.useState<ProjectMedia[]>([]);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // 1) project
        const { data: proj, error: e1 } = await supabase
          .from("projects")
          .select("*")
          .eq("slug", slug)
          .single();
        if (e1) throw e1;
        if (!alive) return;

        setProject(proj as Project);

        // 2) docs
        const { data: d } = await supabase
          .from("project_documents")
          .select("*")
          .eq("project_id", (proj as Project).id)
          .order("created_at", { ascending: true });
        setDocs(d || []);

        // 3) media
        const { data: m } = await supabase
          .from("project_media")
          .select("*")
          .eq("project_id", (proj as Project).id)
          .order("order", { ascending: true, nullsFirst: true })
          .order("created_at", { ascending: true });
        setMedia(m || []);
      } catch (_err) {
        // silent: sẽ hiện "Không tìm thấy dự án." phía dưới
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">Đang tải…</main>
        <Footer />
      </div>
    );
  }
  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">Không tìm thấy dự án.</main>
        <Footer />
      </div>
    );
  }

  const images = (media || []).filter((m) => m.kind === "image");
  const heroImg =
    project.cover_image_url || images[0]?.url || "https://picsum.photos/1600/600";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative">
        <img
          src={heroImg}
          alt={project.name}
          className="h-[440px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 py-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white uppercase">
            {project.name}
          </h1>
          {project.slogan && (
            <p className="text-white/90 mt-2 max-w-3xl">{project.slogan}</p>
          )}
        </div>
      </section>

      {/* ANCHOR BAR */}
      <nav className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b">
        <div className="container mx-auto px-4 flex gap-6 overflow-x-auto">
          {["tong-quan", "thong-tin-du-an", "tai-lieu", "thu-vien-anh"].map(
            (id, i) => (
              <a
                key={id}
                href={`#${id}`}
                className="py-3 text-sm md:text-base hover:text-primary"
              >
                {["01. TỔNG QUAN", "02. THÔNG TIN DỰ ÁN", "03. TÀI LIỆU BÁN HÀNG", "04. THƯ VIỆN ẢNH"][i]}
              </a>
            )
          )}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 space-y-16">
        {/* 01. TỔNG QUAN (ảnh trái – nội dung phải) */}
        <section
          id="tong-quan"
          className="grid lg:grid-cols-2 gap-8 items-start"
        >
          <img
            src={images[0]?.url || heroImg}
            alt="Tổng quan"
            className="rounded-xl w-full object-cover aspect-[16/9]"
          />
          <div>
            <h2 className="text-2xl font-semibold mb-4">01. TỔNG QUAN</h2>
            <article
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: project.overview_html || "",
              }}
            />
          </div>
        </section>

        <hr className="border-muted" />

        {/* 02. THÔNG TIN DỰ ÁN (bảng 2 cột + ảnh phải) */}
        <section
          id="thong-tin-du-an"
          className="grid lg:grid-cols-2 gap-8 items-start"
        >
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">02. THÔNG TIN DỰ ÁN</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <KV label="Vị trí">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1" />
                  <span>{project.location_text || "—"}</span>
                </div>
              </KV>

              <KV label="Tổng diện tích">
                {project.total_area_ha ? `${project.total_area_ha} ha` : "—"}
              </KV>

              <KV label="Số lượng sản phẩm">
                {typeof project.units_count === "number"
                  ? project.units_count.toLocaleString()
                  : "—"}
              </KV>

              <KV label="Loại hình">
                {(project.product_types || []).length > 0
                  ? (project.product_types || []).join(", ")
                  : "—"}
              </KV>

              <KV label="Chủ đầu tư">
                <div className="flex items-start gap-2">
                  <Building2 className="w-4 h-4 mt-1" />
                  <span>{project.owner || "—"}</span>
                </div>
              </KV>

              <KV label="Đơn vị quản lý & vận hành">
                {project.manager || "—"}
              </KV>

              <KV label="Đơn vị phân phối">{project.distributor || "—"}</KV>

              <KV label="Email liên hệ">
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 mt-1" />
                  <span>{project.email || "—"}</span>
                </div>
              </KV>

              <KV label="Hotline">
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-1" />
                  <span>{project.social_links?.hotline || "—"} </span>
                </div>
              </KV>

              <KV label="Website">
                <div className="flex items-start gap-2">
                  <Globe className="w-4 h-4 mt-1" />
                  {project.social_links?.website ? (
                    <a
                      className="underline"
                      target="_blank"
                      rel="noreferrer"
                      href={project.social_links.website}
                    >
                      {project.social_links.website}
                    </a>
                  ) : (
                    "—"
                  )}
                </div>
              </KV>
            </div>

            {/* Social icons hàng dưới như mẫu */}
            <div className="flex items-center gap-4 pt-2">
              {project.social_links?.facebook && (
                <a
                  aria-label="Facebook"
                  href={project.social_links.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border hover:bg-muted"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {project.social_links?.youtube && (
                <a
                  aria-label="YouTube"
                  href={project.social_links.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border hover:bg-muted"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {project.social_links?.tiktok && (
                <a
                  aria-label="TikTok"
                  href={project.social_links.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-full border hover:bg-muted"
                >
                  <Music4 className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <img
            src={images[1]?.url || images[0]?.url || heroImg}
            alt="Thông tin dự án"
            className="rounded-xl w-full object-cover aspect-[16/9]"
          />
        </section>

        {/* 03. TÀI LIỆU BÁN HÀNG – nền xám */}
        <section id="tai-lieu" className="py-12 rounded-2xl bg-muted/40 -mx-4 px-4">
          <div className="container mx-auto px-0">
            <h2 className="text-2xl font-semibold mb-6">03. TÀI LIỆU BÁN HÀNG</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(docs || []).map((d) => (
                <a
                  key={d.id}
                  href={d.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="block border rounded-xl overflow-hidden hover:shadow"
                >
                  {d.thumb_url && (
                    <img
                      src={d.thumb_url}
                      alt={d.title}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  )}
                  <div className="p-4 font-medium text-center">{d.title}</div>
                </a>
              ))}
              {docs.length === 0 && (
                <div className="text-muted-foreground">Chưa có tài liệu.</div>
              )}
            </div>
          </div>
        </section>

        {/* 04. THƯ VIỆN ẢNH – masonry */}
        <section id="thu-vien-anh">
          <h2 className="text-2xl font-semibold mb-6">04. THƯ VIỆN ẢNH</h2>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {(images || []).map((m) => (
              <img
                key={m.id}
                src={m.url}
                alt={m.caption || project.name}
                className="rounded-xl w-full"
              />
            ))}
            {images.length === 0 && (
              <div className="text-muted-foreground">Chưa có hình ảnh.</div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
