// app/layout.js
import "./globals.css";
import Navbar from "/components/Navbar";

export const metadata = {
  title: "Sprawdź terminy wizyty NFZ",
  description: "Znajdź najbliższy termin świadczenia NFZ w twojej okolicy !",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body className="bg-[var(--background)] text-[var(--foreground)] font-sans">
        {/* Global navbar */}
        <Navbar />

        {/* Główna zawartość stron */}
        <main className="pt-[88px]">{children}</main>
      </body>
    </html>
  );
}
