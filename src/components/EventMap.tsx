import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { EventData } from '../api/eventService';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const { Text } = Typography;

interface EventMapProps {
  events: EventData[];
}

export const EventMap: React.FC<EventMapProps> = ({ events }) => {
  const navigate = useNavigate();

  return (
    <MapContainer 
      center={[55.7558, 37.6173]} 
      zoom={10} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {events.map((event) => (
        <Marker key={event.id} position={[event.lat, event.lng]}>
          <Popup>
            <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/event/${event.id}`)}>
              <strong style={{ color: '#1677ff' }}>{event.title}</strong>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>{event.date}</Text>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
