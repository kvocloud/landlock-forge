import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import {
  Building,
  Clock,
  Eye,
  Users,
  Wallet,
  Award,
  Zap,
  Plus,
  DollarSign,
  ShieldCheck,
} from 'lucide-react';

interface DashboardStats {
  publishedCount: number;
  pendingCount: number;
  weeklyViews: number;
  newLeads: number;
  walletBalance: number;
  membershipTier: string;
  boostsLeft: number;
}

interface Listing {
  id: string;
  title: string;
  type: string;
  category: string;
  price: number;
  area: number;
  address: string;
  status: string;
  views: number;
  updated_at: string;
  images: any;
}

export default function Dashboard() {
  const { profile } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    publishedCount: 0,
    pendingCount: 0,
    weeklyViews: 0,
    newLeads: 0,
    walletBalance: 0,
    membershipTier: 'FREE',
    boostsLeft: 0,
  });
  const [recentListings, setRecentListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadDashboardData();
    }
  }, [profile]);

  const loadDashboardData = async () => {
    try {
      // Load listings stats
      const { data: listings } = await supabase
        .from('listings')
        .select('id, title, type, category, price, area, address, status, views, updated_at, images')
        .eq('user_id', profile?.user_id)
        .order('updated_at', { ascending: false });

      if (listings) {
        const publishedCount = listings.filter(l => l.status === 'PUBLISHED').length;
        const pendingCount = listings.filter(l => l.status === 'PENDING').length;
        const weeklyViews = listings.reduce((sum, l) => sum + (l.views || 0), 0);
        
        setStats(prev => ({
          ...prev,
          publishedCount,
          pendingCount,
          weeklyViews,
        }));

        setRecentListings(listings.slice(0, 5));
      }

      // Load wallet data
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance, membership_tier, boosts_left')
        .eq('user_id', profile?.user_id)
        .single();

      if (wallet) {
        setStats(prev => ({
          ...prev,
          walletBalance: wallet.balance || 0,
          membershipTier: wallet.membership_tier || 'FREE',
          boostsLeft: wallet.boosts_left || 0,
        }));
      }

      // Load leads count
      const { count: leadsCount } = await supabase
        .from('leads')
        .select('*', { count: 'exact', head: true })
        .eq('agent_id', profile?.user_id);

      setStats(prev => ({
        ...prev,
        newLeads: leadsCount || 0,
      }));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'DRAFT': { label: 'Nháp', variant: 'secondary' as const },
      'PENDING': { label: 'Chờ duyệt', variant: 'outline' as const },
      'APPROVED': { label: 'Đã duyệt', variant: 'default' as const },
      'PUBLISHED': { label: 'Đã đăng', variant: 'default' as const },
      'SOLD': { label: 'Đã bán', variant: 'destructive' as const },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getTierBadge = (tier: string) => {
    const tierMap = {
      'FREE': { label: 'Miễn phí', color: 'bg-gray-100 text-gray-800' },
      'SILVER': { label: 'Bạc', color: 'bg-gray-200 text-gray-900' },
      'GOLD': { label: 'Vàng', color: 'bg-yellow-100 text-yellow-800' },
      'PLATINUM': { label: 'Bạch kim', color: 'bg-purple-100 text-purple-800' },
    };
    
    const tierInfo = tierMap[tier as keyof typeof tierMap] || { label: tier, color: 'bg-gray-100 text-gray-800' };
    return (
      <Badge className={tierInfo.color}>
        <Award className="w-3 h-3 mr-1" />
        {tierInfo.label}
      </Badge>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-4 w-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-1"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div>
        <h1 className="text-3xl font-bold">
          Chào mừng, {profile?.full_name || 'Người dùng'}!
        </h1>
        <p className="text-muted-foreground">
          Tổng quan về hoạt động bất động sản của bạn
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tin đã đăng</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publishedCount}</div>
            <p className="text-xs text-muted-foreground">
              Tin đang hoạt động
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Tin chờ kiểm duyệt
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt xem</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weeklyViews}</div>
            <p className="text-xs text-muted-foreground">
              Tổng lượt xem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng mới</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newLeads}</div>
            <p className="text-xs text-muted-foreground">
              Khách hàng tiềm năng
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Wallet & Membership */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wallet className="mr-2 h-5 w-5" />
              Ví của tôi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold">{formatPrice(stats.walletBalance)}</p>
              <p className="text-sm text-muted-foreground">Số dư khả dụng</p>
            </div>
            
            <div className="flex items-center justify-between">
              {getTierBadge(stats.membershipTier)}
              <div className="flex items-center text-sm">
                <Zap className="mr-1 h-4 w-4 text-yellow-500" />
                {stats.boostsLeft} lượt đẩy tin
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link to="/wallet">
                  <DollarSign className="mr-1 h-4 w-4" />
                  Nạp tiền
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/wallet/transactions">Lịch sử</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hành động nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link to="/listings/new">
                <Plus className="mr-2 h-4 w-4" />
                Đăng tin bất động sản
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full justify-start">
              <Link to="/wallet">
                <Wallet className="mr-2 h-4 w-4" />
                Nâng cấp gói thành viên
              </Link>
            </Button>
            
            {profile?.role === 'ADMIN' && (
              <Button variant="outline" asChild className="w-full justify-start">
                <Link to="/admin/moderation">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Kiểm duyệt tin đăng ({stats.pendingCount})
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Listings */}
      <Card>
        <CardHeader>
          <CardTitle>Tin đăng gần đây</CardTitle>
          <CardDescription>
            Các tin đăng mới nhất của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentListings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Diện tích</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Lượt xem</TableHead>
                  <TableHead>Cập nhật</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentListings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell>
                      <Link to={`/listings/${listing.id}`} className="font-medium hover:underline">
                        {listing.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {listing.type === 'FOR_SALE' ? 'Bán' : 'Thuê'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatPrice(listing.price)}</TableCell>
                    <TableCell>{listing.area} m²</TableCell>
                    <TableCell>{getStatusBadge(listing.status)}</TableCell>
                    <TableCell>{listing.views}</TableCell>
                    <TableCell>
                      {new Date(listing.updated_at).toLocaleDateString('vi-VN')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Building className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Chưa có tin đăng nào</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Hãy bắt đầu bằng cách tạo tin đăng đầu tiên của bạn.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/listings/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo tin đăng mới
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}