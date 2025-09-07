import { useState } from 'react';

export interface SearchFilters {
  query: string;
  propertyType: string;
  priceRange: string;
  location: string;
  province: string;
  district: string;
}

export const useSearchFilters = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    propertyType: 'all-types',
    priceRange: 'any-price',
    location: 'all-locations',
    province: '',
    district: '',
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Update active filters
    if (value && value !== 'all-types' && value !== 'any-price' && value !== 'all-locations') {
      const filterLabel = getFilterLabel(key, value);
      if (filterLabel && !activeFilters.includes(filterLabel)) {
        setActiveFilters(prev => [...prev, filterLabel]);
      }
    }
  };

  const removeFilter = (filterLabel: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filterLabel));
    
    // Reset the corresponding filter value
    const filterKey = getFilterKeyByLabel(filterLabel);
    if (filterKey) {
      setFilters(prev => ({ 
        ...prev, 
        [filterKey]: getDefaultValue(filterKey) 
      }));
    }
  };

  const clearAllFilters = () => {
    setFilters({
      query: '',
      propertyType: 'all-types',
      priceRange: 'any-price',
      location: 'all-locations',
      province: '',
      district: '',
    });
    setActiveFilters([]);
  };

  const searchProperties = () => {
    console.log('Searching with filters:', filters);
    // Here you would typically call an API or filter local data
    return [];
  };

  return {
    filters,
    activeFilters,
    updateFilter,
    removeFilter,
    clearAllFilters,
    searchProperties,
  };
};

const getFilterLabel = (key: keyof SearchFilters, value: string): string | null => {
  const labelMap: Record<string, Record<string, string>> = {
    propertyType: {
      'apartment': 'Căn hộ',
      'house': 'Nhà riêng',
      'villa': 'Biệt thự',
      'condo': 'Chung cư',
      'townhouse': 'Nhà phố',
    },
    priceRange: {
      'under-1b': 'Dưới 1 tỷ',
      '1b-3b': '1-3 tỷ',
      '3b-5b': '3-5 tỷ',
      '5b-10b': '5-10 tỷ',
      'over-10b': 'Trên 10 tỷ',
    },
    location: {
      'ho-chi-minh-city': 'TP. Hồ Chí Minh',
      'hanoi': 'Hà Nội',
      'da-nang': 'Đà Nẵng',
      'binh-duong': 'Bình Dương',
      'dong-nai': 'Đồng Nai',
    },
  };

  return labelMap[key]?.[value] || null;
};

const getFilterKeyByLabel = (label: string): keyof SearchFilters | null => {
  const labelToKeyMap: Record<string, keyof SearchFilters> = {
    'Căn hộ': 'propertyType',
    'Nhà riêng': 'propertyType',
    'Biệt thự': 'propertyType',
    'Chung cư': 'propertyType',
    'Nhà phố': 'propertyType',
    'Dưới 1 tỷ': 'priceRange',
    '1-3 tỷ': 'priceRange',
    '3-5 tỷ': 'priceRange',
    '5-10 tỷ': 'priceRange',
    'Trên 10 tỷ': 'priceRange',
    'TP. Hồ Chí Minh': 'location',
    'Hà Nội': 'location',
    'Đà Nẵng': 'location',
    'Bình Dương': 'location',
    'Đồng Nai': 'location',
  };

  return labelToKeyMap[label] || null;
};

const getDefaultValue = (key: keyof SearchFilters): string => {
  const defaults: Record<keyof SearchFilters, string> = {
    query: '',
    propertyType: 'all-types',
    priceRange: 'any-price',
    location: 'all-locations',
    province: '',
    district: '',
  };

  return defaults[key];
};