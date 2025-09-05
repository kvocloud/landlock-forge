import { Search, SlidersHorizontal, MapPin, DollarSign, Home, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const SearchFilters = () => {
  const propertyTypes = ["All Types", "Apartment", "House", "Villa", "Condo", "Townhouse"];
  const priceRanges = ["Any Price", "Under 1B", "1B - 3B", "3B - 5B", "5B - 10B", "Over 10B"];
  const locations = ["All Locations", "Ho Chi Minh City", "Hanoi", "Da Nang", "Binh Duong", "Dong Nai"];

  const activeFilters = ["Apartment", "1B - 3B VND", "Ho Chi Minh City"];

  return (
    <div className="bg-card border rounded-xl p-6 shadow-card">
      {/* Main Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by location, property name, or keywords..."
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>
        <Button variant="hero" className="h-12 px-8">
          <Search className="h-5 w-5 mr-2" />
          Search Properties
        </Button>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Property Type */}
        <Select>
          <SelectTrigger className="h-12">
            <div className="flex items-center">
              <Home className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Property Type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map((type) => (
              <SelectItem key={type} value={type.toLowerCase().replace(' ', '-')}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Price Range */}
        <Select>
          <SelectTrigger className="h-12">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Price Range" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {priceRanges.map((range) => (
              <SelectItem key={range} value={range.toLowerCase().replace(' ', '-')}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Location */}
        <Select>
          <SelectTrigger className="h-12">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Location" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location.toLowerCase().replace(' ', '-')}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* More Filters */}
        <Button variant="outline" className="h-12">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-feature-tag hover:bg-muted cursor-pointer"
            >
              {filter}
              <button className="ml-2 hover:text-destructive">×</button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80">
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;