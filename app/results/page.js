'use client';
import { useRef } from 'react';


import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });


export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);
  const listRef = useRef(null);
  //lokalizacja uzytkownika
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);

  useEffect(() => {
    const stateId = localStorage.getItem('selectedStateId');
    const specialityKey = localStorage.getItem('selectedSpecialityKey');

    //lokalizacja uzytkownika
    const lat = parseFloat(localStorage.getItem('userLatitude'));
    const lng = parseFloat(localStorage.getItem('userLongitude'));

    if (lat && lng) {
      setUserLat(lat);
      setUserLng(lng);
    }

    if (!stateId || !specialityKey) {
      setError('Brakuje danych. Wróć do początku.');
      setLoading(false);
      return;
    }

    const url = `https://api.nfz.gov.pl/app-itl-api/queues?page=1&limit=20&format=json&case=1&province=${stateId}&benefit=${encodeURIComponent(
      specialityKey
    )}&benefitForChildren=false&api-version=1.3`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Nie udało się pobrać danych z API.');
        return res.json();
      })
      .then((data) => {
        const filtered = data.data.map((item) => {
          const attr = item.attributes;
          return {
            provider: attr.provider,
            place: attr.place,
            address: attr.address,
            locality: attr.locality,
            phone: attr.phone,
            latitude: attr.latitude,
            longitude: attr.longitude,
            date: attr.dates?.date || 'Brak daty'
          };
        });
        setResults(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Wystąpił błąd podczas pobierania danych.');
        setLoading(false);
      });
  }, []);

  const handleMarkerClick = (item) => {
  setSelectedResult(item);
  setResults((prev) => {
    const filtered = prev.filter((r) => r !== item);
    return [item, ...filtered];
  });
  if (listRef.current) {
    listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }
  };


  return (
    <div className="fixed inset-0 z-0">
      {/* Map fills screen */}
      <MapView
        results={results}
        onMarkerClick={handleMarkerClick}
        selectedResult={selectedResult}
        userLocation={(userLat != null && userLng != null)
          ? { lat: userLat, lng: userLng }
          : null
        }
      />
      {/* Floating list panel */}
      <aside
        ref={listRef}
       className="absolute left-4 top-[88px] bottom-4 w-[360px] bg-transparent shadow-xl rounded-xl p-5 overflow-y-auto z-[999] border border-gray-300">
  <h1 className="text-xl font-bold text-[#326a5d] mb-5">Wyniki wyszukiwania</h1>

  {loading && <p className="text-gray-600">Ładowanie danych...</p>}
  {error && <p className="text-red-600">{error}</p>}
  {!loading && !error && results.length === 0 && (
    <p className="text-gray-600">Brak wyników.</p>
  )}

  <div className="space-y-4">
    {results.map((item, index) => (
      <div
        key={index}
        onClick={() => handleMarkerClick(item)}
        className={`p-4 rounded-lg border cursor-pointer transition text-sm shadow-sm ${
          selectedResult === item
            ? 'bg-blue-50 border-blue-400'
            : 'bg-white hover:bg-gray-50 border-gray-200'
        }`}
      >
        <p className="text-[#326a5d] font-semibold">{item.provider}</p>
        <p className="text-gray-700">{item.place}</p>
        <p className="text-gray-600">{item.address}, {item.locality}</p>
        <p className="text-gray-600">📞 {item.phone || 'Brak danych'}</p>
        <p className="text-sm mt-1">
          <strong>Termin:</strong> {item.date}
        </p>
      </div>
    ))}
  </div>
</aside>
    </div>
  );
}