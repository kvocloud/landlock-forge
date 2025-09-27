import { Link } from "react-router-dom";

type BlogItem = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  cover: string;      // URL ảnh (Unsplash hoặc ảnh trong /public)
  date: string;       // ISO hoặc dạng hiển thị
  author: string;
};

const FEATURED: BlogItem[] = [
  {
    slug: "bi-quyet-dinh-gia-bds-chinh-xac-2025",
    category: "Thị trường",
    title: "Bí quyết định giá bất động sản chính xác trong năm 2025",
    excerpt:
      "Những chỉ số cần theo dõi, cách đọc dữ liệu so sánh lân cận và lưu ý khi thị trường biến động.",
    cover:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop",
    date: "2025-09-20",
    author: "EstateHub Research",
  },
  {
    slug: "huong-dan-chup-anh-can-ho-ban-chuyen-nghiep",
    category: "Hướng dẫn",
    title: "Hướng dẫn chụp ảnh căn hộ để bán như một pro",
    excerpt:
      "Checklist ánh sáng – góc máy – dàn trang giúp tin đăng thu hút gấp 3 lần.",
    cover:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
    date: "2025-09-12",
    author: "Kivo Studio",
  },
  {
    slug: "kinh-nghiem-dam-phan-gia-thue",
    category: "Mẹo hay",
    title: "5 kinh nghiệm đàm phán giá thuê không thể bỏ qua",
    excerpt:
      "Cách chuẩn bị hồ sơ, xây dựng lợi thế và chốt điều khoản có lợi nhất.",
    cover:
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=1600&auto=format&fit=crop",
    date: "2025-09-05",
    author: "EstateHub Editors",
  },
];

export default function BlogShowcase() {
  return (
    <section className="relative overflow-hidden">
      {/* BG nhạt để ăn ý với Hero */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/40" />
      <div className="relative container mx-auto px-4 py-14 md:py-20">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Tin tức &{" "}
            <span className="bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
              Hướng dẫn
            </span>
          </h2>
          <p className="mt-3 text-muted-foreground text-lg">
            Nội dung chọn lọc giúp bạn mua bán & cho thuê hiệu quả hơn.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {FEATURED.map((p) => (
            <article
              key={p.slug}
              className="group rounded-2xl bg-card shadow-hover overflow-hidden border border-border/50 hover:border-accent/40 transition"
            >
              <Link to={`/blog/${encodeURIComponent(p.slug)}`} className="block">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={p.cover}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-accent/90 text-white px-3 py-1 text-xs font-semibold shadow">
                    {p.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg md:text-xl font-semibold leading-snug line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {p.excerpt}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(p.date).toLocaleDateString("vi-VN")}</span>
                    <span className="font-medium">{p.author}</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center h-12 px-6 rounded-xl bg-accent text-white font-semibold shadow hover:bg-accent-hover transition"
          >
            Xem tất cả bài viết
          </Link>
        </div>
      </div>
    </section>
  );
}
