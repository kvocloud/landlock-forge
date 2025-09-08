import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const footerLinks = {
    "Dành cho người mua": ["Tìm kiếm BĐS", "Tin nổi bật", "Thông báo BĐS", "Hướng dẫn mua", "Tính toán vay"],
    "Dành cho người bán": ["Đăng tin BĐS", "Định giá BĐS", "Hướng dẫn bán", "Dịch vụ marketing", "Mạng lưới môi giới"],
    "Công ty": ["Về chúng tôi", "Đội ngũ", "Tuyển dụng", "Báo chí", "Liên hệ"],
    "Tài nguyên": ["Blog", "Báo cáo thị trường", "Thông tin pháp lý", "Chính sách bảo mật", "Điều khoản dịch vụ"]
  };

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-4">
              <div className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
                EstateHub
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Nền tảng bất động sản hàng đầu Việt Nam, kết nối người mua và người bán với các bất động sản cao cấp trên toàn quốc. Đối tác đáng tin cậy của bạn trong việc tìm kiếm ngôi nhà hoàn hảo.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-3" />
                  <span>123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Phone className="h-4 w-4 mr-3" />
                  <span>+84 28 1234 5678</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Mail className="h-4 w-4 mr-3" />
                  <span>info@estatehub.vn</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-3 mt-6">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Footer Links */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {Object.entries(footerLinks).map(([category, links]) => (
                  <div key={category}>
                    <h3 className="font-semibold mb-4">{category}</h3>
                    <ul className="space-y-3">
                      {links.map((link) => (
                        <li key={link}>
                          <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-2">
              <h3 className="font-semibold mb-4">Nhận thông tin mới</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Nhận tin tức mới nhất về bất động sản và thông tin thị trường qua email.
              </p>
              <div className="space-y-3">
                <Input
                  placeholder="Nhập email của bạn"
                  className="bg-background"
                />
                <Button variant="hero" className="w-full">
                  Đăng ký
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-muted-foreground text-sm">
              © 2024 EstateHub Vietnam. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</a>
              <a href="#" className="hover:text-primary transition-colors">Điều khoản dịch vụ</a>
              <a href="#" className="hover:text-primary transition-colors">Chính sách cookie</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;