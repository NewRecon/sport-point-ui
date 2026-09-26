import React from 'react';
import { Card, List, Typography, Badge, Button, Empty } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, TeamOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { EventData } from '../api/eventService';

const { Title, Text } = Typography;

interface EventSidebarProps {
  events: EventData[];
  onCreateClick: () => void; // Добавили проп для открытия модалки
}

export const EventSidebar: React.FC<EventSidebarProps> = ({ events, onCreateClick }) => {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%' }}>
      {/* Шапка виджета с кнопкой создания */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={5} style={{ margin: 0 }}>События поблизости</Title>
        <Button 
          type="primary" 
          shape="circle" 
          icon={<PlusOutlined />} 
          onClick={onCreateClick}
          title="Создать новое событие"
        />
      </div>
      
      <List
        dataSource={events}
        /* ИСПРАВЛЕНО: Меняем стандартный No Data на понятный текст и кнопку */
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="В вашем городе пока нет событий"
            >
              <Button type="link" onClick={onCreateClick}>Создать первое событие</Button>
            </Empty>
          )
        }}
        renderItem={(event) => (
          <Card 
            hoverable 
            style={{ marginBottom: '10px', borderColor: '#f0f0f0' }}
            styles={{ body: { padding: '12px' } }}
            onClick={() => navigate(`/event/${event.id}`)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
              <Text strong style={{ fontSize: '15px' }}>{event.title}</Text>
              <Badge count={event.participants?.length || 0} color="#1677ff">
                <span style={{ paddingRight: '4px' }}><TeamOutlined style={{ color: '#8c8c8c' }} /></span>
              </Badge>
            </div>
            
            <div style={{ marginTop: '6px', color: '#8c8c8c', fontSize: '12px' }}>
              <div><CalendarOutlined /> {event.date}</div>
              <div style={{ marginTop: '2px' }}><EnvironmentOutlined /> {event.locationName}</div>
            </div>
          </Card>
        )}
      />
    </div>
  );
};
