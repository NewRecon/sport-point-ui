import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Spin, message, Divider, Space, Tag, Button } from 'antd';
import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import dayjs from 'dayjs'; // Для безопасного форматирования даты бэка
import { Navigation } from '../components/Navigation';
import { eventService } from '../api/eventService';
import type { EventData } from '../api/eventService';
import { subscriptionService, type SubscriptionData } from '../api/subscriptionService';

const { Title, Paragraph } = Typography;

const EventPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [event, setEvent] = useState<EventData | null>(null);

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
                {/* Защита от undefined: берем длину массива participants, если он пришел */}
                <Tag color="blue">{event.currentParticipants || 0} / {event.totalParticipants}</Tag>
              </div>

              <Button type="primary" block style={{ marginTop: '16px' }} onClick={()=>onSubscribeSubmit({ eventId: event.id })}>
                Записаться на событие
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
