import React, { useEffect, useState } from 'react';
import { Spin, Flex, Grid, Button, Drawer } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { EventMap } from '../components/EventMap';
import { EventSidebar } from '../components/EventSidebar';
import { CreateEventModal } from '../components/CreateEventModal';
import { useMapEventsData } from '../hooks/useMapEventsData';

const MapPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get('category');
  const initialDateFrom = searchParams.get('dateFrom');
  const initialDateTo = searchParams.get('dateTo');
  const initialOnlyAvailable = searchParams.get('onlyAvailable') === '1';

  const {
    loading,
    events,
    isModalOpen,
    selectedCoords,
    selectedCategory,
    dateRange,
    onlyAvailable,
    address,
    loadingAddress,
    setIsModalOpen,
    setSelectedCoords,
    setSelectedCategory,
    setDateRange,
    setOnlyAvailable,
    setAddress,
    handleCreateSubmit,
    openModalWithCoords,
    clearSelectedCoords,
  } = useMapEventsData({
    category: initialCategory,
    dateFrom: initialDateFrom,
    dateTo: initialDateTo,
    onlyAvailable: initialOnlyAvailable,
  });

  const screens = Grid.useBreakpoint();
  const isDesktop = screens.md;
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory) params.set('category', selectedCategory);

    if (dateRange?.[0]) params.set('dateFrom', dateRange[0].format('YYYY-MM-DD'));
    if (dateRange?.[1]) params.set('dateTo', dateRange[1].format('YYYY-MM-DD'));

    if (onlyAvailable) params.set('onlyAvailable', '1');

    setSearchParams(params, { replace: true });
  }, [selectedCategory, dateRange, onlyAvailable, setSearchParams]);

  const sidebarContent = (
    <EventSidebar
      events={events}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      onlyAvailable={onlyAvailable}
      onOnlyAvailableChange={setOnlyAvailable}
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
              onCreateAtCoords={openModalWithCoords}
              onClearSelected={clearSelectedCoords}
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

      <CreateEventModal
        open={isModalOpen}
        initialAddress={loadingAddress ? "Определяем адрес..." : address}
        onCancel={() => {
          setIsModalOpen(false);
          setAddress('');
        }}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
};

export default MapPage;