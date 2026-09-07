import React from 'react';
import { Card, List, Typography, Badge } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { EventData } from '../api/eventService';

const { Title, Text } = Typography;

interface EventSidebarProps {
  events: EventData[];
}

export const EventSidebar: React.FC<EventSidebarProps> = ({ events }) => {
  const navigate = useNavigate();

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '0 16px 16px 16px', backgroundColor: '#fff', borderLeft: '1px solid #f0f0f0' }}>
      <Title level={4} style={{ margin: '16px 0' }}>События поблизости</Title>
      
      <List
        dataSource={events}
        renderItem={(event) => (
          <Card 
            hoverable 
            style={{ marginBottom: '12px', borderColor: '#f0f0f0' }}
            styles={{ body: { padding: '16px' } }}
            onClick={() => navigate(`/event/${event.id}`)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text strong style={{ fontSize: '16px' }}>{event.title}</Text>
              <Badge count={event.participants.length} color="#1677ff" title="Участники">
                <span style={{ paddingRight: '4px' }}><TeamOutlined style={{ color: '#8c8c8c' }} /></span>
              </Badge>
            </div>
            
            <div style={{ marginTop: '8px', color: '#8c8c8c', fontSize: '13px' }}>
              <div><CalendarOutlined /> {event.date}</div>
              <div style={{ marginTop: '4px' }}><EnvironmentOutlined /> {event.locationName}</div>
            </div>
          </Card>
        )}
      />
    </div>
  );
};
