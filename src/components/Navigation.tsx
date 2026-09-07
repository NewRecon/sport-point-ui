import React from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserOutlined, EnvironmentOutlined, LogoutOutlined } from '@ant-design/icons';

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    { 
      key: 'logout', 
      icon: <LogoutOutlined />, 
      label: 'Выйти', 
      style: { marginLeft: 'auto' } 
    },
  ];

  return (
    <Menu 
      mode="horizontal" 
      selectedKeys={[currentKey]} 
      onClick={handleMenuClick} 
      items={menuItems} /* <--- Добавили эту строчку, теперь всё применится */
      style={{ marginBottom: '24px' }}
    />
  );
};
