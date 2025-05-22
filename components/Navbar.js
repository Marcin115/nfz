import Link from "next/link";
import { Search, LogIn } from "lucide-react";

export default function Navbar() {
    return (
        <header className="fixed top-0 left-0 z-50 w-full bg-[#fdf4ef]/95 backdrop-blur-md shadow-md border-b border-[#e7ddd2]">
            <nav className="flex w-full items-center justify-between px-6 py-4">
                {/* Left side: logo + primary links */}
                <div className="flex items-center space-x-8">
                    {/* Logo */}
                    <Link href="/" className="text-2xl font-extrabold tracking-tight text-[#326a5d]">
                        <span className="text-[#27564b]">Termi</span>NFZ
                    </Link>

                    {/* Primary nav links – zamień dotychczasowy <ul> … </ul> na to */}
                    <ul className="hidden md:flex items-center space-x-6 text-[#326a5d] font-medium">
                        {[
                            { href: '/', label: 'Lokalizacja' },
                            { href: '/specialities', label: 'Wybór świadczenia' },
                            { href: '/results', label: 'Mapa wyników' },
                        ].map(({ href, label }) => (
                            <li key={href}>
                                <Link
                                    href={href}
                                    className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:w-full
                   after:bg-current after:origin-left after:scale-x-0 after:transition-transform after:duration-300
                   hover:after:scale-x-100"
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>

                </div>

                {/* Right side: search + login */}
                <div className="flex items-center space-x-6">
                    {/* Search icon (placeholder) */}
                    <button
                        type="button"
                        aria-label="Szukaj (wkrótce)"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#326a5d] hover:bg-[#e7ddd2]/40 focus:outline-none"
                    >
                        <Search className="h-5 w-5" />
                    </button>

                    {/* Login button */}
                    <Link
                        href="/login"
                        className="inline-flex items-center space-x-1 rounded-lg border border-[#326a5d] px-3 py-1.5 text-sm font-semibold text-[#326a5d] transition-colors hover:bg-[#326a5d] hover:text-white"
                    >
                        <LogIn className="h-4 w-4" />
                        <span>Zaloguj</span>
                    </Link>
                </div>
            </nav>
        </header>
    );
}
