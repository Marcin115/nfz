'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function ResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="fixed inset-0 z-0">
      {/* Map fills screen */}
      <MapView
        results={results}
        userLocation={(userLat != null && userLng != null)
          ? { lat: userLat, lng: userLng }
          : null
        }
      />
      {/* Floating list panel */}
      <aside className="absolute top-4 left-4 bottom-4 w-[350px] bg-white shadow-lg rounded-xl p-4 overflow-y-auto z-[999]">
        <h1 className="text-xl font-bold mb-4">Wyniki wyszukiwania</h1>

        {loading && <p>Ładowanie danych...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && results.length === 0 && <p>Brak wyników.</p>}

        <div className="space-y-4">
          {results.map((item, index) => (
            <div key={index} className="p-4 border rounded shadow text-sm bg-gray-50">
              <p><strong>Placówka:</strong> {item.provider}</p>
              <p><strong>Oddział:</strong> {item.place}</p>
              <p><strong>Adres:</strong> {item.address}, {item.locality}</p>
              <p><strong>Telefon:</strong> {item.phone || 'Brak danych'}</p>
              <p><strong>Termin:</strong> {item.date}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}