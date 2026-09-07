import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Button, Space, Typography, message, Spin } from 'antd';
import { Navigation } from '../components/Navigation';
import { profileService } from '../api/profileService';
import type { UserProfileData } from '../api/profileService';

const { Title } = Typography;

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfileData | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await profileService.getProfile();
        setUser(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки';
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {/* Наша общая навигация */}
      <Navigation />

      <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'center' }}>
        <Card style={{ width: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          {loading ? (
            /* Показываем аккуратный спиннер Antd во время загрузки данных */
            <div style={{ textAlign: 'center', padding: '40px 0' }}><Spin size="large" /></div>
          ) : user ? (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Title level={3} style={{ margin: 0 }}>Мой профиль</Title>

              {/* Компонент Antd для отображения ключ-значение */}
              <Descriptions bordered column={1} size="middle">
                <Descriptions.Item label="Имя">{user.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Роль">{user.role}</Descriptions.Item>
                <Descriptions.Item label="Дата регистрации">{user.regDate}</Descriptions.Item>
              </Descriptions>

              <Button type="default" onClick={() => alert('Редактирование пока не реализовано')}>
                Редактировать профиль
              </Button>
            </Space>
          ) : (
            <div style={{ textAlign: 'center' }}>Не удалось загрузить данные профиля</div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
