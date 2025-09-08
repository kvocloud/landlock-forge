import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import {
  Wallet as WalletIcon,
  CreditCard,
  Plus,
  Award,
  Zap,
  ArrowUpRight,
  History,
  DollarSign
} from 'lucide-react';

interface WalletData {
  balance: number;
  membership_tier: string;
  boosts_left: number;
}

const membershipPlans = [
  {
    tier: 'SILVER',
    name: 'Gói Bạc',
    price: 299000,
    features: ['10 tin đăng/tháng', '5 lượt đẩy tin', 'Hỗ trợ ưu tiên'],
    color: 'bg-gray-100 text-gray-800 border-gray-200'
  },
  {
    tier: 'GOLD',
    name: 'Gói Vàng',
    price: 599000,
    features: ['25 tin đăng/tháng', '15 lượt đẩy tin', 'Tin VIP', 'Hỗ trợ 24/7'],
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
  },
  {
    tier: 'PLATINUM',
    name: 'Gói Bạch Kim',
    price: 999000,
    features: ['Không giới hạn tin đăng', '30 lượt đẩy tin', 'Tin VIP + Premium', 'Tư vấn riêng'],
    color: 'bg-purple-100 text-purple-800 border-purple-200'
  }
];

export default function Wallet() {
  const { profile } = useAuthStore();
  const [walletData, setWalletData] = useState<WalletData>({
    balance: 0,
    membership_tier: 'FREE',
    boosts_left: 0
  });
  const [topUpAmount, setTopUpAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      loadWalletData();
    }
  }, [profile]);

  const loadWalletData = async () => {
    try {
      const { data: wallet } = await supabase
        .from('wallets')
        .select('balance, membership_tier, boosts_left')
        .eq('user_id', profile?.user_id)
        .single();

      if (wallet) {
        setWalletData(wallet);
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Vui lòng nhập số tiền hợp lệ'
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newBalance = walletData.balance + parseFloat(topUpAmount);
      
      const { error } = await supabase
        .from('wallets')
        .upsert({
          user_id: profile?.user_id,
          balance: newBalance,
          membership_tier: walletData.membership_tier,
          boosts_left: walletData.boosts_left
        });

      if (error) throw error;

      // Record transaction
      await supabase
        .from('transactions')
        .insert({
          user_id: profile?.user_id,
          type: 'TOP_UP',
          amount: parseFloat(topUpAmount),
          description: 'Nạp tiền vào ví',
          status: 'COMPLETED'
        });

      setWalletData(prev => ({ ...prev, balance: newBalance }));
      setTopUpAmount('');
      
      toast({
        title: 'Thành công',
        description: `Đã nạp ${formatPrice(parseFloat(topUpAmount))} vào ví của bạn`
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể nạp tiền. Vui lòng thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeMembership = async (tier: string, price: number) => {
    if (walletData.balance < price) {
      toast({
        variant: 'destructive',
        title: 'Không đủ số dư',
        description: 'Vui lòng nạp thêm tiền để nâng cấp gói thành viên'
      });
      return;
    }

    setLoading(true);
    try {
      const newBalance = walletData.balance - price;
      const newBoosts = walletData.boosts_left + (tier === 'SILVER' ? 5 : tier === 'GOLD' ? 15 : 30);
      
      const { error } = await supabase
        .from('wallets')
        .update({
          balance: newBalance,
          membership_tier: tier,
          boosts_left: newBoosts
        })
        .eq('user_id', profile?.user_id);

      if (error) throw error;

      // Record transaction
      await supabase
        .from('transactions')
        .insert({
          user_id: profile?.user_id,
          type: 'MEMBERSHIP_UPGRADE',
          amount: -price,
          description: `Nâng cấp lên gói ${membershipPlans.find(p => p.tier === tier)?.name}`,
          status: 'COMPLETED'
        });

      setWalletData(prev => ({
        ...prev,
        balance: newBalance,
        membership_tier: tier,
        boosts_left: newBoosts
      }));
      
      toast({
        title: 'Thành công',
        description: `Đã nâng cấp lên gói ${membershipPlans.find(p => p.tier === tier)?.name}`
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể nâng cấp gói thành viên. Vui lòng thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Ví của tôi</h1>
        <p className="text-muted-foreground">
          Quản lý số dư và gói thành viên của bạn
        </p>
      </div>

      {/* Wallet Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số dư khả dụng</CardTitle>
            <WalletIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(walletData.balance)}</div>
            <p className="text-xs text-muted-foreground">
              Có thể sử dụng ngay
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gói thành viên</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getTierBadge(walletData.membership_tier)}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Gói hiện tại
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt đẩy tin</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{walletData.boosts_left}</div>
            <p className="text-xs text-muted-foreground">
              Lượt còn lại
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="topup" className="space-y-4">
        <TabsList>
          <TabsTrigger value="topup">Nạp tiền</TabsTrigger>
          <TabsTrigger value="membership">Nâng cấp gói</TabsTrigger>
          <TabsTrigger value="history">Lịch sử giao dịch</TabsTrigger>
        </TabsList>

        <TabsContent value="topup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Nạp tiền vào ví</CardTitle>
              <CardDescription>
                Chọn số tiền muốn nạp vào ví của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-4">
                {[100000, 200000, 500000, 1000000].map(amount => (
                  <Button
                    key={amount}
                    variant="outline"
                    onClick={() => setTopUpAmount(amount.toString())}
                    className="h-12"
                  >
                    {formatPrice(amount)}
                  </Button>
                ))}
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Nhập số tiền (VND)"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                  />
                </div>
                <Button onClick={handleTopUp} disabled={loading}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nạp tiền
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="membership" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {membershipPlans.map(plan => (
              <Card key={plan.tier} className={`border-2 ${plan.color.includes('purple') ? 'border-purple-200' : plan.color.includes('yellow') ? 'border-yellow-200' : 'border-gray-200'}`}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {plan.name}
                    <Badge className={plan.color}>
                      <Award className="w-3 h-3 mr-1" />
                      {plan.tier}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold">{formatPrice(plan.price)}</span>
                    <span className="text-sm">/tháng</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-center text-sm">
                        <ArrowUpRight className="mr-2 h-3 w-3 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className="w-full"
                    variant={walletData.membership_tier === plan.tier ? "outline" : "default"}
                    disabled={walletData.membership_tier === plan.tier || loading}
                    onClick={() => handleUpgradeMembership(plan.tier, plan.price)}
                  >
                    {walletData.membership_tier === plan.tier ? 'Đang sử dụng' : 'Nâng cấp'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5" />
                Lịch sử giao dịch
              </CardTitle>
              <CardDescription>
                Xem tất cả giao dịch của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold">Chưa có giao dịch nào</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Các giao dịch của bạn sẽ hiển thị ở đây.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}