import React from 'react';
import { Card, List, Typography, Badge, Empty, Flex, Grid, Tag } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { EventData } from '../api/eventService';
import { EventFilters } from './EventFilters';

const { Title, Text } = Typography;

type DateRangeType = [Dayjs | null, Dayjs | null];

interface EventSidebarProps {
  events: EventData[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  dateRange: DateRangeType | null;
  onDateRangeChange: (dates: DateRangeType | null) => void;
  onlyAvailable: boolean;
  onOnlyAvailableChange: (value: boolean) => void;
}

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'EXERCISE': return { text: 'Тренировка', color: 'blue' };
    case 'COMPETITION': return { text: 'Соревнование', color: 'volcano' };
    case 'GAME': return { text: 'Игра', color: 'green' };
    case 'MARATHON': return { text: 'Марафон', color: 'gold' };
    case 'FESTIVAL': return { text: 'Фестиваль', color: 'purple' };
    default: return { text: category, color: 'default' };
  }
};

export const EventSidebar: React.FC<EventSidebarProps> = ({
  events,
  selectedCategory,
  onCategoryChange,
  dateRange,
  onDateRangeChange,
  onlyAvailable,
  onOnlyAvailableChange,
}) => {
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const isDesktop = screens.md;

  return (
    <div style={{ width: '100%' }}>
      <Flex
        vertical={!isDesktop}
        gap={isDesktop ? '0' : '12px'}
        style={{ marginBottom: '16px' }}
      >
        <Flex justify="space-between" align="center" style={{ width: '100%' }}>
          <Title level={5} style={{ margin: 0 }}>События поблизости</Title>
        </Flex>

        <Flex
          align="center"
          gap="8px"
          justify={isDesktop ? 'end' : 'stretch'}
          style={{ width: isDesktop ? 'auto' : '100%' }}
        >
          <div style={{ width: isDesktop ? 'auto' : '100%' }}>
            <EventFilters
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
              dateRange={dateRange}
              onDateRangeChange={onDateRangeChange}
              onlyAvailable={onlyAvailable}
              onOnlyAvailableChange={onOnlyAvailableChange}
            />
          </div>
        </Flex>
      </Flex>

      <List
        dataSource={events}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="В вашем городе пока нет событий"
            />
          ),
        }}
        renderItem={(event) => {
          const categoryMeta = getCategoryLabel(event.category);

          return (
            <Card
              hoverable
              style={{ marginBottom: '10px', borderColor: '#f0f0f0' }}
              styles={{ body: { padding: '12px' } }}
              onClick={() => navigate(`/event/${event.id}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <Text strong style={{ fontSize: '15px' }}>{event.title}</Text>
                <Badge count={event.totalParticipants || 0} color="#1677ff">
                  <span style={{ paddingRight: '4px' }}><TeamOutlined style={{ color: '#8c8c8c' }} /></span>
                </Badge>
              </div>

              <div style={{ marginTop: '6px', color: '#8c8c8c', fontSize: '12px' }}>
                <span><CalendarOutlined /> {dayjs(event.date).format('DD.MM.YYYY HH:mm')}</span>
                <div style={{ marginTop: '2px' }}><EnvironmentOutlined /> {event.locationName}</div>
              </div>

              <div style={{ marginTop: '8px' }}>
                <Tag color={categoryMeta.color} style={{ fontSize: '11px', borderRadius: '4px' }}>
                  {categoryMeta.text}
                </Tag>
              </div>
            </Card>
          );
        }}
      />
    </div>
  );
};