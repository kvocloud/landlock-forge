import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExportParams {
  type?: 'FOR_SALE' | 'FOR_RENT'
  province_code?: string
  district_code?: string
  ward_code?: string
  min_price?: number
  max_price?: number
  q?: string
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const params: ExportParams = {
      type: url.searchParams.get('type') as 'FOR_SALE' | 'FOR_RENT' || undefined,
      province_code: url.searchParams.get('province_code') || undefined,
      district_code: url.searchParams.get('district_code') || undefined,
      ward_code: url.searchParams.get('ward_code') || undefined,
      min_price: url.searchParams.get('min_price') ? Number(url.searchParams.get('min_price')) : undefined,
      max_price: url.searchParams.get('max_price') ? Number(url.searchParams.get('max_price')) : undefined,
      q: url.searchParams.get('q') || undefined,
    };

    console.log('Export params:', params);

    // Validate and sanitize price range
    if (params.min_price !== undefined && params.max_price !== undefined) {
      if (params.min_price > params.max_price) {
        [params.min_price, params.max_price] = [params.max_price, params.min_price];
      }
    }

    // Build query - always limit to 20 and sort by created_at desc
    let query = supabase
      .from('listings')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('created_at', { ascending: false })
      .limit(20);

    // Apply filters
    if (params.type) {
      query = query.eq('type', params.type);
    }

    if (params.province_code) {
      query = query.eq('province', params.province_code);
    }

    if (params.district_code) {
      query = query.eq('district', params.district_code);
    }

    if (params.ward_code) {
      query = query.eq('ward', params.ward_code);
    }

    if (params.min_price !== undefined && params.min_price >= 0) {
      query = query.gte('price', params.min_price);
    }

    if (params.max_price !== undefined && params.max_price >= 0) {
      query = query.lte('price', params.max_price);
    }

    if (params.q) {
      const keyword = `%${params.q}%`;
      query = query.or(`title.ilike.${keyword},address.ilike.${keyword}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ 
          code: 'DATABASE_ERROR',
          message: 'Error fetching listings for export',
          details: error.message
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create simple CSV content (simplified Excel format)
    const headers = [
      'ID',
      'Tiêu đề', 
      'Loại tin',
      'Giá',
      'Diện tích',
      'Địa chỉ',
      'Phường/Xã',
      'Quận/Huyện', 
      'Tỉnh/TP',
      'Ngày tạo'
    ];

    let csvContent = headers.join(',') + '\n';

    if (!data || data.length === 0) {
      csvContent += 'No data available\n';
    } else {
      data.forEach(listing => {
        const row = [
          listing.id,
          `"${listing.title || ''}"`,
          listing.type || '',
          listing.price || 0,
          listing.area || '',
          `"${listing.address || ''}"`,
          listing.ward || '',
          listing.district || '',
          listing.province || '',
          new Date(listing.created_at).toLocaleDateString('vi-VN')
        ];
        csvContent += row.join(',') + '\n';
      });
    }

    // Return as downloadable file
    return new Response(csvContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="listings_latest_20.csv"'
      }
    });

  } catch (error) {
    console.error('Export error:', error);
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