import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const footerLinks = {
    "For Buyers": ["Search Properties", "Featured Listings", "Property Alerts", "Buying Guide", "Mortgage Calculator"],
    "For Sellers": ["List Your Property", "Property Valuation", "Selling Guide", "Marketing Services", "Agent Network"],
    "Company": ["About Us", "Our Team", "Careers", "Press", "Contact"],
    "Resources": ["Blog", "Market Reports", "Legal Info", "Privacy Policy", "Terms of Service"]
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
                Vietnam's leading real estate platform, connecting buyers and sellers with premium properties across the country. Your trusted partner in finding the perfect home.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-3" />
                  <span>123 Nguyen Hue, District 1, Ho Chi Minh City</span>
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
              <h3 className="font-semibold mb-4">Stay Updated</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Get the latest property listings and market insights delivered to your inbox.
              </p>
              <div className="space-y-3">
                <Input
                  placeholder="Enter your email"
                  className="bg-background"
                />
                <Button variant="hero" className="w-full">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-muted-foreground text-sm">
              © 2024 EstateHub Vietnam. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;