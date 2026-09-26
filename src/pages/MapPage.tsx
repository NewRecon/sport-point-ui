import React from 'react';
import { Spin } from 'antd';
import { Navigation } from '../components/Navigation';
import { EventMap } from '../components/EventMap';
import { EventSidebar } from '../components/EventSidebar';
import { CreateEventModal } from '../components/CreateEventModal';
import { useMapEventsData } from '../hooks/useMapEventsData';

const MapPage: React.FC = () => {
  const {
    loading,
    events,
    isModalOpen,
    selectedCoords,
    setIsModalOpen,
    setSelectedCoords,
    handleCreateSubmit,
    openModalWithDefaultCoords,
  } = useMapEventsData();

  return (
    /* ИСПРАВЛЕНО: Заменили 100vw на 100%, чтобы страница строго вписывалась в рамки экрана */
    <div style={{ height: '100vh', width: '100%', backgroundColor: '#f0f2f5', position: 'relative', overflow: 'hidden' }}>
      <Navigation />

      {loading && events.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 48px)' }}><Spin size="large" /></div>
      ) : (
        /* ИСПРАВЛЕНО: Здесь для контейнера карты тоже зафиксировали width: '100%' */
        <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 48px)', overflow: 'hidden' }}>
          
          <EventMap 
            events={events} 
            selectedCoords={selectedCoords}
            onMapClick={(coords) => setSelectedCoords(coords)}
            onCreateAtCoords={() => setIsModalOpen(true)}
          />

          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            /* ИСПРАВЛЕНО: Используем maxWidth вместо жесткого width, чтобы на маленьких экранах блок не ломал верстку */
            width: '360px', 
            maxHeight: 'calc(100vh - 110px)', 
            overflowY: 'auto', 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)', 
            padding: '16px'
          }}>
            <EventSidebar events={events} onCreateClick={openModalWithDefaultCoords} />
          </div>

        </div>
      )}

      <CreateEventModal open={isModalOpen} onCancel={() => setIsModalOpen(false)} onSubmit={handleCreateSubmit} />
    </div>
  );
};

export default MapPage;
