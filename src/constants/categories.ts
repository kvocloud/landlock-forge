export type Cat = { label: string; slug: string };

// Dùng chung cho Mua/Bán/Thuê (bạn có thể tinh chỉnh)
export const BUY_CATS: Cat[] = [
  { label: "Căn hộ chung cư", slug: "can-ho-chung-cu" },
  { label: "Chung cư mini, căn hộ dịch vụ", slug: "chung-cu-mini-can-ho-dich-vu" },
  { label: "Nhà riêng", slug: "nha-rieng" },
  { label: "Biệt thự, liền kề", slug: "biet-thu-lien-ke" },
  { label: "Nhà mặt phố", slug: "nha-mat-pho" },
  { label: "Shophouse, nhà phố thương mại", slug: "shophouse" },
  { label: "Đất nền dự án", slug: "dat-nen-du-an" },
  { label: "Đất", slug: "dat" },
  { label: "Trang trại, khu nghỉ dưỡng", slug: "trang-trai-khu-nghi-duong" },
  { label: "Condotel", slug: "condotel" },
  { label: "Kho, nhà xưởng", slug: "kho-nha-xuong" },
  { label: "Loại BĐS khác", slug: "khac" },
];

export const RENT_CATS: Cat[] = [
  { label: "Căn hộ chung cư", slug: "can-ho-chung-cu" },
  { label: "Nhà riêng", slug: "nha-rieng" },
  { label: "Nhà mặt phố", slug: "nha-mat-pho" },
  { label: "Phòng trọ, nhà trọ", slug: "phong-tro" },
  { label: "Văn phòng", slug: "van-phong" },
  { label: "Mặt bằng, cửa hàng", slug: "mat-bang" },
  { label: "Kho, xưởng", slug: "kho-xuong" },
  { label: "Loại BĐS khác", slug: "khac" },
];

export const PROJECT_CATS: Cat[] = [
  { label: "Căn hộ chung cư", slug: "chung-cu" },
  { label: "Cao ốc văn phòng", slug: "cao-oc-van-phong" },
  { label: "Trung tâm thương mại", slug: "trung-tam-thuong-mai" },
  { label: "Khu đô thị mới", slug: "khu-do-thi-moi" },
  { label: "Khu phức hợp", slug: "khu-phuc-hop" },
  { label: "Nhà ở xã hội", slug: "nha-o-xa-hoi" },
  { label: "Khu nghỉ dưỡng, sinh thái", slug: "khu-nghi-duong" },
  { label: "Khu công nghiệp", slug: "khu-cong-nghiep" },
  { label: "Biệt thự, liền kề", slug: "biet-thu-lien-ke" },
  { label: "Shophouse", slug: "shophouse" },
  { label: "Nhà mặt phố", slug: "nha-mat-pho" },
  { label: "Dự án khác", slug: "khac" },
];
