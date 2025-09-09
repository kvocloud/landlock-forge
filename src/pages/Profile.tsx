import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { Loader2, User, Camera, Save } from 'lucide-react';

interface ProfileForm {
  full_name: string;
  phone: string;
  address: string;
  about: string;
}

export default function Profile() {
  const { profile, updateProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileForm>({
    defaultValues: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      about: profile?.about || '',
    }
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        about: profile.about || '',
      });
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true);
    
    const { error } = await updateProfile(data);
    
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Lỗi',
        description: 'Không thể cập nhật hồ sơ. Vui lòng thử lại.',
      });
    } else {
      toast({
        title: 'Thành công',
        description: 'Hồ sơ của bạn đã được cập nhật.',
      });
    }
    
    setLoading(false);
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Quản trị viên';
      case 'AGENT':
        return 'Môi giới';
      default:
        return 'Người dùng';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground">
          Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar & Basic Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                <AvatarFallback className="text-lg">
                  {profile?.full_name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <Button variant="outline" size="sm" onClick={() => {
                toast({
                  title: "Tính năng sắp ra mắt",
                  description: "Chức năng đổi ảnh đại diện sẽ sớm được cập nhật"
                });
              }}>
                <Camera className="mr-2 h-4 w-4" />
                Đổi ảnh đại diện
              </Button>
            </div>
            
            <div className="space-y-2">
              <div>
                <Label className="text-xs text-muted-foreground">Vai trò</Label>
                <p className="font-medium">{getRoleName(profile?.role || 'USER')}</p>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">ID người dùng</Label>
                <p className="text-sm font-mono text-muted-foreground">{profile?.id}</p>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Ngày tham gia</Label>
                <p className="text-sm">
                  {profile?.created_at 
                    ? new Date(profile.created_at).toLocaleDateString('vi-VN')
                    : 'Không xác định'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cập nhật thông tin</CardTitle>
            <CardDescription>
              Thay đổi thông tin cá nhân và mô tả về bản thân
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="full_name"
                    rules={{
                      required: 'Họ tên là bắt buộc',
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Họ và tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Nguyễn Văn A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input placeholder="0123456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới thiệu bản thân</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Viết vài dòng giới thiệu về bản thân, kinh nghiệm làm việc trong lĩnh vực bất động sản..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}