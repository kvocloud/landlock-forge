import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, MapPin, Bed, Bath, Square, Car, Calendar, Eye, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockProperties } from "@/data/mockProperties";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const property = mockProperties.find(p => p.id === parseInt(id || "0"));
  
  if (!property) {
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

  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)} tỷ VND`;
    } else if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} triệu VND`;
    } else {
      return `${price.toLocaleString()} VND`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-6">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              
              {/* Status badge */}
              <div className="absolute top-4 left-4">
                <Badge 
                  variant={property.status === "Đã bán" ? "destructive" : "default"}
                  className={`${property.status === "Cần bán" ? "bg-accent" : property.status === "Cho thuê" ? "bg-warning" : ""} text-white`}
                >
                  {property.status}
                </Badge>
              </div>

              {property.featured && (
                <div className="absolute top-4 left-20">
                  <Badge className="bg-gradient-price text-white">
                    Nổi bật
                  </Badge>
                </div>
              )}

              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Button size="icon" variant="secondary" className="h-10 w-10 bg-card/80 backdrop-blur-sm">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="secondary" className="h-10 w-10 bg-card/80 backdrop-blur-sm">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Title and price */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    {property.location}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-price-text mb-1">
                    {formatPrice(property.price)}
                  </div>
                  {property.status === "Cho thuê" && (
                    <span className="text-muted-foreground">/tháng</span>
                  )}
                </div>
              </div>

              {/* Property details */}
              <div className="flex items-center space-x-6 text-muted-foreground">
                <div className="flex items-center">
                  <Bed className="h-5 w-5 mr-2" />
                  {property.bedrooms} phòng ngủ
                </div>
                <div className="flex items-center">
                  <Bath className="h-5 w-5 mr-2" />
                  {property.bathrooms} phòng tắm
                </div>
                <div className="flex items-center">
                  <Square className="h-5 w-5 mr-2" />
                  {property.area}m²
                </div>
                {property.parking && property.parking > 0 && (
                  <div className="flex items-center">
                    <Car className="h-5 w-5 mr-2" />
                    {property.parking} chỗ đậu xe
                  </div>
                )}
              </div>
            </div>

            <Separator className="mb-6" />

            {/* Description */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Mô tả chi tiết</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Tiện ích</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg">
                  <Phone className="h-5 w-5 mr-2" />
                  Gọi điện
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Mail className="h-5 w-5 mr-2" />
                  Gửi email
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Liên hệ để được tư vấn miễn phí
                </div>
              </CardContent>
            </Card>

            {/* Property info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bất động sản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loại hình:</span>
                  <span className="font-medium">{property.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Diện tích:</span>
                  <span className="font-medium">{property.area}m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phòng ngủ:</span>
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phòng tắm:</span>
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
                {property.parking && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chỗ đậu xe:</span>
                    <span className="font-medium">{property.parking}</span>
                  </div>
                )}
                <Separator />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Đăng 3 ngày trước
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    456 lượt xem
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;