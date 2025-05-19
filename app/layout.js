// app/layout.js
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Termin NFZ',
  description: 'Znajdź najbliższy termin świadczenia NFZ w twojej okolicy !',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className="bg-[var(--background)] text-[var(--foreground)] font-sans">
        {/* Fixed Top Navbar - no margins */}
        <nav className="w-full bg-[#fdf4ef] shadow-md rounded-b-xl px-6 py-4 fixed top-0 left-0 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            {/* Logo / Brand */}
            <div className="text-2xl font-bold text-[#326a5d] tracking-tight">
              Termin NFZ
            </div>

            {/* Navigation Links */}
            <div className="flex gap-4">
              <Link href="/" className="text-sm font-medium text-[#326a5d] hover:text-[#27564b] transition">
                Lokalizacja
              </Link>
              <Link href="/specialities" className="text-sm font-medium text-[#326a5d] hover:text-[#27564b] transition">
                Wybór świadczenia
              </Link>
              <Link href="/results" className="text-sm font-medium text-[#326a5d] hover:text-[#27564b] transition">
                Mapa wyników
              </Link>
            </div>
          </div>
        </nav>

        {/* Content below navbar */}
        <main className="pt-[88px]">{children}</main>
      </body>
    </html>
  );
}