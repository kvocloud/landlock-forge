import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type Post = {
  slug: string;
  title: string;
  cover: string;
  date: string; // ISO
  tags?: string[]; // dùng để lọc theo tab
};

// ====== DỮ LIỆU MẪU ======
const SAMPLE_POSTS: Post[] = [
  {
    slug: "toan-canh-thi-truong-q3-2025",
    title:
      "Sự Kiện Toàn Cảnh Thị Trường Bất Động Sản Quý 3/2025: Đón Đầu Nhịp Dẫn",
    cover:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop",
    date: "2025-09-24",
    tags: ["hot", "news"],
  },
  {
    slug: "chung-cu-ha-noi-lam-song-nha-dau-tu",
    title:
      "Chung Cư Hà Nội Tăng Giá: Cuộc “Làm Sóng” Của Giới Đầu Tư?",
    cover:
      "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d95?q=80&w=1600&auto=format&fit=crop",
    date: "2025-09-20",
    tags: ["news", "hn"],
  },
  {
    slug: "gia-bds-tphcm-tiep-tuc-leo-thang",
    title:
      "Giá Bất Động Sản Tiếp Tục Leo Thang, Nhu Cầu Thuê Trọ Mùa Tụu Trường Bùng Nổ",
    cover:
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
    date: "2025-09-18",
    tags: ["news", "hcm"],
  },
  {
    slug: "dan-so-ha-noi-tang-manh",
    title:
      "Những Dự Án Nhà Ở Xã Hội Nào Tại Hà Nội Sắp Bàn Giao Hoặc Có Nhà Hiện Hữu?",
    cover:
      "https://images.unsplash.com/photo-1486496572940-2bb2341fdbad?q=80&w=1600&auto=format&fit=crop",
    date: "2025-09-16",
    tags: ["hn", "news"],
  },
  {
    slug: "dat-nen-hoa-lac-gon-song",
    title:
      "Đất Nền Hoà Lạc Gợn Sóng, Sức Mua Túc Tắc, Không Tăng Mạnh",
    cover:
      "https://images.unsplash.com/photo-1467803738586-46b7eb7b16a1?q=80&w=1600&auto=format&fit=crop",
    date: "2025-09-14",
    tags: ["news", "hn"],
  },
  {
    slug: "nhin-lai-chinh-sach-kich-cau",
    title:
      "Nhìn Lại Loạt Chính Sách Kích Cầu Khuấy Động Thị Trường BĐS Tháng 9",
    cover:
      "https://images.unsplash.com/photo-143 plus  1", // không quan trọng, không hiển thị
    date: "2025-09-10",
    tags: ["news"],
  },
];

// Banner mẫu (có thể thay ảnh của bạn)
const BANNERS = [
  "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1200&auto=format&fit=crop",
];

// Tabs
const TABS = [
  { key: "hot", label: "Tin nổi bật" },
  { key: "news", label: "Tin tức" },
  { key: "hcm", label: "BĐS TPHCM" },
  { key: "hn", label: "BĐS Hà Nội" },
];

function timeFromNow(iso: string) {
  const days =
    Math.max(
      0,
      Math.floor(
        (Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)
      )
    ) || 0;
  if (days === 0) return "Hôm nay";
  if (days === 1) return "1 ngày trước";
  return `${days} ngày trước`;
}

export default function NewsSection() {
  const [active, setActive] = useState<string>("hot");

  const filtered = useMemo(() => {
    // Tin nổi bật: ưu tiên tag 'hot'; nếu ít quá thì bổ sung news để đủ danh sách
    if (active === "hot") {
      const hot = SAMPLE_POSTS.filter((p) => p.tags?.includes("hot"));
      const fill =
        hot.length < 6
          ? [...hot, ...SAMPLE_POSTS.filter((p) => p.tags?.includes("news"))]
          : hot;
      return fill.slice(0, 7);
    }
    return SAMPLE_POSTS.filter((p) => p.tags?.includes(active)).slice(0, 7);
  }, [active]);

  // bài nổi bật (ảnh lớn) = phần tử đầu
  const featured = filtered[0];
  const list = filtered.slice(1, 7);

  return (
    <section className="container mx-auto px-4 py-10 md:py-14">
      {/* Tabs */}
      <div className="flex items-center gap-6 md:gap-10 border-b border-border pb-4">
        <nav className="flex gap-6 md:gap-8 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`text-lg md:text-xl font-semibold whitespace-nowrap transition
                ${
                  active === t.key
                    ? "text-foreground border-b-2 border-primary pb-3"
                    : "text-muted-foreground hover:text-foreground pb-3"
                }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <Link
          to="/blog"
          className="ml-auto inline-flex items-center text-primary hover:underline text-sm md:text-base"
        >
          Xem thêm <span className="ml-1">→</span>
        </Link>
      </div>

      {/* Layout 2 cột trái (feature+list) + 1 cột banner phải */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Trái: 8/12 gồm ảnh lớn + list */}
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            {/* Featured */}
            {featured && (
              <article className="lg:col-span-7">
                <Link to={`/blog/${featured.slug}`} className="block">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                    <img
                      src={featured.cover}
                      alt={featured.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-4 text-2xl md:text-3xl font-bold leading-snug">
                    {featured.title}
                  </h3>
                </Link>
                <div className="mt-2 flex items-center text-muted-foreground text-sm">
                  <span className="inline-flex items-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="mr-1"
                    >
                      <path d="M12 8a4 4 0 100 8 4 4 0 000-8zm0-6C6.48 2 2 6.48 2 12s4.48 10 10 10
                        10-4.48 10-10S17.52 2 12 2z"></path>
                    </svg>
                    {timeFromNow(featured.date)}
                  </span>
                </div>
              </article>
            )}

            {/* Danh sách ngắn */}
            <div className="lg:col-span-5">
              <ul className="divide-y divide-border rounded-2xl border border-border/70">
                {list.map((p) => (
                  <li key={p.slug}>
                    <Link
                      to={`/blog/${p.slug}`}
                      className="block px-5 py-4 hover:bg-muted/50 transition"
                    >
                      <h4 className="font-medium leading-snug">{p.title}</h4>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Phải: banner */}
        <aside className="lg:col-span-4 space-y-6">
          {BANNERS.map((src, i) => (
            <a
              key={i}
              href="#"
              className="block rounded-2xl overflow-hidden border border-border/70"
              aria-label={`Banner ${i + 1}`}
            >
              <img
                src={src}
                alt=""
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </a>
          ))}
        </aside>
      </div>
    </section>
  );
}
