'use client';

import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// naprawa domyślnych ikon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png'
});

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
            <Popup>
              <strong>{item.provider}</strong>
              <br />
              {item.place}
              <br />
              {item.address}, {item.locality}
              <br />
              Termin: {item.date}
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
