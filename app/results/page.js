'use client';
import { useRef, useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { STATES } from '../constants/states';

const MapView = dynamic(() => import('../../components/MapView'), { ssr: false });

/* -------------------------------------------------- */
/* 🛠️  HELPER-y                                       */
/* -------------------------------------------------- */

// odległość w km między dwoma punktami (haversine)
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;            // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// zamienia 'YYYY-MM-DD' → obiekt Date, inaczej null
function parseISO(dateStr) {
  const d = new Date(dateStr);
  return isNaN(d) ? null : d;
}

/* -------------------------------------------------- */
/* 📌  KOMPONENT                                      */
/* -------------------------------------------------- */

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResult, setSelected] = useState(null);

  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);

  const listRef = useRef(null);

  /* ---------- POBIERANIE DANYCH -------------------- */
  useEffect(() => {
    const stateId = localStorage.getItem('selectedStateId');
    const specialityKey = localStorage.getItem('selectedSpecialityKey');

    const lat = parseFloat(localStorage.getItem('userLatitude'));
    const lng = parseFloat(localStorage.getItem('userLongitude'));
    if (!isNaN(lat) && !isNaN(lng)) {
      setUserLat(lat); setUserLng(lng);
    }

    if (!stateId || !specialityKey) {
      setError('Brakuje danych. Wróć do początku.');
      setLoading(false);
      return;
    }

    const selectedState = STATES.find(s => s.id === stateId);
    const provinceCode = selectedState?.nfzId || '1';

    const url = `https://api.nfz.gov.pl/app-itl-api/queues?` +
      `page=1&limit=20&format=json&case=1&province=${provinceCode}` +
      `&benefit=${encodeURIComponent(specialityKey)}` +
      `&benefitForChildren=false&api-version=1.3`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Nie udało się pobrać danych z API.');
        return res.json();
      })
      .then(data => {
        const mapped = data.data.map(item => {
          const a = item.attributes;
          const distance = (lat && lng && a.latitude && a.longitude)
            ? haversineKm(lat, lng, a.latitude, a.longitude)
            : Infinity;

          return {
            provider: a.provider,
            place: a.place,
            address: a.address,
            locality: a.locality,
            phone: a.phone,
            latitude: a.latitude,
            longitude: a.longitude,
            date: a.dates?.date || 'Brak daty',
            distKm: distance
          };
        });
        setResults(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Wystąpił błąd podczas pobierania danych.');
        setLoading(false);
      });
  }, []);

  /* ---------- SORTOWANIE --------------------------- */
  const sortByDate = useCallback(() => {
    setResults(prev =>
      [...prev].sort((a, b) => {
        const da = parseISO(a.date) || Infinity;
        const db = parseISO(b.date) || Infinity;
        return da - db;                    // wcześniejszy termin pierwszy
      })
    );
  }, []);

  const sortByDistance = useCallback(() => {
    setResults(prev =>
      [...prev].sort((a, b) => a.distKm - b.distKm)
    );
  }, []);

  /* ---------- ZAZNACZENIE MARKERA ------------------ */
  const handleMarkerClick = (item) => {
    setSelected(item);
    setResults(prev => {
      const others = prev.filter(r => r !== item);
      return [item, ...others];
    });
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* -------------------------------------------------- */
  /* 🖼️  RENDER                                        */
  /* -------------------------------------------------- */
  return (
    <div className="fixed inset-0 z-0">
      {/* MAPA */}
      <MapView
        results={results}
        onMarkerClick={handleMarkerClick}
        selectedResult={selectedResult}
        userLocation={
          userLat != null && userLng != null
            ? { lat: userLat, lng: userLng }
            : null
        }
      />

      {/* PANEL LISTY */}
      <aside
        ref={listRef}
        className="absolute left-4 top-[88px] bottom-4 w-full max-w-[380px]
                   bg-white/90 backdrop-blur-md shadow-lg rounded-2xl
                   p-6 overflow-y-auto z-[999] border border-gray-200
                   scrollbar-none">

        {/* Nagłówek + sort */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-[#326a5d]">Wyniki wyszukiwania</h1>
          <div className="flex gap-2">
            <button
              onClick={sortByDistance}
              className="px-3 py-1.5 text-xs font-medium rounded-md
                         bg-white border border-gray-300 text-gray-600
                         transition transform hover:scale-110
                         hover:bg-[#326a5d] hover:text-white">
              Sortuj po odległości
            </button>
            <button
              onClick={sortByDate}
              className="px-3 py-1.5 text-xs font-medium rounded-md
                         bg-white border border-gray-300 text-gray-600
                         transition transform hover:scale-110
                         hover:bg-[#326a5d] hover:text-white">
              Sortuj po dacie
            </button>
          </div>
        </div>

        {loading && <p className="text-gray-600">Ładowanie danych...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && results.length === 0 && (
          <p className="text-gray-600">Brak wyników.</p>
        )}

        <div className="space-y-4">
          {results.map((item, i) => (
            <div
              key={i}
              onClick={() => handleMarkerClick(item)}
              className={`p-4 rounded-lg border cursor-pointer transition text-sm shadow-sm
                          transform hover:scale-[1.07]
                          ${selectedResult === item
                  ? 'bg-blue-50 border-gray-600'
                  : 'bg-white hover:bg-blue-50 border-gray-200'}
                        `}
            >
              <p className="text-[#326a5d] font-semibold">{item.provider}</p>
              <p className="text-gray-700">{item.place}</p>
              <p className="text-gray-600">
                {item.address}, {item.locality}
              </p>
              <p className="text-gray-600">
                📞 {item.phone || 'Brak danych'}
              </p>
              <p className="text-sm mt-1">
                <strong>Termin:</strong> {item.date}
              </p>
              {item.distKm !== Infinity && (
                <p className="text-xs text-gray-500">
                  ~{item.distKm.toFixed(1)} km
                </p>
              )}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
