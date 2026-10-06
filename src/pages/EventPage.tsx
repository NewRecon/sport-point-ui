import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Typography, Spin, message, Divider, Space, Tag, Button, List } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Navigation } from '../components/Navigation';
import { eventService } from '../api/eventService';
import type { EventData } from '../api/eventService';
import { subscriptionService, type SubscriptionData } from '../api/subscriptionService';
import { getCurrentUser } from '../utils/auth';

const { Title, Paragraph } = Typography;

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [event, setEvent] = useState<EventData | null>(null);

  const currentUser = getCurrentUser();
  const currentUserId = currentUser?.USER_ID ?? null;

  const isSubscribed = !!event?.eventSubscriptions?.some(
    (sub) => sub.userId === currentUserId
  );

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const data = await eventService.getEventById(id);
        setEvent(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки';
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const onSubscribeSubmit = async (subscriptionData: SubscriptionData) => {
    try {
      await subscriptionService.subscribe(subscriptionData);
      message.success('Вы записались на событие!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось записаться';
      message.error(errorMessage);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Navigation />

      <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'center' }}>
        <Card style={{ width: 700, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}><Spin size="large" /></div>
          ) : event ? (
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>

              <Title level={2} style={{ margin: 0 }}>{event.title}</Title>

              <div style={{ fontSize: '15px' }}>
                <UserOutlined style={{ color: '#8c8c8c', marginRight: '6px' }} />
                <span style={{ color: '#8c8c8c' }}>Организатор: </span>
                <Link to={`/profile/${event.ownerId}`} style={{ color: '#1677ff' }}>
                  {event.ownerName}
                </Link>
              </div>

              <Space size="large" style={{ color: '#8c8c8c' }}>
                <span><CalendarOutlined /> {dayjs(event.date).format('DD.MM.YYYY HH:mm')}</span>
                <span><EnvironmentOutlined /> {event.locationName}</span>
              </Space>

              <Paragraph style={{ fontSize: '16px', marginTop: '12px' }}>
                {event.description}
              </Paragraph>

              <Divider style={{ margin: '12px 0' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Title level={4} style={{ margin: 0 }}>Участники</Title>
                <Tag color="blue">
                  {event.eventSubscriptions?.length || 0} / {event.totalParticipants}
                </Tag>
              </div>

              {event.eventSubscriptions && event.eventSubscriptions.length > 0 ? (
                <List
                  size="small"
                  dataSource={event.eventSubscriptions}
                  renderItem={(sub) => {
                    const isMe = sub.userId === currentUserId;

                    return (
                      <List.Item style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                        {isMe ? (
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              color: '#52c41a',
                              fontSize: '15px',
                              fontWeight: 500,
                            }}
                          >
                            <UserOutlined />
                            {sub.username}
                            <Tag color="green" style={{ marginLeft: '4px' }}>вы</Tag>
                          </span>
                        ) : (
                          <Link
                            to={`/profile/${sub.userId}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              color: '#1677ff',
                              fontSize: '15px',
                            }}
                          >
                            <UserOutlined />
                            {sub.username}
                          </Link>
                        )}
                      </List.Item>
                    );
                  }}
                />
              ) : (
                <Paragraph type="secondary" style={{ margin: 0 }}>
                  Пока никто не записался
                </Paragraph>
              )}

              <Button
                type="primary"
                block
                disabled={isSubscribed}
                style={{ marginTop: '16px' }}
                onClick={() => onSubscribeSubmit({ eventId: event.id })}
              >
                {isSubscribed ? 'Вы уже записаны на событие' : 'Записаться на событие'}
              </Button>

            </Space>
          ) : (
            <div style={{ textAlign: 'center' }}>Ивент не найден</div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EventPage;