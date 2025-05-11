// app/layout.js
import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'Termin NFZ',
  description: 'Znajdź najbliższy termin świadczenia NFZ w twojej okolicy !',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[var(--background)] text-[var(--foreground)] font-sans">
        {/* Navbar */}
        <nav className="w-full bg-white border-b p-4 shadow-sm flex justify-between items-center sticky top-0 z-50">
          <div className="font-bold text-lg">Termin NFZ</div>
          <div className="space-x-4">
            <Link href="/" className="text-blue-600 hover:underline">Lokalizacja</Link>
            <Link href="/specialities" className="text-blue-600 hover:underline">Wybór świadczenia NFZ</Link>
            <Link href="/results" className="text-blue-600 hover:underline">Widok mapy</Link>
          </div>
        </nav>

        {/* Page content */}
        <main>{children}</main>
      </body>
    </html>
  );
}
