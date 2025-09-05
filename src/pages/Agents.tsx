import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Phone, Mail, Award } from "lucide-react";

const Agents = () => {
  const agents = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "/placeholder.svg",
      rating: 4.8,
      reviews: 156,
      experience: "5 năm kinh nghiệm",
      location: "Quận 1, TP.HCM",
      specialties: ["Căn hộ cao cấp", "Biệt thự", "Đất nền"],
      verified: true,
      properties: 45,
      sold: 23
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: "/placeholder.svg",
      rating: 4.9,
      reviews: 203,
      experience: "7 năm kinh nghiệm",
      location: "Quận 2, TP.HCM",
      specialties: ["Căn hộ", "Nhà phố", "Cho thuê"],
      verified: true,
      properties: 67,
      sold: 41
    },
    {
      id: 3,
      name: "Lê Minh C",
      avatar: "/placeholder.svg",
      rating: 4.7,
      reviews: 89,
      experience: "3 năm kinh nghiệm",
      location: "Quận 7, TP.HCM",
      specialties: ["Đất nền", "Nhà đầu tư", "Biệt thự"],
      verified: false,
      properties: 32,
      sold: 18
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-hero py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Môi Giới BĐS
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Kết nối với các chuyên gia môi giới uy tín và kinh nghiệm nhất
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <h3 className="text-3xl font-bold text-primary mb-2">500+</h3>
                <p className="text-muted-foreground">Môi giới chuyên nghiệp</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary mb-2">10,000+</h3>
                <p className="text-muted-foreground">Giao dịch thành công</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary mb-2">4.8/5</h3>
                <p className="text-muted-foreground">Đánh giá trung bình</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-primary mb-2">24/7</h3>
                <p className="text-muted-foreground">Hỗ trợ khách hàng</p>
              </div>
            </div>
          </div>
        </section>

        {/* Agents Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Môi Giới Hàng Đầu
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Được khách hàng tin tựng và có nhiều năm kinh nghiệm trong lĩnh vực bất động sản
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agents.map((agent) => (
                <Card key={agent.id} className="overflow-hidden hover:shadow-hover transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                      {agent.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                          <Award className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold">{agent.name}</h3>
                    <p className="text-muted-foreground">{agent.experience}</p>
                    
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{agent.rating}</span>
                      <span className="text-muted-foreground">({agent.reviews} đánh giá)</span>
                    </div>
                    
                    <div className="flex items-center justify-center text-muted-foreground text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {agent.location}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tin đăng:</span>
                        <span className="font-medium">{agent.properties}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Đã bán:</span>
                        <span className="font-medium">{agent.sold}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Chuyên môn:</p>
                        <div className="flex flex-wrap gap-1">
                          {agent.specialties.map((specialty) => (
                            <Badge key={specialty} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 pt-4">
                        <Button size="sm" className="flex-1">
                          <Phone className="h-4 w-4 mr-1" />
                          Gọi
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Xem thêm môi giới
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Agents;