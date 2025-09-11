const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Mock Vietnamese geographic data
const provinces = [
  { code: 'HN', name: 'Hà Nội' },
  { code: 'HCM', name: 'TP. Hồ Chí Minh' },
  { code: 'DN', name: 'Đà Nẵng' },
  { code: 'BD', name: 'Bình Dương' },
  { code: 'DNai', name: 'Đồng Nai' },
  { code: 'HP', name: 'Hải Phòng' },
  { code: 'CT', name: 'Cần Thơ' },
  { code: 'VT', name: 'Vũng Tàu' }
];

const districts = {
  'HN': [
    { code: 'HN-BA', name: 'Ba Đình' },
    { code: 'HN-HK', name: 'Hoàn Kiếm' },
    { code: 'HN-TX', name: 'Tây Hồ' },
    { code: 'HN-LB', name: 'Long Biên' },
    { code: 'HN-CG', name: 'Cầu Giấy' },
    { code: 'HN-DD', name: 'Đống Đa' },
    { code: 'HN-HB', name: 'Hai Bà Trưng' },
    { code: 'HN-HM', name: 'Hoàng Mai' },
    { code: 'HN-TH', name: 'Thanh Xuân' }
  ],
  'HCM': [
    { code: 'HCM-1', name: 'Quận 1' },
    { code: 'HCM-2', name: 'Quận 2' },
    { code: 'HCM-3', name: 'Quận 3' },
    { code: 'HCM-4', name: 'Quận 4' },
    { code: 'HCM-5', name: 'Quận 5' },
    { code: 'HCM-6', name: 'Quận 6' },
    { code: 'HCM-7', name: 'Quận 7' },
    { code: 'HCM-8', name: 'Quận 8' },
    { code: 'HCM-9', name: 'Quận 9' },
    { code: 'HCM-10', name: 'Quận 10' },
    { code: 'HCM-11', name: 'Quận 11' },
    { code: 'HCM-12', name: 'Quận 12' },
    { code: 'HCM-BD', name: 'Bình Dương' },
    { code: 'HCM-BT', name: 'Bình Thạnh' },
    { code: 'HCM-GV', name: 'Gò Vấp' },
    { code: 'HCM-PN', name: 'Phú Nhuận' },
    { code: 'HCM-TB', name: 'Tân Bình' },
    { code: 'HCM-TP', name: 'Tân Phú' }
  ],
  'DN': [
    { code: 'DN-HC', name: 'Hải Châu' },
    { code: 'DN-TK', name: 'Thanh Khê' },
    { code: 'DN-SH', name: 'Sơn Trà' },
    { code: 'DN-NC', name: 'Ngũ Hành Sơn' },
    { code: 'DN-LP', name: 'Liên Chiểu' },
    { code: 'DN-CH', name: 'Cẩm Lệ' }
  ]
};

const wards = {
  'HN-BA': [
    { code: 'HN-BA-1', name: 'Phúc Xá' },
    { code: 'HN-BA-2', name: 'Trúc Bạch' },
    { code: 'HN-BA-3', name: 'Vĩnh Phúc' },
    { code: 'HN-BA-4', name: 'Cống Vị' }
  ],
  'HN-HK': [
    { code: 'HN-HK-1', name: 'Phúc Tân' },
    { code: 'HN-HK-2', name: 'Đồng Xuân' },
    { code: 'HN-HK-3', name: 'Hàng Mã' },
    { code: 'HN-HK-4', name: 'Hàng Buồm' }
  ],
  'HCM-1': [
    { code: 'HCM-1-1', name: 'Tân Định' },
    { code: 'HCM-1-2', name: 'Đa Kao' },
    { code: 'HCM-1-3', name: 'Bến Nghé' },
    { code: 'HCM-1-4', name: 'Bến Thành' }
  ],
  'HCM-2': [
    { code: 'HCM-2-1', name: 'Thủ Thiêm' },
    { code: 'HCM-2-2', name: 'An Phú' },
    { code: 'HCM-2-3', name: 'Bình An' },
    { code: 'HCM-2-4', name: 'Cát Lái' }
  ]
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;
    
    console.log('Geo API path:', path);

    // Get provinces
    if (path.includes('/provinces')) {
      return new Response(
        JSON.stringify(provinces),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get districts by province
    if (path.includes('/districts')) {
      const provinceCode = url.searchParams.get('province_code');
      if (!provinceCode) {
        return new Response(
          JSON.stringify({ code: 'MISSING_PARAM', message: 'province_code is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const districtList = districts[provinceCode] || [];
      return new Response(
        JSON.stringify(districtList),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get wards by district
    if (path.includes('/wards')) {
      const districtCode = url.searchParams.get('district_code');
      if (!districtCode) {
        return new Response(
          JSON.stringify({ code: 'MISSING_PARAM', message: 'district_code is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const wardList = wards[districtCode] || [];
      return new Response(
        JSON.stringify(wardList),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ code: 'NOT_FOUND', message: 'Endpoint not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Geo API error:', error);
    return new Response(
      JSON.stringify({ 
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
        details: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});