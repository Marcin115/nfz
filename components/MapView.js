'use client';
import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { icon } from 'leaflet'
import 'leaflet/dist/leaflet.css';

/* ----------  DOMYŚLNE IKONY  ---------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

/* ----------  POMOCNICZE  ---------- */
/* zwraca liczbę dni (może być ≤ 0) */
function getDaysUntil(dateStr) {
  const today = new Date();
  const target = new Date(dateStr);
  if (isNaN(target)) return null;

  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));  // liczba
}

/* kolor markera na podstawie liczby dni */
function colorByDays(diffDays) {
  if (diffDays == null || diffDays <= 0) return '#4dff2e'; // zielony – „Dostępny”
  if (diffDays <= 30) return '#4dff2e';                   // zielony
  if (diffDays <= 90) return '#ffa726';                   // pomarańczowy
  return '#ef5350';                                       // czerwony
}

/* ⬇ gdy wyświetlasz tekst w Tooltipie użyj: */
function formatDaysText(diffDays) {
  if (diffDays == null) return 'Brak daty';
  return diffDays <= 0 ? 'Dostępny' : `${diffDays} dni`;
}


function getMarkerIcon(diffDays) {
  const innerColor = colorByDays(diffDays ?? 9999);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
      <path fill="${innerColor}" stroke="black" stroke-width="1"
            stroke-linecap="round" stroke-linejoin="round"
            d="M12 20.5c0 0 -6 -7 -6 -11.5c0-3.31 2.69-6 6-6s6 2.69 6 6
               c0 4.5-6 11.5-6 11.5Z"/>
      <circle cx="12" cy="9" r="3.5" fill="#fff" stroke="black" stroke-width="0.8"/>
    </svg>`;
  return L.divIcon({
    className: '',
    html: svg,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    tooltipAnchor: [0, -32],
  });
}

/* ----------  KONTROLER MAPY  ---------- */
function MapController({ selectedResult }) {
  const map = useMap();

  useEffect(() => {
    // pojedynczy zoom control w prawym dolnym
    if (!map.zoomControl) return;
    map.zoomControl.setPosition('bottomright');
  }, [map]);

  useEffect(() => {
    if (selectedResult?.latitude && selectedResult?.longitude) {
      map.setView([selectedResult.latitude, selectedResult.longitude], 14, { animate: true });
    }
  }, [selectedResult, map]);

  return null;
}

/* ----------  LEGENDA  ---------- */
const Legend = () => (
  <div className="absolute top-20 right-2 z-[1000] rounded-lg bg-white/90 shadow p-3 text-xs space-y-2">
    {[
      { color: '#4dff2e', label: 'do 30 dni' },
      { color: '#ffa726', label: '31–90 dni' },
      { color: '#ef5350', label: 'więcej niż 90 dni' },
    ].map(({ color, label }) => (
      <div key={label} className="flex items-center gap-2">
        <span dangerouslySetInnerHTML={{
          __html: `
            <svg width="18" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20.5c0 0 -6 -7 -6 -11.5c0-3.31 2.69-6 6-6s6 2.69 6 6
                       c0 4.5-6 11.5-6 11.5Z"
                    fill="${color}" stroke="black" stroke-width="1" />
              <circle cx="12" cy="9" r="3.5" fill="#fff" stroke="black" stroke-width="0.8" />
            </svg>
          `
        }} />
        <span>{label}</span>
      </div>
    ))}

    {/* Znacznik lokalizacji użytkownika */}
    <div className="flex items-center gap-2">
      <svg
        width="18"
        height="24"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="#3388ff"
        stroke="#1d4ed8"
        strokeWidth="1"
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" />
        <circle cx="12" cy="9" r="3" fill="white" />
      </svg>
      <span>Twoja lokalizacja</span>
    </div>
  </div>
);



/* ----------  GŁÓWNY KOMPONENT  ---------- */
export default function MapView({ results, userLocation, onMarkerClick, selectedResult }) {
  if (typeof window === 'undefined') return null;

  const { center, zoom } = useMemo(() => {
    if (userLocation?.lat && userLocation?.lng) {
      return { center: [userLocation.lat, userLocation.lng], zoom: 11 };
    }
    return { center: [51.9, 19.1], zoom: 12 };
  }, [userLocation]);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        zoomControl   // domyślny kontroler
        style={{ height: '100%', width: '100%' }}
      >
        <MapController selectedResult={selectedResult} />
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* lokalizacja użytkownika */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup><span className="font-bold">Twoja lokalizacja</span></Popup>

          </Marker>
        )}

        {/* wyniki API */}
        {results
          .filter(r => r.latitude && r.longitude)
          .map((item, idx) => {
            const days = getDaysUntil(item.date);
            return (
              <Marker
                key={idx}
                position={[item.latitude, item.longitude]}
                icon={getMarkerIcon(days)}
                eventHandlers={{ click: () => onMarkerClick(item) }}
              >
                <Tooltip
                  direction="top"
                  offset={[0, 0]}
                  opacity={1}
                  permanent
                  className="custom-tooltip"
                >
                  {formatDaysText(days)}

                </Tooltip>

              </Marker>
            );
          })}
      </MapContainer>

      {/* legenda w prawym-górnym rogu */}
      <Legend />
    </div>
  );
}
