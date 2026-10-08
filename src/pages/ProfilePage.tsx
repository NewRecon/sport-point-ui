import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Card, Descriptions, Button, Space, Typography, message,
  Spin, List, Tabs, Tag, Empty,
} from 'antd';
import { CrownOutlined, TeamOutlined } from '@ant-design/icons';
import { Navigation } from '../components/Navigation';
import { profileService } from '../api/profileService';
import type { UserProfileData, ProfileEventItem } from '../api/profileService';
import { EditProfileModal } from '../components/EditProfileModal';
import { ProfileAvatar } from '../components/ProfileAvatar';

const { Title } = Typography;

const EventList: React.FC<{
  items: ProfileEventItem[];
  icon: React.ReactNode;
  color: string;
  emptyText: string;
}> = ({ items, icon, color, emptyText }) => {
  if (items.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={emptyText}
        style={{ padding: '24px 0' }}
      />
    );
  }

  return (
    <List
      size="small"
      dataSource={items}
      renderItem={(item) => (
        <List.Item style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
          <Link
            to={`/event/${item.eventId}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color,
              fontSize: '15px',
            }}
          >
            {icon}
            {item.eventTitle}
          </Link>
        </List.Item>
      )}
    />
  );
};

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        message.error(error instanceof Error ? error.message : 'Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [userId]);

  const ownerEvents = user?.profileEventsOwner ?? [];
  const participantEvents = user?.profileEventsNotOwner ?? [];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Navigation />

      <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 700, maxWidth: '100%' }}>
          {loading ? (
            <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
              </div>
            </Card>
          ) : user ? (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* === Карточка профиля === */}
              <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <ProfileAvatar
                    objectName={user.avatarObjectName}
                    editable={isOwnProfile}
                    onUploaded={(newName) =>
                      setUser((prev) =>
                        prev ? { ...prev, avatarObjectName: newName } : prev
                      )
                    }
                    size={120}
                  />

                  <Title level={3} style={{ margin: 0, textAlign: 'center' }}>
                    {user.name}
                  </Title>

                  <Descriptions bordered column={1} size="middle">
                    <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                    <Descriptions.Item label="Описание">{user.bio || '—'}</Descriptions.Item>
                  </Descriptions>

                  {isOwnProfile && (
                    <Button onClick={() => setIsModalOpen(true)}>
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
              </Card>

              {/* === Карточка событий с табами === */}
              <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Tabs
                  defaultActiveKey="owner"
                  items={[
                    {
                      key: 'owner',
                      label: (
                        <Space>
                          <CrownOutlined />
                          Созданные события
                          <Tag color="gold">{ownerEvents.length}</Tag>
                        </Space>
                      ),
                      children: (
                        <EventList
                          items={ownerEvents}
                          icon={<CrownOutlined />}
                          color="#faad14"
                          emptyText="Пользователь ещё не создавал события"
                        />
                      ),
                    },
                    {
                      key: 'participant',
                      label: (
                        <Space>
                          <TeamOutlined />
                          Участие в событиях
                          <Tag color="blue">{participantEvents.length}</Tag>
                        </Space>
                      ),
                      children: (
                        <EventList
                          items={participantEvents}
                          icon={<TeamOutlined />}
                          color="#1677ff"
                          emptyText="Пользователь пока не участвует в событиях"
                        />
                      ),
                    },
                  ]}
                />
              </Card>
            </Space>
          ) : (
            <Card style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                Не удалось загрузить данные профиля
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;