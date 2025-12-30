import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd';
import type { MenuProps } from 'antd';
import {
  LayoutDashboard,
  Building2,
  Users,
  Stethoscope,
  Calendar,
  User,
  LogOut,
  Menu as MenuIcon,
  X,
  Settings,
  Heart,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <User size={16} />,
      label: 'My Profile',
      onClick: () => navigate('/profile'),
    },
    {
      key: 'settings',
      icon: <Settings size={16} />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  const menuItems: MenuProps['items'] = [
    {
      key: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/hospitals',
      icon: <Building2 size={20} />,
      label: <Link to="/hospitals">Hospitals</Link>,
    },
    {
      key: '/users',
      icon: <Users size={20} />,
      label: <Link to="/users">Users</Link>,
    },
    {
      key: '/doctors',
      icon: <Stethoscope size={20} />,
      label: <Link to="/doctors">Doctors</Link>,
    },
    {
      key: '/appointments',
      icon: <Calendar size={20} />,
      label: <Link to="/appointments">Appointments</Link>,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        className="shadow-xl"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-slate-700">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 medical-gradient rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            {!collapsed && (
              <span className="text-white font-bold text-xl">Upcharify</span>
            )}
          </Link>
        </div>

        {/* Menu */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['/hospitals']}
          items={menuItems}
          className="border-r-0"
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header className="bg-white shadow-md px-6 flex items-center justify-between sticky top-0 z-10">
          <Button
            type="text"
            icon={collapsed ? <MenuIcon size={20} /> : <X size={20} />}
            onClick={() => setCollapsed(!collapsed)}
            className="text-lg"
          />

          <div className="flex items-center space-x-4">
            {/* User Profile */}
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <div className="flex items-center space-x-3 cursor-pointer hover:bg-slate-50 rounded-xl p-2 transition-colors">
                <Avatar 
                  size="large" 
                  className="bg-gradient-to-r from-teal-500 to-cyan-600"
                  icon={<User size={20} />}
                />
                <div className="hidden md:block">
                  <p className="font-semibold text-slate-800">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ')}</p>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content className="m-6 overflow-auto">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;