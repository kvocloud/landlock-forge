import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";

export interface Property {
  id: number;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking?: number;
  image: string;
  status: "Cần bán" | "Cho thuê" | "Đã bán";
  featured: boolean;
  description: string;
  amenities: string[];
  propertyType: string;
}

export const mockProperties: Property[] = [
  {
    id: 1,
    title: "Luxury Apartment in Landmark 81 Tower",
    price: 8500000000,
    location: "Binh Thanh District, Ho Chi Minh City",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    parking: 2,
    image: property1,
    status: "Cần bán",
    featured: true,
    description: "Stunning luxury apartment with panoramic city views in the iconic Landmark 81. Features premium finishes and world-class amenities.",
    amenities: ["Swimming Pool", "Gym", "Concierge", "Sky Garden", "Security 24/7"],
    propertyType: "Apartment"
  },
  {
    id: 2,
    title: "Modern Villa with Garden in Thao Dien",
    price: 15000000000,
    location: "Thao Dien, District 2, Ho Chi Minh City",
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    parking: 3,
    image: property2,
    status: "Cần bán",
    featured: true,
    description: "Beautifully designed modern villa in prestigious Thao Dien area. Perfect for families with spacious living areas and private garden.",
    amenities: ["Private Garden", "Parking", "Security", "Modern Kitchen", "Master Suite"],
    propertyType: "Villa"
  },
  {
    id: 3,
    title: "Elegant Poolside Villa in District 7",
    price: 12000000000,
    location: "District 7, Ho Chi Minh City",
    bedrooms: 5,
    bathrooms: 4,
    area: 300,
    parking: 2,
    image: property3,
    status: "Cần bán",
    featured: false,
    description: "Spacious villa with private swimming pool and contemporary design. Located in the heart of District 7's international community.",
    amenities: ["Swimming Pool", "Garden", "Parking", "BBQ Area", "Security"],
    propertyType: "Villa"
  },
  {
    id: 4,
    title: "Cozy Apartment for Rent in District 1",
    price: 25000000,
    location: "District 1, Ho Chi Minh City",
    bedrooms: 2,
    bathrooms: 1,
    area: 80,
    parking: 1,
    image: property1,
    status: "Cho thuê",
    featured: false,
    description: "Well-located apartment in the city center, perfect for young professionals. Walking distance to major attractions and business districts.",
    amenities: ["Elevator", "Balcony", "Air Conditioning", "Kitchen", "Internet"],
    propertyType: "Apartment"
  },
  {
    id: 5,
    title: "Penthouse with City Views",
    price: 20000000000,
    location: "District 3, Ho Chi Minh City",
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    parking: 2,
    image: property2,
    status: "Cần bán",
    featured: true,
    description: "Exclusive penthouse with 360-degree city views. Premium location with luxury amenities and sophisticated design.",
    amenities: ["City Views", "Roof Terrace", "Elevator", "Premium Finishes", "Concierge"],
    propertyType: "Penthouse"
  },
  {
    id: 6,
    title: "Family Townhouse in Binh Duong",
    price: 4500000000,
    location: "Thu Dau Mot, Binh Duong",
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    parking: 2,
    image: property3,
    status: "Cần bán",
    featured: false,
    description: "Affordable family home with modern amenities. Great for growing families looking for space and value outside the city center.",
    amenities: ["Garden", "Parking", "Modern Kitchen", "Security", "Playground Nearby"],
    propertyType: "Townhouse"
  },
  {
    id: 7,
    title: "Family Townhouse in Ha Nam",
    price: 4500000000,
    location: "Thu Dau Mot, Binh Duong",
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    parking: 2,
    image: property3,
    status: "Cho thuê",
    featured: false,
    description: "Affordable family home with modern amenities. Great for growing families looking for space and value outside the city center.",
    amenities: ["Garden", "Parking", "Modern Kitchen", "Security", "Playground Nearby"],
    propertyType: "Townhouse"
  },
  {
    id: 8,
    title: "Family Townhouse in Ha Noi",
    price: 4500000000,
    location: "Thu Dau Mot, Binh Duong",
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    parking: 2,
    image: property3,
    status: "Cho thuê",
    featured: false,
    description: "Affordable family home with modern amenities. Great for growing families looking for space and value outside the city center.",
    amenities: ["Garden", "Parking", "Modern Kitchen", "Security", "Playground Nearby"],
    propertyType: "Townhouse"
  },
  {
    id: 9,
    title: "Family Townhouse in VN",
    price: 4500000000,
    location: "Thu Dau Mot, Binh Duong",
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    parking: 2,
    image: property3,
    status: "Cho thuê",
    featured: false,
    description: "Affordable family home with modern amenities. Great for growing families looking for space and value outside the city center.",
    amenities: ["Garden", "Parking", "Modern Kitchen", "Security", "Playground Nearby"],
    propertyType: "Townhouse"
  }
];

export const getFeaturedProperties = () => mockProperties.filter(property => property.featured);
export const getPropertiesForSale = () => mockProperties.filter(property => property.status === "Cần bán");
export const getPropertiesForRent = () => mockProperties.filter(property => property.status === "Cho thuê");
