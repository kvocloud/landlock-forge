import { useState, useEffect } from "react";
import { Search as SearchIcon, Download, SlidersHorizontal, MapPin, DollarSign, Home } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface Listing {
  id: string;
  title: string;
  type: string;
  price: number;
  area: number;
  address: string;
  province: string;
  district: string;
  ward: string;
  created_at: string;
}

interface SearchResult {
  data: Listing[];
  page: number;
  limit: number;
  total: number;
}

interface GeoItem {
  code: string;
  name: string;
}

const Search = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  // Search filters
  const [filters, setFilters] = useState({
    type: '',
    province_code: '',
    district_code: '',
    ward_code: '',
    min_price: '',
    max_price: '',
    q: '',
    page: 1,
    limit: 20,
    sort: 'created_at_desc'
  });

  // Geographic data
  const [provinces, setProvinces] = useState<GeoItem[]>([]);
  const [districts, setDistricts] = useState<GeoItem[]>([]);
  const [wards, setWards] = useState<GeoItem[]>([]);

  // Search results
  const [results, setResults] = useState<SearchResult>({
    data: [],
    page: 1,
    limit: 20,
    total: 0
  });

  const supabaseUrl = 'https://ppgmfqqwdqqflglzecxu.supabase.co';

  // Load provinces on mount
  useEffect(() => {
    loadProvinces();
  }, []);

  // Load districts when province changes
  useEffect(() => {
    if (filters.province_code) {
      loadDistricts(filters.province_code);
      setFilters(prev => ({ ...prev, district_code: '', ward_code: '' }));
      setWards([]);
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [filters.province_code]);

  // Load wards when district changes
  useEffect(() => {
    if (filters.district_code) {
      loadWards(filters.district_code);
      setFilters(prev => ({ ...prev, ward_code: '' }));
    } else {
      setWards([]);
    }
  }, [filters.district_code]);

  const loadProvinces = async () => {
    try {
      const response = await axios.get(`${supabaseUrl}/functions/v1/geo-data/provinces`);
      setProvinces(response.data);
    } catch (error) {
      console.error('Error loading provinces:', error);
    }
  };

  const loadDistricts = async (provinceCode: string) => {
    try {
      const response = await axios.get(`${supabaseUrl}/functions/v1/geo-data/districts?province_code=${provinceCode}`);
      setDistricts(response.data);
    } catch (error) {
      console.error('Error loading districts:', error);
    }
  };

  const loadWards = async (districtCode: string) => {
    try {
      const response = await axios.get(`${supabaseUrl}/functions/v1/geo-data/wards?district_code=${districtCode}`);
      setWards(response.data);
    } catch (error) {
      console.error('Error loading wards:', error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(`${supabaseUrl}/functions/v1/listings-search?${params}`);
      setResults(response.data);
      
      toast({
        title: "Tìm kiếm thành công",
        description: `Tìm thấy ${response.data.total} kết quả`,
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Lỗi tìm kiếm",
        description: "Không thể tìm kiếm bất động sản. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      
      // Only add filter params (not pagination/sorting for export)
      const exportFilters = {
        type: filters.type,
        province_code: filters.province_code,
        district_code: filters.district_code,
        ward_code: filters.ward_code,
        min_price: filters.min_price,
        max_price: filters.max_price,
        q: filters.q
      };
      
      Object.entries(exportFilters).forEach(([key, value]) => {
        if (value && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(`${supabaseUrl}/functions/v1/listings-export?${params}`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'listings_latest_20.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Xuất file thành công",
        description: "Đã tải xuống 20 tin đăng mới nhất",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Lỗi xuất file",
        description: "Không thể xuất file. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      province_code: '',
      district_code: '',
      ward_code: '',
      min_price: '',
      max_price: '',
      q: '',
      page: 1,
      limit: 20,
      sort: 'created_at_desc'
    });
    setResults({ data: [], page: 1, limit: 20, total: 0 });
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)} tỷ`;
    } else if (price >= 1000000) {
      return `${(price / 1000000).toFixed(0)} tr`;
    }
    return price.toLocaleString('vi-VN');
  };

  const getTypeLabel = (type: string) => {
    return type === 'FOR_SALE' ? 'Bán' : type === 'FOR_RENT' ? 'Thuê' : type;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Tìm Kiếm Bất Động Sản
          </h1>
          <p className="text-lg text-muted-foreground">
            Sử dụng bộ lọc để tìm kiếm bất động sản phù hợp với nhu cầu của bạn
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-card border rounded-xl p-6 shadow-card mb-8">
          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề, địa chỉ..."
                className="pl-10 h-12"
                value={filters.q}
                onChange={(e) => setFilters(prev => ({ ...prev, q: e.target.value }))}
              />
            </div>
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Property Type */}
            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="h-12">
                <div className="flex items-center">
                  <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Loại tin" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả loại</SelectItem>
                <SelectItem value="FOR_SALE">Bán</SelectItem>
                <SelectItem value="FOR_RENT">Thuê</SelectItem>
              </SelectContent>
            </Select>

            {/* Province */}
            <Select value={filters.province_code} onValueChange={(value) => setFilters(prev => ({ ...prev, province_code: value }))}>
              <SelectTrigger className="h-12">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Tỉnh/Thành phố" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả tỉnh/TP</SelectItem>
                {provinces.map((province) => (
                  <SelectItem key={province.code} value={province.code}>
                    {province.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* District */}
            <Select value={filters.district_code} onValueChange={(value) => setFilters(prev => ({ ...prev, district_code: value }))} disabled={!filters.province_code}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Quận/Huyện" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả quận/huyện</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district.code} value={district.code}>
                    {district.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Ward */}
            <Select value={filters.ward_code} onValueChange={(value) => setFilters(prev => ({ ...prev, ward_code: value }))} disabled={!filters.district_code}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Phường/Xã" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả phường/xã</SelectItem>
                {wards.map((ward) => (
                  <SelectItem key={ward.code} value={ward.code}>
                    {ward.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Giá từ (VNĐ)"
                type="number"
                value={filters.min_price}
                onChange={(e) => setFilters(prev => ({ ...prev, min_price: e.target.value }))}
              />
            </div>
            <Input
              placeholder="Giá đến (VNĐ)"
              type="number"
              value={filters.max_price}
              onChange={(e) => setFilters(prev => ({ ...prev, max_price: e.target.value }))}
            />
            <Select value={filters.sort} onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at_desc">Mới nhất</SelectItem>
                <SelectItem value="price_asc">Giá tăng dần</SelectItem>
                <SelectItem value="price_desc">Giá giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleSearch} disabled={loading} className="flex-1 min-w-[200px]">
              <SearchIcon className="h-4 w-4 mr-2" />
              {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
            </Button>
            <Button variant="secondary" onClick={handleExport} disabled={exporting}>
              <Download className="h-4 w-4 mr-2" />
              {exporting ? "Đang xuất..." : "Xuất Excel (20 mới nhất)"}
            </Button>
            <Button variant="outline" onClick={clearFilters}>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Xóa bộ lọc
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-card rounded-xl border shadow-card overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              Kết quả tìm kiếm ({results.total} tin đăng)
            </h2>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : results.data.length === 0 ? (
            <div className="p-12 text-center">
              <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-2">
                Không tìm thấy tin phù hợp
              </p>
              <p className="text-sm text-muted-foreground">
                Thử điều chỉnh bộ lọc để có kết quả tốt hơn
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Diện tích</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.data.map((listing) => (
                    <TableRow key={listing.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {listing.title}
                      </TableCell>
                      <TableCell>{getTypeLabel(listing.type)}</TableCell>
                      <TableCell className="font-semibold text-primary">
                        {formatPrice(listing.price)} VNĐ
                      </TableCell>
                      <TableCell>{listing.area} m²</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {listing.address}, {listing.ward}, {listing.district}, {listing.province}
                      </TableCell>
                      <TableCell>
                        {new Date(listing.created_at).toLocaleDateString('vi-VN')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;