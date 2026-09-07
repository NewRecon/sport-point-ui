import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, message } from 'antd';
import { Navigation } from '../components/Navigation';
import { EventMap } from '../components/EventMap';
import { EventSidebar } from '../components/EventSidebar';
import { eventService } from '../api/eventService';
import type { EventData } from '../api/eventService';

const MapPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getAllEvents();
        setEvents(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки карты';
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', display: 'flex', flexDirection: 'column' }}>
      <Navigation />

      {loading ? (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Spin size="large" /></div>
      ) : (
        <Row style={{ flex: 1, height: 'calc(100vh - 70px)', overflow: 'hidden' }}>
          {/* Левые 65% экрана под карту */}
          <Col xs={24} md={16} style={{ height: '100%' }}>
            <EventMap events={events} />
          </Col>

          {/* Правые 35% экрана под список карточек */}
          <Col xs={24} md={8} style={{ height: '100%' }}>
            <EventSidebar events={events} />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default MapPage;
