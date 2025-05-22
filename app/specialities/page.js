'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const SPECIALITIES = [
  { key: 'ODDZIAŁ KARDIOLOGICZNY', name: 'Kardiolog' },
  { key: 'ODDZIAŁ OTORYNOLARYNGOLOGICZNY', name: 'Laryngolog' },
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
    <main className="h-[calc(100vh-88px)] flex items-center justify-center p-4">
      {/* tu zmiana zeby nie bylo scrolla */}
      <div className="bg-[#fdf4ef] rounded-xl shadow-lg p-6 w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#326a5d] mb-2">Wybierz specjalizację</h1>
          <p className="text-sm text-gray-600">
            Województwo: <strong>{stateName}</strong>
          </p>
        </div>

        {/* Grid of Specializations */}
        <div className="border border-gray-300 rounded-md p-4 mb-6">
          <div className="grid grid-cols-3 gap-4">
            {SPECIALITIES.map((speciality) => (
              <button
                key={speciality.key}
                onClick={() => handleSelect(speciality)}
                className={`w-full text-center px-4 py-2 rounded-full font-medium transition ${selectedKey === speciality.key
                  ? 'bg-blue-100 text-blue-800 border border-blue-500'
                  : 'bg-[#326a5d] text-white hover:bg-[#27564b]'
                  }`}
              >
                {speciality.name}
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedKey}
            className={`px-8 py-3 rounded-lg text-white font-semibold transition ${selectedKey
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