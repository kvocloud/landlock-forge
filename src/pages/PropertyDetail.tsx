// src/pages/PropertyDetail.tsx
import { useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Calendar,
  Eye,
  Phone,
  Mail,
  Ruler,
  Compass,
  ShieldCheck,
  Landmark,
  Home,
  ChevronRight,
  Image as ImageIcon,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockProperties } from "@/data/mockProperties";
import PropertyCard from "@/components/PropertyCard";

/** -------- helpers -------- */
function fmtPrice(v?: number | null) {
  if (!v) return "";
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)} tỷ`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} triệu`;
  return `${v.toLocaleString()} đ`;
}
function fmtMeters(v?: number | string | null) {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return isNaN(n) ? String(v) : `${n} m`;
}
function KeyVal({
  label,
  value,
}: {
  label: string;
  value?: React.ReactNode;
}) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
function RowItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value?: string | number | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-center gap-3 rounded-md border px-3 py-3">
      <span className="text-muted-foreground">{icon}</span>
      <div className="flex-1">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const property = mockProperties.find((p) => p.id === Number(id));
  const notFound = !property;

  const {
    images = [],
    image,
    width,
    length,
    direction,
    balconyDirection,
    roadWidth,
    legalStatus,
    facade,
    interior,
    floorCount,
    projectName,
    projectAddress,
    investor,
    lat,
    lng,
    agentName,
    agentPhone,
    agentEmail,
    agentYears,
    verifiedAgent,
    // meta
    postedAt = "20/09/2025",
    expireAt = "30/09/2025",
    listingCode = `BD${id}`,
  } = (property as any) || {};

  const gallery = useMemo<string[]>(
    () =>
      Array.isArray(images) && images.length ? images : [image].filter(Boolean),
    [images, image]
  );

  const pricePerM2 = useMemo(() => {
    if (!property?.price || !property?.area) return null;
    const v = property.price / property.area;
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(2)} tỷ/m²`;
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} triệu/m²`;
    return `${Math.round(v).toLocaleString()} đ/m²`;
  }, [property?.price, property?.area]);

  /** ---------- Recently viewed (save to localStorage) ---------- */
  useEffect(() => {
    if (!property) return;
    const KEY = "recent_listings";
    const raw = localStorage.getItem(KEY);
    let arr: number[] = [];
    try {
      arr = raw ? JSON.parse(raw) : [];
    } catch {
      arr = [];
    }
    // put current to front, unique, max 12
    arr = [property.id, ...arr.filter((x) => x !== property.id)].slice(0, 12);
    localStorage.setItem(KEY, JSON.stringify(arr));
  }, [property]);

  const recentProperties = useMemo(() => {
    const KEY = "recent_listings";
    const raw = localStorage.getItem(KEY);
    let ids: number[] = [];
    try {
      ids = raw ? JSON.parse(raw) : [];
    } catch {
      ids = [];
    }
    // exclude current item
    const list = ids.filter((x) => x !== Number(id));
    if (!list.length) return [];
    return list
      .map((rid) => mockProperties.find((p) => p.id === rid))
      .filter(Boolean)
      .slice(0, 8) as typeof mockProperties;
  }, [id]);

  /** ---------- Recommended ---------- */
  const recommended = useMemo(() => {
  if (!property) return [];
  const sameType = mockProperties.filter(
    (p) => p.id !== property.id && p.propertyType === property.propertyType
  );
  const sameLocation = mockProperties.filter(
    (p) => p.id !== property.id && p.location === property.location
  );

  const set = new Map<number, (typeof mockProperties)[number]>();
  [...sameType, ...sameLocation].forEach((p) => set.set(p.id, p));
  if (set.size < 8) {
    mockProperties.forEach((p) => {
      if (p.id !== property.id && !set.has(p.id)) set.set(p.id, p);
    });
  }
  return Array.from(set.values()).slice(0, 6);
}, [property]);


  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy bất động sản</h1>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay về trang chủ
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Breadcrumb + quay lại */}
        <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
          <button
            className="inline-flex items-center gap-1 hover:text-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </button>
          <span className="mx-1">/</span>
          <span>Bình Dương</span>
          <ChevronRight className="h-4 w-4" />
          <span>Thuận An</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Nhà biệt thự, liền kề</span>
        </div>

        {/* Title row */}
        <div className="mt-4 mb-4">
          <h1 className="text-2xl md:text-[26px] font-semibold leading-snug">
            {property.title}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{property.location}</span>
          </div>
          {(projectName || projectAddress) && (
            <div className="mt-1 text-sm text-muted-foreground">
              {projectName && (
                <>
                  Khu đô thị: <span className="text-foreground">{projectName}</span>
                </>
              )}
              {projectAddress && (
                <>
                  {" "}
                  – <span>{projectAddress}</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* ===== LEFT ===== */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            <div className="mb-4">
              <div className="relative rounded-xl overflow-hidden border">
                <img
                  src={gallery[0]}
                  alt={property.title}
                  className="w-full h-[280px] md:h-[360px] object-cover"
                />
                {/* status & featured */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge
                    variant={
                      property.status === "Đã bán" ? "destructive" : "default"
                    }
                    className={`${
                      property.status === "Cần bán"
                        ? "bg-accent"
                        : property.status === "Cho thuê"
                        ? "bg-yellow-500"
                        : ""
                    } text-white`}
                  >
                    {property.status}
                  </Badge>
                  {property.featured && (
                    <Badge className="bg-gradient-price text-white">Nổi bật</Badge>
                  )}
                </div>
                {/* counter & actions */}
                <div className="absolute bottom-3 left-3">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-black/55 text-white text-xs">
                    <ImageIcon className="h-3.5 w-3.5" />
                    {gallery.length} ảnh
                  </div>
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-9 w-9 bg-white/90 hover:bg-white"
                    title="Yêu thích"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-9 w-9 bg-white/90 hover:bg-white"
                    title="Chia sẻ"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* thumbnails */}
              {gallery.length > 1 && (
                <div className="mt-2 grid grid-cols-4 md:grid-cols-6 gap-2">
                  {gallery.slice(1, 7).map((src, i) => (
                    <div
                      className="rounded-lg overflow-hidden border aspect-[4/3]"
                      key={i}
                    >
                      <img
                        src={src}
                        alt={`thumb-${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick info bar */}
            <div className="rounded-xl border bg-card p-4 mb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">Khoảng giá</div>
                  <div className="mt-1 text-lg font-semibold">
                    {fmtPrice(property.price)}
                    {property.status === "Cho thuê" && (
                      <span className="text-sm text-muted-foreground">/tháng</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Diện tích</div>
                  <div className="mt-1 text-lg font-semibold">
                    {property.area} m²
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Giá trên m²</div>
                  <div className="mt-1 text-lg font-semibold">
                    {pricePerM2 || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">
                    Kích thước lô (tham khảo)
                  </div>
                  <div className="mt-1 text-lg font-semibold">
                    {(width || length)
                      ? `${fmtMeters(width)} × ${fmtMeters(length)}`
                      : "-"}
                  </div>
                </div>
              </div>
              {/* demo “Giá bán đã tăng …” */}
              <div className="mt-3 flex items-center gap-3">
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                  + 20%
                </Badge>
                <div className="text-sm text-muted-foreground">
                  Giá bán đã tăng trong 1 năm qua
                </div>
                <div className="ml-auto inline-flex items-center gap-1 text-sm text-primary cursor-pointer">
                  Xem lịch sử giá <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Thông tin mô tả */}
            <Card className="mb-4">
              <CardHeader className="py-4">
                <CardTitle>Thông tin mô tả</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-[15px] text-foreground leading-7">
                  <p className="whitespace-pre-line">{property.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Đặc điểm BĐS */}
            <Card className="mb-4">
              <CardHeader className="py-4">
                <CardTitle>Đặc điểm bất động sản</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <RowItem icon={<Home />} label="Loại hình" value={property.propertyType} />
                <RowItem icon={<Square />} label="Diện tích" value={`${property.area} m²`} />
                <RowItem icon={<Ruler />} label="Mặt tiền" value={fmtMeters(width)} />
                <RowItem icon={<Ruler />} label="Chiều dài" value={fmtMeters(length)} />
                <RowItem icon={<Compass />} label="Hướng nhà" value={direction} />
                <RowItem icon={<Compass />} label="Hướng ban công" value={balconyDirection} />
                <RowItem icon={<Ruler />} label="Đường vào" value={fmtMeters(roadWidth)} />
                <RowItem icon={<ShieldCheck />} label="Pháp lý" value={legalStatus} />
                <RowItem icon={<Home />} label="Số mặt tiền" value={facade} />
                <RowItem icon={<Home />} label="Số tầng" value={floorCount} />
                <RowItem icon={<Home />} label="Nội thất" value={interior} />
                <RowItem icon={<Car />} label="Chỗ đậu xe" value={property.parking} />
                <RowItem icon={<Bed />} label="Phòng ngủ" value={property.bedrooms} />
                <RowItem icon={<Bath />} label="Phòng tắm" value={property.bathrooms} />
              </CardContent>
            </Card>

            {/* Thông tin dự án */}
            {(projectName || projectAddress || investor) && (
              <Card className="mb-4">
                <CardHeader className="py-4 flex-row items-center justify-between">
                  <CardTitle>Thông tin dự án</CardTitle>
                  <div className="text-sm text-primary hover:underline cursor-pointer">
                    Xem 21 tin đăng bán
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {projectName && (
                    <div className="flex gap-3">
                      <Landmark className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Tên dự án</div>
                        <div className="font-medium">{projectName}</div>
                      </div>
                    </div>
                  )}
                  {projectAddress && (
                    <div className="flex gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Địa chỉ</div>
                        <div className="font-medium">{projectAddress}</div>
                      </div>
                    </div>
                  )}
                  {investor && (
                    <div className="flex gap-3">
                      <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Chủ đầu tư</div>
                        <div className="font-medium">{investor}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Bản đồ + Thông tin đăng */}
            {lat && lng && (
              <Card className="mb-4">
                <CardHeader className="py-4">
                  <CardTitle>Xem trên bản đồ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl overflow-hidden border">
                    <iframe
                      title="map"
                      width="100%"
                      height="360"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps?q=${lat},${lng}&hl=vi&z=16&output=embed`}
                    />
                  </div>

                  {/* meta table dưới bản đồ */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <KeyVal label="Ngày đăng" value={postedAt} />
                    <KeyVal label="Hết hạn" value={expireAt} />
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">Mã tin</span>
                      <span className="font-medium inline-flex items-center gap-1">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        {listingCode}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ===== Đã xem gần đây ===== */}
            {recentProperties.length > 0 && (
              <section className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Bất động sản đã xem</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {recentProperties.map((p) => (
                    <PropertyCard key={p.id} property={p as any} />
                  ))}
                </div>
              </section>
            )}

            {/* ===== Dành cho bạn ===== */}
            {recommended.length > 0 && (
  <section className="mb-2">
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold">Bất động sản dành cho bạn</h2>
      <div className="text-sm text-primary hover:underline cursor-pointer">
        Xem thêm
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {recommended.slice(0, 6).map((p) => (
        <PropertyCard key={p.id} property={p as any} />
      ))}
    </div>
  </section>
)}
{recentProperties.length > 1 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Bất động sản đã xem</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentProperties
              .filter((p: any) => p.id !== property.id)
              .slice(0, 8)
              .map((p: any) => (
                <PropertyCard key={p.id} property={p} />
              ))}
          </div>
        </section>
      )}
          </div>

          {/* ===== RIGHT: SIDEBAR ===== */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Môi giới */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Môi giới chuyên nghiệp</CardTitle>
                    {verifiedAgent && (
                      <Badge className="bg-emerald-600 hover:bg-emerald-600">
                        Đã xác minh
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                        agentName || "Agent"
                      )}`}
                      alt={agentName}
                      className="w-14 h-14 rounded-full border"
                    />
                    <div>
                      <div className="font-semibold leading-tight">
                        {agentName || "Chuyên viên tư vấn"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Kinh nghiệm: {agentYears || 1} năm
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    {agentPhone && (
                      <a
                        href={`tel:${agentPhone}`}
                        className="inline-flex items-center justify-center gap-2 rounded-md border bg-primary text-primary-foreground hover:opacity-90 px-3 py-2 text-sm"
                      >
                        <Phone className="h-4 w-4" /> Gọi ngay
                      </a>
                    )}
                    <a
                      href={`https://zalo.me/${agentPhone || ""}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-muted"
                    >
                      <img
                        src="https://stc-zaloprofile.zdn.vn/pc/v1/images/zalo_logo.svg"
                        alt="Zalo"
                        className="h-4 w-4"
                      />
                      Chat Zalo
                    </a>
                  </div>

                  {agentEmail && (
                    <a
                      href={`mailto:${agentEmail}`}
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Mail className="h-4 w-4" />
                      {agentEmail}
                    </a>
                  )}
                </CardContent>
              </Card>

              {/* Thông tin BĐS gọn */}
              <Card>
                <CardHeader className="py-3">
                  <CardTitle>Thông tin bất động sản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <KeyVal label="Loại hình" value={property.propertyType} />
                  <KeyVal label="Diện tích" value={`${property.area} m²`} />
                  <KeyVal label="Phòng ngủ" value={property.bedrooms} />
                  <KeyVal label="Phòng tắm" value={property.bathrooms} />
                  <KeyVal label="Chỗ đậu xe" value={property.parking} />
                  <Separator />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Đăng gần đây
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      0 lượt xem
                    </div>
                  </div>
                </CardContent>
              </Card>
                      
              {/* Danh mục nổi bật (demo) */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Danh mục nổi bật</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {[
                    "Bán nhà Thuận An",
                    "Bán nhà Bình Hòa",
                    "Bán đất An Thạnh",
                    "Bán nhà Thuận Giao",
                    "Nhà mặt tiền CMT8",
                  ].map((t) => (
                    <div
                      key={t}
                      className="flex items-center justify-between hover:text-primary cursor-pointer"
                    >
                      <span>{t}</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Hỗ trợ tiện ích (demo) */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Hỗ trợ tiện ích</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {[
                    "Tư vấn phong thủy",
                    "Định giá bất động sản",
                    "Tính lãi suất vay",
                    "Xem tuổi mua nhà",
                  ].map((t) => (
                    <div
                      key={t}
                      className="flex items-center justify-between hover:text-primary cursor-pointer"
                    >
                      <span>{t}</span>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
