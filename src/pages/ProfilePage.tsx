import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions, Button, Space, Typography, message, Spin } from 'antd';
import { Navigation } from '../components/Navigation';
import { profileService } from '../api/profileService';
import type { UserProfileData } from '../api/profileService';
import { EditProfileModal } from '../components/EditProfileModal';

const { Title } = Typography;

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const isOwnProfile = !userId;

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const data = userId
          ? await profileService.getUserProfile(userId)
          : await profileService.getProfile();
        setUser(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки';
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Navigation />

      <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'center' }}>
        <Card style={{ width: 600, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}><Spin size="large" /></div>
          ) : user ? (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Title level={3} style={{ margin: 0 }}>
                {user.name}
              </Title>

              <Descriptions bordered column={1} size="middle">
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Описание">{user.bio}</Descriptions.Item>
              </Descriptions>

              {isOwnProfile && (
                <Button type="default" onClick={() => setIsModalOpen(true)}>
                  Редактировать профиль
                </Button>
              )}

              {isOwnProfile && (
                <EditProfileModal
                  visible={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  initialValues={user}
                  onProfileUpdated={(updatedData) => setUser(updatedData)}
                />
              )}
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