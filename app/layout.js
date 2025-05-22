// app/layout.js
// import { icon } from "leaflet";
import "./globals.css";
import Navbar from "/components/Navbar";

export const metadata = {
  title: "Sprawdź termin wizyty - NFZ",
  description: "Znajdź najbliższy termin świadczenia NFZ w twojej okolicy !",
  icons: {
    icon: "/favicon.svg"
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl" className="h-full">
      <body className="h-full bg-[var(--background)] text-[var(--foreground)] font-sans">
        {/* Global navbar */}
        <Navbar />

        {/* Główna zawartość stron */}
        <main className="h-full pt-[88px] overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
