import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { EventData } from '../api/eventService';
import L from 'leaflet';

const iconUrl = new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href;
const shadowUrl = new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href;

const DefaultIcon = L.icon({
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Иконка для новой временной точки (сделаем её зеленой/красной через фильтр, либо оставим дефолтной)
const NewLocationIcon = L.icon({
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'new-marker-icon' // Можно добавить стилей, но пока оставим базовой
});

const { Text } = Typography;

interface EventMapProps {
  events: EventData[];
  selectedCoords: [number, number] | null;
  onMapClick: (coords: [number, number]) => void;
  onCreateAtCoords: () => void;
}

// Внутренний мини-компонент для перехвата событий карты
const MapClickHandler: React.FC<{ onMapClick: (coords: [number, number]) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

export const EventMap: React.FC<EventMapProps> = ({ events, selectedCoords, onMapClick, onCreateAtCoords }) => {
  const navigate = useNavigate();
  const defaultPosition: [number, number] = [47.222480, 39.718577]; // Ростов

  return (
    <div style={{ height: 'calc(100vh - 48px)', width: '100%', position: 'relative' }}>
      <MapContainer center={defaultPosition} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Слушатель кликов */}
        <MapClickHandler onMapClick={onMapClick} />

        {/* Существующие маркеры */}
        {events.map((event) => (
          <Marker key={event.id} position={[event.latitude, event.longitude]}>
            <Popup>
              <div style={{ cursor: 'pointer'} } onClick={() => navigate(`/event/${event.id}`)}>
                <strong style={{ color: '#1677ff' }}>{event.title}</strong>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>{event.date}</Text>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Временный маркер в месте клика */}
        {selectedCoords && (
          <Marker position={selectedCoords} icon={NewLocationIcon}>
            {/* ИСПРАВЛЕНО: Убрали несуществующий параметр autoOpen */}
            <Popup>
              <div style={{ textAlign: 'center', padding: '4px' }}>
                <Text strong>Выбрано новое место</Text>
                <br />
                <Button 
                  type="primary" 
                  size="small" 
                  style={{ marginTop: '8px', fontSize: '12px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateAtCoords();
                  }}
                >
                  Создать ивент тут
                </Button>
              </div>
            </Popup>
          </Marker>
        )}

      </MapContainer>
    </div>
  );
};
