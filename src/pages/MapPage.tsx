import React, { useState } from 'react';
import { Spin, Flex, Grid, Button, Drawer } from 'antd'; // Добавили Button и Drawer
import { UnorderedListOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { Navigation } from '../components/Navigation';
import { EventMap } from '../components/EventMap';
import { EventSidebar } from '../components/EventSidebar';
import { CreateEventModal } from '../components/CreateEventModal';
import type { CreateEventFormValues } from '../components/CreateEventModal';
import type { EventData } from '../api/eventService';
import { useMapEventsData } from '../hooks/useMapEventsData';

type DateRangeType = [Dayjs | null, Dayjs | null];

interface MapEventsDataResult {
  loading: boolean;
  events: EventData[];
  isModalOpen: boolean;
  selectedCoords: [number, number] | null;
  selectedCategory: string | null;
  dateRange: DateRangeType | null;
  setIsModalOpen: (open: boolean) => void;
  setSelectedCoords: (coords: [number, number] | null) => void;
  setSelectedCategory: (category: string | null) => void;
  setDateRange: (dates: DateRangeType | null) => void;
  handleCreateSubmit: (values: CreateEventFormValues) => Promise<void>;
  openModalWithDefaultCoords: () => void;
}

const MapPage: React.FC = () => {
  const {
    loading,
    events,
    isModalOpen,
    selectedCoords,
    selectedCategory,
    dateRange,
    setIsModalOpen,
    setSelectedCoords,
    setSelectedCategory,
    setDateRange,
    handleCreateSubmit,
    openModalWithDefaultCoords,
  } = useMapEventsData() as MapEventsDataResult;

  const screens = Grid.useBreakpoint();
  const isDesktop = screens.md;

  // Состояние для открытия шторки на мобилках
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Вынесем сайдбар в отдельную переменную, чтобы не дублировать код для десктопа и мобилки
  const sidebarContent = (
    <EventSidebar 
      events={events} 
      onCreateClick={openModalWithDefaultCoords}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
    />
  );

  return (
    <div style={{ height: '100vh', width: '100%', backgroundColor: '#f0f2f5', overflow: 'hidden', position: 'relative' }}>
      <Navigation />

      {loading && events.length === 0 ? (
        <Flex justify="center" align="center" style={{ height: 'calc(100vh - 48px)' }}>
          <Spin size="large" />
        </Flex>
      ) : (
        <div style={{ height: 'calc(100vh - 48px)', width: '100%', position: 'relative' }}>

          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <EventMap 
              events={events} 
              selectedCoords={selectedCoords} 
              onMapClick={(coords) => setSelectedCoords(coords)} 
              onCreateAtCoords={() => setIsModalOpen(true)} 
            />
          </div>

          {isDesktop && (
            <div style={{ 
              position: 'absolute',
              top: '20px',
              right: '20px',
              zIndex: 1000,
              width: '360px',
              maxHeight: 'calc(100vh - 90px)',
              overflowY: 'auto',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
              padding: '16px'
            }}>
              {sidebarContent}
            </div>
          )}

          {!isDesktop && (
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              width: 'calc(100vw - 40px)',
            }}>
              <Button 
                type="primary" 
                size="large" 
                icon={<UnorderedListOutlined />}
                onClick={() => setIsDrawerOpen(true)}
                style={{ width: '100%', height: '48px', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
              >
                Список событий и фильтры ({events.length})
              </Button>
            </div>
          )}

          <Drawer
            title="События и фильтры"
            placement="bottom"
            onClose={() => setIsDrawerOpen(false)}
            open={isDrawerOpen && !isDesktop}
            height="75vh"
            styles={{ body: { padding: '16px 16px 40px 16px' } }}
          >
            {sidebarContent}
          </Drawer>

        </div>
      )}

      <CreateEventModal open={isModalOpen} onCancel={() => setIsModalOpen(false)} onSubmit={handleCreateSubmit} />
    </div>
  );
};

export default MapPage;
