import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building,
  Plus,
  Users,
  Wallet,
  CreditCard,
  Bell,
  ShieldCheck,
  Settings,
  User,
  Menu,
  Home,
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Trang chủ',
    href: '/',
    icon: Home,
    roles: ['ADMIN', 'AGENT', 'USER'],
  },
  {
    title: 'Tổng quan',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'AGENT', 'USER'],
  },
  {
    title: 'Tin đăng của tôi',
    href: '/listings',
    icon: Building,
    roles: ['ADMIN', 'AGENT', 'USER'],
  },
  {
    title: 'Đăng tin mới',
    href: '/listings/new',
    icon: Plus,
    roles: ['ADMIN', 'AGENT', 'USER'],
  },
  {
    title: 'Khách hàng tiềm năng',
    href: '/leads',
    icon: Users,
    roles: ['ADMIN', 'AGENT'],
  },
  {
    title: 'Ví & Gói thành viên',
    href: '/wallet',
    icon: Wallet,
    roles: ['ADMIN', 'AGENT', 'USER'],
  },
  {
    title: 'Lịch sử giao dịch',
    href: '/wallet/transactions',
    icon: CreditCard,
    roles: ['ADMIN', 'AGENT', 'USER'],
  },
  {
    title: 'Thông báo',
    href: '/notifications',
    icon: Bell,
    roles: ['ADMIN', 'AGENT', 'USER'],
  },
  {
    title: 'Kiểm duyệt',
    href: '/admin/moderation',
    icon: ShieldCheck,
    roles: ['ADMIN'],
  },
  {
    title: 'Cài đặt',
    href: '/settings',
    icon: Settings,
    roles: ['ADMIN', 'AGENT', 'USER'],
  },
  {
    title: 'Hồ sơ cá nhân',
    href: '/profile',
    icon: User,
    roles: ['ADMIN', 'AGENT', 'USER'],
  },
];

export const Sidebar = () => {
  const { profile } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();

  const filteredItems = navigationItems.filter(item => 
    profile && item.roles.includes(profile.role)
  );

  return (
    <aside className={cn(
      'fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300',
      sidebarOpen ? 'w-64' : 'w-16'
    )}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link to="/" className={cn('flex items-center space-x-2', !sidebarOpen && 'justify-center')}>
            <Building className="h-8 w-8 text-primary" />
            {sidebarOpen && (
              <span className="text-xl font-bold text-primary">BDS</span>
            )}
          </Link>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {filteredItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start text-left',
                    !sidebarOpen && 'justify-center px-2'
                  )}
                >
                  <item.icon className={cn('h-5 w-5', sidebarOpen && 'mr-3')} />
                  {sidebarOpen && <span>{item.title}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        {sidebarOpen && profile && (
          <div className="border-t border-border p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {profile.full_name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {profile.full_name || 'Người dùng'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profile.role === 'ADMIN' ? 'Quản trị viên' : 
                   profile.role === 'AGENT' ? 'Môi giới' : 'Người dùng'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};