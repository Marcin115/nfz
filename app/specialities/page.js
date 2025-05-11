'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const SPECIALITIES = [
  { key: 'ODDZIAŁ KARDIOLOGICZNY', name: 'Kardiolog' },
  { key: 'ODDZIAŁ OTORYNOLARYNGOLOGICZNY', name: 'Laryngolog'},
  { key: 'PORADNIA DERMATOLOGICZNA', name: 'Dermatolog' },
  { key: 'ODDZIAŁ NEUROLOGICZNY', name: 'Neurolog' },
  { key: 'ODDZIAŁ PEDIATRYCZNY', name: 'Pediatra' },
  { key: 'ODDZIAŁ DZIENNY PSYCHIATRYCZNY (OGÓLNY)', name: 'Psychiatra' },
  { key: 'PORADNIA STOMATOLOGICZNA', name: 'Dentysta' },
  { key: 'PORADNIA OKULISTYCZNA', name: 'Okulista' },
  { key: 'ŚWIADCZENIA Z ZAKRESU ORTOPEDII I TRAUMATOLOGII NARZĄDU RUCHU', name: 'Ortopeda' },
];

export default function SpecialitiesPage() {
  const router = useRouter();
  const [stateName, setStateName] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    const savedState = localStorage.getItem('selectedStateName');
    const lat = localStorage.getItem('userLatitude');
    const lng = localStorage.getItem('userLongitude');

    if (!savedState || !lat || !lng) {
      router.push('/');
    } else {
      setStateName(savedState);
    }
  }, []);

  const handleSelect = (speciality) => {
    localStorage.setItem('selectedSpecialityKey', speciality.key);
    localStorage.setItem('selectedSpecialityName', speciality.name);
    setSelectedKey(speciality.key);
  };

  const handleContinue = () => {
    if (selectedKey) {
      router.push('/results');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-4xl flex flex-col gap-8">
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Wybierz specjalizację</h1>
          <p className="text-sm text-gray-600">
            Województwo: <strong>{stateName}</strong>
          </p>
        </div>

        {/* Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-center">Dostępne specjalizacje</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {SPECIALITIES.map((speciality) => (
              <button
                key={speciality.key}
                onClick={() => handleSelect(speciality)}
                className={`p-4 rounded-xl border-2 text-center font-medium shadow-sm transition text-sm ${
                  selectedKey === speciality.key
                    ? 'border-blue-500 bg-blue-100 text-blue-800'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {speciality.name}
              </button>
            ))}
          </div>
        </div>

        {/* Continue button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleContinue}
            disabled={!selectedKey}
            className={`px-8 py-3 rounded-lg text-white font-semibold transition ${
              selectedKey
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