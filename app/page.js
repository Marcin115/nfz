'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { geoMercator, geoPath } from 'd3-geo';
import { STATES } from './constants/states';

/* ----------------------- 1. ŚCIEŻKA DO GEOJSON ---------------------- */
const GEOJSON_LOCAL =
  '/voivodeships/wojewodztwa/wojewodztwa.json'; // plik w public/

/* ----------------------- 2. TABELA ID + NAZWY ---------------------- */
/*  JPT_KOD_JE w geojsonie odpowiada tym kodom 01-16 (patrz GUGiK)  */
// export const STATES = [
//   { id: '02', name: 'Dolnośląskie', nfzId: '1' },
//   { id: '04', name: 'Kujawsko-Pomorskie', nfzId: '2' },
//   { id: '06', name: 'Lubelskie', nfzId: '3' },
//   { id: '08', name: 'Lubuskie', nfzId: '4' },
//   { id: '10', name: 'Łódzkie', nfzId: '5' },
//   { id: '12', name: 'Małopolskie', nfzId: '6' },
//   { id: '14', name: 'Mazowieckie', nfzId: '7' },
//   { id: '16', name: 'Opolskie', nfzId: '8' },
//   { id: '18', name: 'Podkarpackie', nfzId: '9' },
//   { id: '20', name: 'Podlaskie', nfzId: '10' },
//   { id: '22', name: 'Pomorskie', nfzId: '11' },
//   { id: '24', name: 'Śląskie', nfzId: '12' },
//   { id: '26', name: 'Świętokrzyskie', nfzId: '13' },
//   { id: '28', name: 'Warmińsko-Mazurskie', nfzId: '14' },
//   { id: '30', name: 'Wielkopolskie', nfzId: '15' },
//   { id: '32', name: 'Zachodniopomorskie', nfzId: '16' },
// ];


/* pomocnicze: znajdź rekord po kodzie */
const findState = (code) => STATES.find((s) => s.id === code);

/* ----------------------- 3. MAPA SVG ---------------------- */
function PolandSvgMap({ selectedId, onSelect }) {
  const [feats, setFeats] = useState([]);

  useEffect(() => {
    fetch(GEOJSON_LOCAL)
      .then((r) => r.json())
      .then((geo) => {
        const w = 360,
          h = 420;
        const projection = geoMercator().fitSize([w, h], geo);
        const path = geoPath().projection(projection);

        const features = geo.features.map((f) => {
          const id = f.properties.JPT_KOD_JE?.padStart(2, '0'); // np "02"
          const [cx, cy] = path.centroid(f);
          return {
            id,
            name: f.properties.JPT_NAZWA_ || '',
            d: path(f),
            cx,
            cy,
          };
        });
        setFeats(features);
      });
  }, []);

  return (
    <svg viewBox="0 35 360 360" className="w-full h-auto max-h-[380px]">

      {feats.map(({ id, name, d, cx, cy }) => {
        const active = id === selectedId;
        return (
          <g key={id}>
            <path
              d={d}
              fill={active ? '#2563eb' : '#fdf4ef'}
              stroke="#326a5d"
              strokeWidth={1}
              className="cursor-pointer transition-colors"
              onClick={() => onSelect({ id, name })}
              onMouseEnter={(e) =>
                !active && (e.currentTarget.style.fill = '#e7ddd2')
              }
              onMouseLeave={(e) =>
                !active && (e.currentTarget.style.fill = '#fdf4ef')
              }
            />
            {/* tekst tylko, gdy centroid istnieje */}
            {!Number.isNaN(cx) && !Number.isNaN(cy) && (
              <text
                x={cx}
                y={cy}
                fontSize="8"
                fontWeight="600"
                textAnchor="middle"
                pointerEvents="none"
                fill={active ? '#ffffff' : '#326a5d'}
              >
                {name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ----------------------- 4. STRONA ---------------------- */
export default function Home() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(null);
  const [locationSaved, setLocationSaved] = useState(false);

  /* wczytaj localStorage przy starcie */
  useEffect(() => {
    const saved = localStorage.getItem('selectedStateId');
    const lat = localStorage.getItem('userLatitude');
    if (saved) setSelectedId(saved);
    if (lat) setLocationSaved(true);
  }, []);

  const handleSelect = ({ id, name }) => {
    localStorage.setItem('selectedStateId', id);
    localStorage.setItem('selectedStateName', name);
    setSelectedId(id);
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation)
      return alert('Twoja przeglądarka nie wspiera geolokalizacji');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        localStorage.setItem('userLatitude', pos.coords.latitude);
        localStorage.setItem('userLongitude', pos.coords.longitude);
        setLocationSaved(true);
      },
      () => alert('Nie udało się pobrać lokalizacji.')
    );
  };

  const handleContinue = () => {
    if (selectedId && locationSaved) router.push('/specialities');
  };

  return (
    <main className="h-[calc(100vh-88px)] flex items-center justify-center p-4">
      <div className="bg-[#fdf4ef] rounded-xl shadow-lg p-8 w-full max-w-5xl">
        {/* header */}
        {/*  header  */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#326a5d] mb-1">
            Aby kontynuować, wybierz województwo i udostępnij lokalizację
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            Twoje dane pomogą znaleźć najbliższy termin.
          </p>

          {/* <--- NOWE (zamiast h2 w kolumnie) */}
          <span className="block text-lg font-semibold text-[#326a5d]">
            1.&nbsp;Wybierz województwo
          </span>
        </div>


        {/* grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* mapa */}
          {/* mapa */}
          <div className="flex items-center justify-center">
            {/* nowa ramka utrzymująca proporcje */}
            <div className="w-full max-w-[420px] aspect-square">
              <PolandSvgMap selectedId={selectedId} onSelect={handleSelect} />
            </div>
          </div>


          {/* lokalizacja */}
          <div className="flex flex-col items-center justify-center text-center border border-gray-200 rounded-lg p-6 bg-gray-50">
            <h2 className="text-lg font-semibold text-[#326a5d] mb-2">
              2. Udostępnij lokalizację
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Pomoże nam to określić, które placówki są najbliżej Ciebie.
            </p>
            <button
              onClick={handleShareLocation}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Udostępnij lokalizację
            </button>
            {locationSaved && (
              <p className="mt-3 text-green-600 text-sm">
                Lokalizacja zapisana!
              </p>
            )}
          </div>
        </div>

        {/* kontynuuj + wybrano */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          {selectedId && (
            <p className="text-sm text-gray-700">
              Wybrano:&nbsp;
              <strong>{localStorage.getItem('selectedStateName')}</strong>
            </p>
          )}

          <button
            onClick={handleContinue}
            disabled={!selectedId || !locationSaved}
            className={`px-8 py-3 rounded-lg text-white font-semibold transition
      ${selectedId && locationSaved
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Kontynuuj
          </button>
        </div>

      </div>
    </main>
  );
}
