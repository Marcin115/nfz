'use client';

import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


// naprawa domyślnych ikon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png'
});

function getDaysUntil(dateStr) {
  const today = new Date();
  const target = new Date(dateStr);
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return isNaN(diffDays) ? null : diffDays;
}


export default function MapView({ results, userLocation }) {
  // obliczamy center i zoom w zależności od dostępności lokalizacji
  const { center, zoom } = useMemo(() => {
    if (
      userLocation &&
      typeof userLocation.lat === 'number' &&
      typeof userLocation.lng === 'number'
    ) {
      console.log("user location: " + userLocation);
      return { center: [userLocation.lat, userLocation.lng], zoom: 16 };

    }
    console.log("user location not loaded");
    return { center: [51.9, 19.1], zoom: 8 };
  }, [userLocation]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Twój znacznik lokalizacji */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>Twoja lokalizacja</Popup>
        </Marker>
      )}

      {/* Markery wyników z API */}
      {results
        .filter(item => item.latitude && item.longitude)
        .map((item, idx) => (
          <Marker key={idx} position={[item.latitude, item.longitude]}>
            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
              {
                getDaysUntil(item.date) !== null
                  ? `Za ${getDaysUntil(item.date)} dni`
                  : 'Brak daty'
              }
            </Tooltip>
            <Popup>
              <strong>{item.provider}</strong><br />
              {item.place}<br />
              {item.address}, {item.locality}<br />
              Termin: {item.date}<br />
              {
                getDaysUntil(item.date) !== null
                  ? `W realizacji za ${getDaysUntil(item.date)} dni`
                  : 'Brak informacji o terminie'
              }
            </Popup>
          </Marker>

        ))}
    </MapContainer>
  );
}
