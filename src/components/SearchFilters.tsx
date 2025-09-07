import { Search, SlidersHorizontal, MapPin, DollarSign, Home, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useSearchFilters } from "@/hooks/useSearchFilters";

const SearchFilters = () => {
  const { filters, activeFilters, updateFilter, removeFilter, clearAllFilters, searchProperties } = useSearchFilters();
  
  const propertyTypes = [
    { value: "all-types", label: "Tất cả loại hình" },
    { value: "apartment", label: "Căn hộ" },
    { value: "house", label: "Nhà riêng" },
    { value: "villa", label: "Biệt thự" },
    { value: "condo", label: "Chung cư" },
    { value: "townhouse", label: "Nhà phố" },
  ];
  
  const priceRanges = [
    { value: "any-price", label: "Tất cả mức giá" },
    { value: "under-1b", label: "Dưới 1 tỷ" },
    { value: "1b-3b", label: "1 - 3 tỷ" },
    { value: "3b-5b", label: "3 - 5 tỷ" },
    { value: "5b-10b", label: "5 - 10 tỷ" },
    { value: "over-10b", label: "Trên 10 tỷ" },
  ];
  
  const locations = [
    { value: "all-locations", label: "Tất cả khu vực" },
    { value: "ho-chi-minh-city", label: "TP. Hồ Chí Minh" },
    { value: "hanoi", label: "Hà Nội" },
    { value: "da-nang", label: "Đà Nẵng" },
    { value: "binh-duong", label: "Bình Dương" },
    { value: "dong-nai", label: "Đồng Nai" },
  ];

  return (
    <div className="bg-card border rounded-xl p-6 shadow-card">
      {/* Main Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo địa điểm, tên dự án hoặc từ khóa..."
              className="pl-10 h-12 text-base"
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
            />
          </div>
        </div>
        <Button variant="hero" className="h-12 px-8" onClick={searchProperties}>
          <Search className="h-5 w-5 mr-2" />
          Tìm Kiếm BĐS
        </Button>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Property Type */}
        <Select value={filters.propertyType} onValueChange={(value) => updateFilter('propertyType', value)}>
          <SelectTrigger className="h-12">
            <div className="flex items-center">
              <Home className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Loại hình BĐS" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Price Range */}
        <Select value={filters.priceRange} onValueChange={(value) => updateFilter('priceRange', value)}>
          <SelectTrigger className="h-12">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Mức giá" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location */}
        <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
          <SelectTrigger className="h-12">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Khu vực" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location.value} value={location.value}>
                {location.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* More Filters */}
        <Button variant="outline" className="h-12">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Bộ Lọc Khác
        </Button>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Bộ lọc đang áp dụng:</span>
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-feature-tag hover:bg-muted cursor-pointer"
              onClick={() => removeFilter(filter)}
            >
              {filter}
              <button className="ml-2 hover:text-destructive">×</button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80" onClick={clearAllFilters}>
            Xóa tất cả
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;