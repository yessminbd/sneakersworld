const brands = [
  {
    name: 'Adidas',
    color: '#0051BA',
    svg: (
      <svg viewBox="0 0 120 60" fill="currentColor" className="h-8 w-auto">
        <path d="M60 8L20 52h80L60 8zm0 10.5L89.5 46H30.5L60 18.5z" />
        <text x="60" y="58" textAnchor="middle" fontSize="11" fontWeight="900" fontFamily="sans-serif" letterSpacing="3">ADIDAS</text>
      </svg>
    ),
  },
  {
    name: 'Nike',
    color: '#000000',
    svg: (
      <svg viewBox="0 0 120 40" fill="currentColor" className="h-8 w-auto">
        <path d="M6 30 C20 10, 60 2, 114 8 C90 16, 40 22, 6 30Z" />
      </svg>
    ),
  },
  {
    name: 'Puma',
    color: '#000000',
    svg: (
      <svg viewBox="0 0 120 50" fill="currentColor" className="h-8 w-auto">
        <text x="60" y="36" textAnchor="middle" fontSize="28" fontWeight="900" fontFamily="sans-serif" letterSpacing="2">PUMA</text>
        <path d="M105 8 C114 14, 116 26, 108 32 L100 28 C106 24, 106 14, 98 12Z" />
      </svg>
    ),
  },
  {
    name: 'New Balance',
    color: '#E4002B',
    svg: (
      <svg viewBox="0 0 120 50" fill="currentColor" className="h-8 w-auto">
        <text x="60" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fontFamily="sans-serif" letterSpacing="1">NEW BALANCE</text>
        <text x="60" y="42" textAnchor="middle" fontSize="30" fontWeight="900" fontFamily="sans-serif">NB</text>
      </svg>
    ),
  },
  {
    name: 'Reebok',
    color: '#E4002B',
    svg: (
      <svg viewBox="0 0 120 50" fill="currentColor" className="h-8 w-auto">
        <text x="60" y="36" textAnchor="middle" fontSize="22" fontWeight="900" fontFamily="sans-serif" letterSpacing="3">REEBOK</text>
      </svg>
    ),
  },
  {
    name: 'Converse',
    color: '#000000',
    svg: (
      <svg viewBox="0 0 120 50" fill="currentColor" className="h-8 w-auto">
        <circle cx="60" cy="22" r="14" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M52 22 h16" stroke="currentColor" strokeWidth="3" />
        <path d="M60 14 v16" stroke="currentColor" strokeWidth="3" />
        <text x="60" y="46" textAnchor="middle" fontSize="10" fontWeight="800" fontFamily="sans-serif" letterSpacing="1">CONVERSE</text>
      </svg>
    ),
  },
  {
    name: 'Vans',
    color: '#C9192E',
    svg: (
      <svg viewBox="0 0 120 50" fill="currentColor" className="h-8 w-auto">
        <text x="60" y="38" textAnchor="middle" fontSize="34" fontWeight="900" fontFamily="sans-serif" letterSpacing="2">VANS</text>
      </svg>
    ),
  },
  {
    name: 'Jordan',
    color: '#E4002B',
    svg: (
      <svg viewBox="0 0 50 50" fill="currentColor" className="h-8 w-auto">
        <circle cx="25" cy="8" r="5" />
        <path d="M25 13 L18 28 L25 24 L32 28 Z" />
        <path d="M18 28 L12 40 M32 28 L38 40" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M12 40 L22 36 M38 40 L28 36" stroke="currentColor" strokeWidth="3" fill="none" />
        <path d="M20 20 L10 26 M30 20 L40 26" stroke="currentColor" strokeWidth="2.5" fill="none" />
      </svg>
    ),
  },
];

// Duplicate for seamless loop
const track = [...brands, ...brands, ...brands];

export default function Partners() {
  return (
    <section className="py-16 bg-primaryLight overflow-hidden">
      {/* Header */}
      <div className="max-padd-container mb-10 text-center">
        <p className="text-tertiary text-xs font-bold uppercase tracking-[4px] mb-2">
          Trusted Partners
        </p>
        <h2 className="text-primary text-3xl font-black tracking-tight">
          The World&apos;s Best Brands
        </h2>
        <p className="text-gray-50 text-sm mt-2 max-w-sm mx-auto">
          We carry only authentic gear from the top names in sneaker culture.
        </p>
      </div>

      {/* Marquee row 1 — left scrolling */}
      <div className="relative w-full mb-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-primaryLight to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-primaryLight to-transparent" />
        <div className="flex marquee-track">
          {track.map((brand, i) => (
            <BrandCard key={`r1-${i}`} brand={brand} />
          ))}
        </div>
      </div>

      {/* Marquee row 2 — right scrolling */}
      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-primaryLight to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-primaryLight to-transparent" />
        <div className="flex marquee-track-reverse">
          {track.map((brand, i) => (
            <BrandCard key={`r2-${i}`} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandCard({ brand }) {
  return (
    <div
      className="
        flex-shrink-0 mx-4
        flex flex-col items-center justify-center
        w-36 h-20
        rounded-2xl
        border border-gray-20/20 shadow-sm
        bg-white
        hover:border-tertiary/50 hover:scale-105 hover:shadow-md
        transition-all duration-300 cursor-pointer
      "
      style={{ color: brand.color }}
    >
      <div className="w-24 flex items-center justify-center">
        {brand.svg}
      </div>
    </div>
  );
}
