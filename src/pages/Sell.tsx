import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, Camera, MapPin, DollarSign } from "lucide-react";

const Sell = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Đăng Tin Bất Động Sản
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Đăng tin bán, cho thuê, mua bất động sản miễn phí và tiếp cận hàng triệu khách hàng tiềm năng
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Thông tin bất động sản</CardTitle>
                <CardDescription>
                  Vui lòng điền đầy đủ thông tin để tin đăng của bạn được duyệt nhanh chóng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="listing-type">Loại tin đăng *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại tin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sell">Cần bán</SelectItem>
                        <SelectItem value="rent">Cho thuê</SelectItem>
                        <SelectItem value="buy">Cần mua</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">Tiêu đề tin đăng *</Label>
                    <Input 
                      id="title" 
                      placeholder="VD: Bán căn hộ 3PN tại Landmark 81..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="property-type">Loại bất động sản *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại BĐS" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Căn hộ</SelectItem>
                        <SelectItem value="house">Nhà riêng</SelectItem>
                        <SelectItem value="villa">Biệt thự</SelectItem>
                        <SelectItem value="townhouse">Nhà phố</SelectItem>
                        <SelectItem value="land">Đất nền</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="province">Tỉnh/Thành phố *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tỉnh/thành" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ho-chi-minh">TP. Hồ Chí Minh</SelectItem>
                        <SelectItem value="hanoi">Hà Nội</SelectItem>
                        <SelectItem value="da-nang">Đà Nẵng</SelectItem>
                        <SelectItem value="binh-duong">Bình Dương</SelectItem>
                        <SelectItem value="dong-nai">Đồng Nai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">Quận/Huyện *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn quận/huyện" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="district-1">Quận 1</SelectItem>
                        <SelectItem value="district-2">Quận 2</SelectItem>
                        <SelectItem value="district-3">Quận 3</SelectItem>
                        <SelectItem value="thu-duc">Thủ Đức</SelectItem>
                        <SelectItem value="binh-thanh">Bình Thạnh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ward">Phường/Xã</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phường/xã" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ward-1">Phường 1</SelectItem>
                        <SelectItem value="ward-2">Phường 2</SelectItem>
                        <SelectItem value="ward-3">Phường 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ chi tiết *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="address" 
                      placeholder="Số nhà, tên đường..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Giá bán (VND) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="price" 
                        type="number"
                        placeholder="0"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Diện tích (m²) *</Label>
                    <Input 
                      id="area" 
                      type="number"
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Phòng ngủ</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="0" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Phòng tắm</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="0" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả chi tiết *</Label>
                  <Textarea 
                    id="description"
                    placeholder="Mô tả chi tiết về bất động sản: vị trí, thiết kế, tiện ích..."
                    rows={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Hình ảnh *</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <div className="p-4 bg-muted rounded-full">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </div>
                      <div>
                        <p className="text-lg font-medium">Tải lên hình ảnh</p>
                        <p className="text-muted-foreground">
                          Kéo thả hoặc click để chọn ảnh (tối đa 10 ảnh)
                        </p>
                      </div>
                      <Button variant="outline">
                        <Camera className="h-4 w-4 mr-2" />
                        Chọn ảnh
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Button variant="outline">
                    Lưu nháp
                  </Button>
                  <Button>
                    Đăng tin
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Sell;