import React from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, EnvironmentOutlined, LogoutOutlined } from '@ant-design/icons';
import { getCurrentUser } from '../utils/auth';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = getCurrentUser();
  const username = currentUser?.NAME ?? currentUser?.USERNAME ?? null;

  const currentKey = location.pathname.replace('/', '') || 'profile';

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'logout') {
      localStorage.removeItem('token');
      navigate('/auth');
    } else {
      navigate(`/${e.key}`);
    }
  };

  const menuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: 'Профиль' },
    { key: 'map', icon: <EnvironmentOutlined />, label: 'Карта ивентов' },
    ...(username
      ? [
          {
            key: 'user-label',
            label: `Привет, ${username}!`,
            style: { marginLeft: 'auto', pointerEvents: 'none' as const },
          },
        ]
      : [{ key: 'spacer', label: '', disabled: true, style: { marginLeft: 'auto' } }]),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти',
    },
  ];

  return (
    <Menu
      mode="horizontal"
      selectedKeys={[currentKey]}
      onClick={handleMenuClick}
      items={menuItems}
      style={{ marginBottom: '0px' }}
    />
  );
};