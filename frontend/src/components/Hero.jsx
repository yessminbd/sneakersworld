import { useState, useEffect, useContext } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { ShopContext } from "../context/ShopContext";
import sneaker1 from "../assets/slide1.jpg";
import sneaker2 from "../assets/slide2.jpg";
import sneaker3 from "../assets/slide3.jpg";
import sneaker4 from "../assets/slide4.jpg";

const slides = [
  {
    img: sneaker1,
    label: "Adidas Campus",
    tag: "New Drop",
    accent: "#f9a8d4",
  },
  {
    img: sneaker2,
    label: "New Balance 530",
    tag: "Bestseller",
    accent: "#94a3b8",
  },
  {
    img: sneaker3,
    label: "On Cloudmonster",
    tag: "Exclusive",
    accent: "#d6c3a8",
  },
  {
    img: sneaker4,
    label: "Puma Speedcat",
    tag: "Classic",
    accent: "#92400e",
  },
];

export default function Hero() {
  const { t } = useLang();
  const { token } = useContext(ShopContext);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);

  const goTo = (index) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((index + slides.length) % slides.length);
      setAnimating(false);
    }, 300);
  };

  // Trigger entrance animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => goTo(current + 1), 4000);
    return () => clearInterval(timer);
  }, [current]);

  const slide = slides[current];

  // Staggered animation helper
  const anim = (delay = 0) => ({
    style: {
      transitionDelay: `${delay}ms`,
      transitionProperty: 'opacity, transform',
      transitionDuration: '700ms',
      transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
    },
    className: visible
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-8',
  });

  return (
    <section className="min-h-[calc(100vh-64px)] flex items-center bg-primaryLight overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-12 py-16">

        {/* ── LEFT: Text + Buttons ── */}
        <div className="flex flex-col justify-center gap-8">

          {/* Badge */}
          <span
            {...anim(0)}
            className={`inline-flex w-fit items-center gap-2 px-4 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-semibold tracking-widest uppercase ${anim(0).className}`}
            style={anim(0).style}
          >
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            {t.heroBadge}
          </span>

          {/* Title */}
          <div
            className={anim(150).className}
            style={anim(150).style}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight text-primary">
              {t.heroTitle1}
              <br />
              <span className="text-tertiary">{t.heroTitle2}</span>
            </h1>
          </div>

          {/* Description */}
          <p
            className={`text-base md:text-lg text-gray-50 leading-relaxed max-w-md ${anim(300).className}`}
            style={anim(300).style}
          >
            {t.heroDesc}
          </p>

          {/* Buttons */}
          <div
            className={`flex flex-wrap items-center gap-4 ${anim(450).className}`}
            style={anim(450).style}
          >
            <Link
              to="/collection"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primaryLight text-sm font-semibold hover:bg-tertiary transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-tertiary/30"
            >
              {t.newCollectionBtn}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              to={token ? "/profile" : "/login"}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-2 border-primary text-primary text-sm font-semibold hover:border-tertiary hover:text-tertiary transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {t.joinUsBtn}
            </Link>
          </div>
        </div>

        {/* ── RIGHT: Image Carousel ── */}
        <div className="relative flex items-center justify-center">

          {/* Image */}
          <div className="relative z-10 w-full max-w-[480px]">
            <img
              key={current}
              src={slide.img}
              alt={slide.label}
              className={`w-full drop-shadow-2xl transition-all duration-300 ${animating
                  ? "opacity-0 scale-95 -translate-y-2"
                  : "opacity-100 scale-100 translate-y-0"
                }`}
              style={{ transitionProperty: "opacity, transform" }}
            />

            {/* Floating label */}
            <div
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: slide.accent }}
              />
              <span className="text-xs font-bold text-primary whitespace-nowrap">{slide.label}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: slide.accent }}>
                {slide.tag}
              </span>
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={() => goTo(current - 1)}
            className="absolute left-0 z-20 p-2 rounded-full bg-white/70 backdrop-blur-sm shadow hover:shadow-md hover:bg-white transition-all duration-200 hover:scale-110"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 text-primary" />
          </button>
          <button
            onClick={() => goTo(current + 1)}
            className="absolute right-0 z-20 p-2 rounded-full bg-white/70 backdrop-blur-sm shadow hover:shadow-md hover:bg-white transition-all duration-200 hover:scale-110"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 text-primary" />
          </button>

          {/* Dots */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${i === current
                    ? "w-6 h-2 bg-primary"
                    : "w-2 h-2 bg-gray-20 hover:bg-gray-50"
                  }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
