'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const STATES = [
  { id: '01', name: 'Dolnośląskie' },
  { id: '02', name: 'Kujawsko-Pomorskie' },
  { id: '03', name: 'Lubelskie' },
  { id: '04', name: 'Lubuskie' },
  { id: '05', name: 'Łódzkie' },
  { id: '06', name: 'Małopolskie' },
  { id: '07', name: 'Mazowieckie' },
  { id: '08', name: 'Opolskie' },
  { id: '09', name: 'Podkarpackie' },
  { id: '10', name: 'Podlaskie' },
  { id: '11', name: 'Pomorskie' },
  { id: '12', name: 'Śląskie' },
  { id: '13', name: 'Świętokrzyskie' },
  { id: '14', name: 'Warmińsko-Mazurskie' },
  { id: '15', name: 'Wielkopolskie' },
  { id: '16', name: 'Zachodniopomorskie' }
];

export default function Home() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(null);
  const [locationSaved, setLocationSaved] = useState(false);

  useEffect(() => {
    const savedId = localStorage.getItem('selectedStateId');
    const lat = localStorage.getItem('userLatitude');
    const lng = localStorage.getItem('userLongitude');

    if (savedId) setSelectedId(savedId);
    if (lat && lng) setLocationSaved(true);
  }, []);

  const handleSelect = (state) => {
    localStorage.setItem('selectedStateId', state.id);
    localStorage.setItem('selectedStateName', state.name);
    setSelectedId(state.id);
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolokalizacja nie jest wspierana w Twojej przeglądarce.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        localStorage.setItem('userLatitude', position.coords.latitude);
        localStorage.setItem('userLongitude', position.coords.longitude);
        setLocationSaved(true);
      },
      (error) => {
        console.error(error);
        alert('Nie udało się pobrać lokalizacji.');
      }
    );
  };

  const handleContinue = () => {
    if (selectedId && locationSaved) {
      router.push('/specialities');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-6xl flex flex-col gap-8">
        {/* Headline */}
        <h1 className="text-2xl font-bold text-center">
          Aby kontynuować, wybierz województwo i udostępnij swoją lokalizację
        </h1>

        {/* Two-column content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: State grid */}
          <div>
            <h2 className="text-lg font-semibold mb-4">1. Wybierz województwo</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {STATES.map((state) => (
                <button
                  key={state.id}
                  onClick={() => handleSelect(state)}
                  className={`p-4 rounded-xl border-2 text-center font-medium shadow-sm transition duration-150 text-sm ${selectedId === state.id
                    ? 'border-blue-500 bg-blue-100 text-blue-800'
                    : 'border-gray-300 hover:bg-gray-100'
                    }`}
                >
                  {state.name}
                </button>
              ))}
            </div>
            {selectedId && (
              <p className="mt-4 text-sm text-gray-700">
                Wybrano: <strong>{localStorage.getItem('selectedStateName')}</strong>
              </p>
            )}
          </div>

          {/* Right: Location sharing */}
          <div className="flex flex-col items-center justify-center text-center border-2 border-gray-100 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">2. Udostępnij swoją lokalizację</h2>
            <p className="text-sm text-gray-600 mb-4">
              Potrzebujemy Twojej lokalizacji, aby znaleźć najbliższe placówki.
            </p>
            <button
              onClick={handleShareLocation}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Udostępnij lokalizację
            </button>
            {locationSaved && (
              <p className="mt-4 text-green-600 text-sm">Lokalizacja zapisana!</p>
            )}
          </div>
        </div>

        {/* Continue Button - centered */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleContinue}
            disabled={!selectedId || !locationSaved}
            className={`px-8 py-3 rounded-lg text-white font-semibold transition ${selectedId && locationSaved
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
              }`}
          >
            Kontynuuj
          </button>
        </div>
      </div>
    </main>
  );
}
