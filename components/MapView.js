'use client';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


// naprawa domyślnych ikon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png'
});

function MapController({ selectedResult }) {
  const map = useMap();

  useEffect(() => {
    if (selectedResult?.latitude && selectedResult?.longitude) {
      map.setView([selectedResult.latitude, selectedResult.longitude], 14, { animate: true });
    }
  }, [selectedResult, map]);

  return null;
}

function getDaysUntil(dateStr) {
  const today = new Date();
  const target = new Date(dateStr);
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return isNaN(diffDays) ? null : diffDays;
}


export default function MapView({ results, userLocation, onMarkerClick, selectedResult }) {
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
      <MapController selectedResult={selectedResult} />
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
          <Marker 
            key={idx} 
            position={[item.latitude, item.longitude]}
            eventHandlers={{
              click: () => onMarkerClick(item) // notify parent
            }}>
            {typeof window !== 'undefined' && (
        <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
          {
            getDaysUntil(item.date) !== null
              ? `Za ${getDaysUntil(item.date)} dni`
              : 'Brak daty'
          }
        </Tooltip>)}
          </Marker>

        ))}
    </MapContainer>
  );
}