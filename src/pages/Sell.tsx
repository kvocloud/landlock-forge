import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, Camera, MapPin, DollarSign, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/store/authStore";

const Sell = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, profile } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    listingType: "",
    title: "",
    propertyType: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    description: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 10 - selectedImages.length);
      setSelectedImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveDraft = async () => {
    if (!isAuthenticated || !profile) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để lưu tin đăng",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const listingData = {
        user_id: profile.user_id,
        title: formData.title || 'Tin đăng nháp',
        description: formData.description,
        type: mapListingType(formData.listingType),
        category: formData.propertyType,
        price: parseFloat(formData.price) || 0,
        area: parseFloat(formData.area) || 0,
        address: formData.address,
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
        status: 'DRAFT',
        images: []
      };

      const { error } = await supabase
        .from('listings')
        .insert([listingData]);

      if (error) throw error;

      toast({
        title: "Lưu nháp thành công",
        description: "Tin đăng đã được lưu vào nháp"
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Lỗi lưu nháp",
        description: "Không thể lưu tin đăng. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapListingType = (type: string) => {
    switch (type) {
      case 'sell': return 'FOR_SALE';
      case 'rent': return 'FOR_RENT';
      case 'buy': return 'WANTED';
      default: return 'FOR_SALE';
    }
  };

  const handlePostListing = async () => {
    if (!isAuthenticated || !profile) {
      toast({
        title: "Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để đăng tin",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    // Basic validation
    const requiredFields = ['listingType', 'title', 'propertyType', 'province', 'district', 'address', 'price', 'area', 'description'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng điền đầy đủ các thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    if (selectedImages.length === 0) {
      toast({
        title: "Thiếu hình ảnh",
        description: "Vui lòng tải lên ít nhất 1 hình ảnh",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert images to base64 for now (in production, upload to storage)
      const imageUrls = await Promise.all(
        selectedImages.map(async (file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        })
      );

      const listingData = {
        user_id: profile.user_id,
        title: formData.title,
        description: formData.description,
        type: mapListingType(formData.listingType),
        category: formData.propertyType,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        address: formData.address,
        province: formData.province,
        district: formData.district,
        ward: formData.ward,
        status: 'PENDING',
        images: imageUrls
      };

      const { error } = await supabase
        .from('listings')
        .insert([listingData]);

      if (error) throw error;

      toast({
        title: "Đăng tin thành công",
        description: "Tin đăng của bạn đã được gửi để duyệt"
      });

      // Navigate to dashboard after successful posting
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error posting listing:', error);
      toast({
        title: "Lỗi đăng tin",
        description: "Không thể đăng tin. Vui lòng thử lại.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
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
                    <Select value={formData.listingType} onValueChange={(value) => handleInputChange('listingType', value)}>
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
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="property-type">Loại bất động sản *</Label>
                    <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
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
                    <Select value={formData.province} onValueChange={(value) => handleInputChange('province', value)}>
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
                    <Select value={formData.district} onValueChange={(value) => handleInputChange('district', value)}>
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
                    <Select value={formData.ward} onValueChange={(value) => handleInputChange('ward', value)}>
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
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
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
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Diện tích (m²) *</Label>
                    <Input 
                      id="area" 
                      type="number"
                      placeholder="0"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Phòng ngủ</Label>
                    <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange('bedrooms', value)}>
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
                    <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange('bathrooms', value)}>
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
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Hình ảnh *</Label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
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
                      <Button variant="outline" onClick={handleImageSelect}>
                        <Camera className="h-4 w-4 mr-2" />
                        Chọn ảnh
                      </Button>
                    </div>
                  </div>
                  
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <Button variant="outline" onClick={handleSaveDraft} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      'Lưu nháp'
                    )}
                  </Button>
                  <Button onClick={handlePostListing} disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang đăng...
                      </>
                    ) : (
                      'Đăng tin'
                    )}
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