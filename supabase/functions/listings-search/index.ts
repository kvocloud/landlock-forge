import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchParams {
  type?: 'FOR_SALE' | 'FOR_RENT'
  province_code?: string
  district_code?: string
  ward_code?: string
  min_price?: number
  max_price?: number
  q?: string
  page?: number
  limit?: number
  sort?: string
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
    const params: SearchParams = {
      type: url.searchParams.get('type') as 'FOR_SALE' | 'FOR_RENT' || undefined,
      province_code: url.searchParams.get('province_code') || undefined,
      district_code: url.searchParams.get('district_code') || undefined,
      ward_code: url.searchParams.get('ward_code') || undefined,
      min_price: url.searchParams.get('min_price') ? Number(url.searchParams.get('min_price')) : undefined,
      max_price: url.searchParams.get('max_price') ? Number(url.searchParams.get('max_price')) : undefined,
      q: url.searchParams.get('q') || undefined,
      page: Math.max(1, Number(url.searchParams.get('page')) || 1),
      limit: Math.min(50, Math.max(1, Number(url.searchParams.get('limit')) || 20)),
      sort: url.searchParams.get('sort') || 'created_at_desc'
    };

    console.log('Search params:', params);

    // Validate and sanitize price range
    if (params.min_price !== undefined && params.max_price !== undefined) {
      if (params.min_price > params.max_price) {
        [params.min_price, params.max_price] = [params.max_price, params.min_price];
      }
    }

    // Validate price values
    if (params.min_price !== undefined && (params.min_price < 0 || isNaN(params.min_price))) {
      params.min_price = undefined;
    }
    if (params.max_price !== undefined && (params.max_price < 0 || isNaN(params.max_price))) {
      params.max_price = undefined;
    }

    // Build query
    let query = supabase
      .from('listings')
      .select('*', { count: 'exact' })
      .eq('status', 'PUBLISHED');

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

    if (params.min_price !== undefined) {
      query = query.gte('price', params.min_price);
    }

    if (params.max_price !== undefined) {
      query = query.lte('price', params.max_price);
    }

    if (params.q) {
      const keyword = `%${params.q}%`;
      query = query.or(`title.ilike.${keyword},address.ilike.${keyword}`);
    }

    // Apply sorting
    switch (params.sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'created_at_desc':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    // Apply pagination
    const offset = (params.page - 1) * params.limit;
    query = query.range(offset, offset + params.limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ 
          code: 'DATABASE_ERROR',
          message: 'Error fetching listings',
          details: error.message
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        data: data || [],
        page: params.page,
        limit: params.limit,
        total: count || 0
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Search error:', error);
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