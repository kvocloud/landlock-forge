// src/pages/ProjectCreateEdit.tsx
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// ===============================
// Config buckets (ENV có thể override)
// ===============================
const BUCKET_COVER = import.meta.env.VITE_BUCKET_PROJECT_COVERS || "project-covers";
const BUCKET_DOCS  = import.meta.env.VITE_BUCKET_PROJECT_DOCS   || "project-docs";
const BUCKET_MEDIA = import.meta.env.VITE_BUCKET_PROJECT_MEDIA  || "project-media";

// ===============================
// Categories (có thể fetch từ DB nếu cần)
// ===============================
const CATEGORIES = [
  "Căn hộ",
  "Shophouse",
  "Biệt thự",
  "Nhà phố",
  "Văn phòng",
  "Đất nền",
  "Nghỉ dưỡng",
  "Khác",
];

// ===============================
// Helpers
// ===============================
function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
function sanitize(s: string) {
  return s
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w.-]+/g, "-")
    .toLowerCase();
}
function nameFromFile(file: File) {
  const n = file.name;
  const i = n.lastIndexOf(".");
  return i > 0 ? n.slice(0, i) : n;
}
function guessDocType(filename: string): "brochure"|"finish-list"|"sales-policy"|"other" {
  const f = filename.toLowerCase();
  if (f.includes("brochure") || f.includes("to-gap")) return "brochure";
  if (f.includes("hoan-thien") || f.includes("finish")) return "finish-list";
  if (f.includes("chinh-sach") || f.includes("policy")) return "sales-policy";
  return "other";
}

async function uploadToBucket(bucket: string, path: string, file: File): Promise<string> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });
  if (error) {
    console.error(`[UPLOAD ERROR] bucket=${bucket} path=${path}`, error);
    const msg = String(error.message || "").toLowerCase();
    if (msg.includes("row-level security")) {
      throw new Error(
        `Bucket '${bucket}' đang chặn INSERT do RLS. Vào Storage → ${bucket} → Policies, thêm Insert cho anon/authenticated.`,
      );
    }
    if (msg.includes("bucket not found")) {
      throw new Error(`Bucket '${bucket}' chưa tồn tại. Vào Storage tạo bucket public cùng tên.`);
    }
    throw error;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ===============================
// Component
// ===============================
export default function ProjectCreateEdit() {
  const navigate = useNavigate();

  // 01. Thông tin chung
  const [name, setName] = React.useState("");
  const [slogan, setSlogan] = React.useState("");
  const [overview, setOverview] = React.useState("");
  const [coverFile, setCoverFile] = React.useState<File | null>(null);
  const coverPreview = React.useMemo(() => (coverFile ? URL.createObjectURL(coverFile) : ""), [coverFile]);

  // 02. Thông tin dự án
  const [location, setLocation] = React.useState("");
  const [area, setArea] = React.useState("");
  const [units, setUnits] = React.useState("");
  const [owner, setOwner] = React.useState("");
  const [manager, setManager] = React.useState("");
  const [distributor, setDistributor] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [hotline, setHotline] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(["Căn hộ", "Shophouse"]);

  // 03. Tài liệu
  const [docFiles, setDocFiles] = React.useState<File[]>([]);

  // 04. Thư viện ảnh
  const [imageFiles, setImageFiles] = React.useState<File[]>([]);
  const imagePreviews = React.useMemo(
    () => imageFiles.map((f) => URL.createObjectURL(f)),
    [imageFiles]
  );

  const [submitting, setSubmitting] = React.useState(false);
  const [progress, setProgress] = React.useState<string>("");

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  async function onSubmit() {
    try {
      if (submitting) return;
      setSubmitting(true);
      setProgress("Đang kiểm tra dữ liệu...");

      if (!name) throw new Error("Vui lòng nhập Tên dự án");
      if (!coverFile) throw new Error("Vui lòng chọn Ảnh cover");

      const slug = slugify(name);

      // 1) Upload cover
      setProgress("Đang upload ảnh cover...");
      console.log("UPLOAD cover...");
      const coverPath = `${slug}/cover/${Date.now()}_${sanitize(coverFile.name)}`; // <-- đảm bảo đã định nghĩa
      const coverUrl  = await uploadToBucket(BUCKET_COVER, coverPath, coverFile);

      // 2) Insert project
      setProgress("Đang lưu thông tin dự án...");
      console.log("INSERT projects...");
      const { data: project, error: pErr } = await supabase
        .from("projects")
        .insert([{
          slug,
          name,
          slogan,
          cover_image_url: coverUrl,
          overview_html: overview,
          location_text: location,
          total_area_ha: Number(area) || null,
          units_count: Number(units) || null,
          product_types: selectedCategories,
          email,
          status: "PUBLISHED",
          owner,
          manager,
          distributor,
          social_links: { hotline, website }, // giữ ở đây để ProjectDetail đọc được
        }])
        .select()
        .single();
      if (pErr) throw new Error(`projects: ${pErr.message}`);

      // 3) Upload & insert documents
      if (docFiles.length) {
        setProgress("Đang upload tài liệu...");
        console.log("UPLOAD + INSERT project_documents...");
        const docsPayload = await Promise.all(
          docFiles.map(async (f) => {
            const path = `${slug}/docs/${Date.now()}_${sanitize(f.name)}`;
            const file_url = await uploadToBucket(BUCKET_DOCS, path, f);
            return {
              project_id: project.id,
              title: nameFromFile(f),
              type: guessDocType(f.name),
              file_url,
            };
          })
        );
        const { error: dErr } = await supabase.from("project_documents").insert(docsPayload);
        if (dErr) throw new Error(`project_documents: ${dErr.message}`);
      }

      // 4) Upload & insert gallery images
      if (imageFiles.length) {
        setProgress("Đang upload thư viện ảnh...");
        console.log("UPLOAD + INSERT project_media...");
        const mediaPayload = await Promise.all(
          imageFiles.map(async (f, i) => {
            const path = `${slug}/images/${Date.now()}_${sanitize(f.name)}`;
            const url  = await uploadToBucket(BUCKET_MEDIA, path, f);
            return {
              project_id: project.id,
              kind: "image" as const,
              url,
              order: i + 1,
            };
          })
        );
        const { error: mErr } = await supabase.from("project_media").insert(mediaPayload);
        if (mErr) throw new Error(`project_media: ${mErr.message}`);
      }

      // 5) Done
      setProgress("Hoàn tất. Đang chuyển trang...");
      navigate(`/du-an/${slug}`);
    } catch (err: any) {
      console.error(err);
      alert(`Lỗi đăng dự án: ${err.message || err}`);
      setProgress("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-10 space-y-10">
        <h1 className="text-2xl md:text-3xl font-semibold">Đăng tin dự án</h1>

        {/* 01. Thông tin chung */}
        <section>
          <h2 className="text-xl font-semibold mb-4">01. Thông tin chung</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Tên dự án</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Slogan</label>
                <Input value={slogan} onChange={(e) => setSlogan(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Ảnh cover (upload file)</label>
                <Input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
                {coverPreview && (
                  <img src={coverPreview} className="mt-3 rounded-xl w-full max-h-60 object-cover" />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm text-muted-foreground mb-1">Tổng quan (HTML)</label>
              <Textarea rows={12} value={overview} onChange={(e) => setOverview(e.target.value)} placeholder="<p>Mô tả...</p>" />
            </div>
          </div>
        </section>

        <Separator />

        {/* 02. Thông tin dự án */}
        <section>
          <h2 className="text-xl font-semibold mb-4">02. Thông tin dự án</h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Vị trí hiển thị</label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Xã/Phường, Quận/Huyện, Tỉnh/Thành" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Tổng diện tích (ha)</label>
                  <Input value={area} onChange={(e) => setArea(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Số lượng sản phẩm</label>
                  <Input value={units} onChange={(e) => setUnits(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Loại hình (chọn nhiều)</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const checked = selectedCategories.includes(cat);
                    return (
                      <label
                        key={cat}
                        className={`px-3 py-1 rounded-full border cursor-pointer select-none ${
                          checked ? "bg-primary text-white border-primary" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={checked}
                          onChange={() => toggleCategory(cat)}
                        />
                        {cat}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Chủ đầu tư</label>
                <Input value={owner} onChange={(e) => setOwner(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Đơn vị quản lý & vận hành</label>
                <Input value={manager} onChange={(e) => setManager(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Đơn vị phân phối</label>
                <Input value={distributor} onChange={(e) => setDistributor(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Email liên hệ</label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Hotline</label>
                  <Input value={hotline} onChange={(e) => setHotline(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">Website</label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://..." />
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* 03. Tài liệu bán hàng */}
        <section>
          <h2 className="text-xl font-semibold mb-4">03. Tài liệu bán hàng</h2>
          <div className="space-y-2">
            <Input
              type="file"
              multiple
              onChange={(e) => setDocFiles(Array.from(e.target.files || []))}
            />
            {docFiles.length > 0 && (
              <ul className="list-disc pl-6 text-sm text-muted-foreground">
                {docFiles.map((f) => (
                  <li key={f.name}>{f.name}</li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <Separator />

        {/* 04. Thư viện ảnh */}
        <section>
          <h2 className="text-xl font-semibold mb-4">04. Thư viện ảnh</h2>
          <div className="space-y-2">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
            />
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {imagePreviews.map((src, i) => (
                  <img key={i} src={src} className="rounded-xl w-full aspect-[4/3] object-cover" />
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="space-y-2">
          {progress && <div className="text-sm text-muted-foreground">{progress}</div>}
          <Button onClick={onSubmit} className="w-full" disabled={submitting}>
            {submitting ? "Đang đăng..." : "Đăng dự án"}
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
