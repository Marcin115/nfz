'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png'
});

export default function MapView({ results }) {
  const firstWithCoords = results.find(r => r.latitude && r.longitude);
  const center = firstWithCoords ? [firstWithCoords.latitude, firstWithCoords.longitude] : [52, 19];

  return (
    <MapContainer
      center={center}
      zoom={7}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {results
        .filter(item => item.latitude && item.longitude)
        .map((item, index) => (
          <Marker key={index} position={[item.latitude, item.longitude]}>
            <Popup>
              <strong>{item.provider}</strong><br />
              {item.place}<br />
              {item.address}, {item.locality}<br />
              Termin: {item.date}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}