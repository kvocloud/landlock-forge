import { Search, Menu, User, Heart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@/hooks/use-toast";

const Header = () => {
  const { isAuthenticated, profile } = useAuthStore();
  
  const handleHeartClick = () => {
    toast({
      title: "Tính năng sắp ra mắt",
      description: "Danh sách yêu thích sẽ sớm được cập nhật"
    });
  };

  const handleNotificationClick = () => {
    toast({
      title: "Tính năng sắp ra mắt", 
      description: "Thông báo sẽ sớm được cập nhật"
    });
  };

  const handleMobileSearch = () => {
    toast({
      title: "Tính năng sắp ra mắt",
      description: "Tìm kiếm di động sẽ sớm được cập nhật"
    });
  };

  const handleMobileMenu = () => {
    toast({
      title: "Tính năng sắp ra mắt",
      description: "Menu di động sẽ sớm được cập nhật" 
    });
  };
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              BĐS VN
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bất động sản, địa điểm..."
                className="pl-10 pr-4 h-12 rounded-full border-muted focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/mua" className="text-foreground/80 hover:text-primary transition-colors">Mua</Link>
            <Link to="/thue" className="text-foreground/80 hover:text-primary transition-colors">Thuê</Link>
            <Link to="/ban" className="text-foreground/80 hover:text-primary transition-colors">Bán Sell</Link>
            <Link to="/moi-gioi" className="text-foreground/80 hover:text-primary transition-colors">Môi giới</Link>
            <Link to="/hop-dong-mua-ban" className="text-foreground/80 hover:text-primary transition-colors">Hợp đồng </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={handleHeartClick}>
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex" onClick={handleNotificationClick}>
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={handleMobileSearch}>
              <Search className="h-5 w-5" />
            </Button>
            {isAuthenticated ? (
              <>
                <Button asChild className="hidden md:flex">
                  <Link to="/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    {profile?.full_name || 'Tài khoản'}
                  </Link>
                </Button>
                <Button variant="hero" asChild className="hidden md:flex">
                  <Link to="/ban">Đăng tin</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild className="hidden md:flex">
                  <Link to="/auth">
                    <User className="h-4 w-4 mr-2" />
                    Đăng nhập
                  </Link>
                </Button>
                <Button variant="hero" asChild className="hidden md:flex">
                  <Link to="/auth">Đăng ký</Link>
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={handleMobileMenu}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;