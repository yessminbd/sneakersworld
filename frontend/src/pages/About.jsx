import { useEffect, useRef, useState } from "react";
import { Truck, ShieldCheck, Sparkles, Tag } from "lucide-react";
import ContactForm from "../components/ContactForm";
import bgHero from "../assets/bg_hero.jpg";
import { useLang } from "../context/LangContext";

/* Apparition au scroll (une seule fois) */
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* Compteur animé : "240K+" → 0 … 240 puis "K+" */
function Counter({ value, start }) {
  const match = String(value).match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(target);
      return;
    }
    let raf;
    const duration = 1600;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target]);

  return (
    <>
      {n}
      {suffix}
    </>
  );
}

export default function About() {
  const { t } = useLang();
  const [statsRef, statsIn] = useInView(0.3);
  const [servicesRef, servicesIn] = useInView(0.15);
  const [contactRef, contactIn] = useInView(0.2);

  const stats = [
    { value: "240K+", label: t.statFollowers },
    { value: "500+", label: t.statModels },
    { value: "15K+", label: t.statCustomers },
    { value: "30+", label: t.statBrands },
  ];

  const services = [
    { icon: Sparkles, title: t.service1Title, desc: t.service1Desc },
    { icon: Truck, title: t.service2Title, desc: t.service2Desc },
    { icon: ShieldCheck, title: t.service3Title, desc: t.service3Desc },
    { icon: Tag, title: t.service4Title, desc: t.service4Desc },
  ];

  const titleWords = String(t.aboutHeroTitle).split(" ");

  return (
    <div className="overflow-x-hidden">
      <style>{`
        @keyframes ab-rise { from { opacity:0; transform: translateY(36px); } to { opacity:1; transform:none; } }
        @keyframes ab-word { from { opacity:0; transform: translateY(100%) rotate(4deg); } to { opacity:1; transform:none; } }
        @keyframes ab-float { 0%,100% { transform: translate(0,0) rotate(0); } 50% { transform: translate(18px,-26px) rotate(8deg); } }
        @keyframes ab-pan { from { transform: scale(1.08) translateX(0); } to { transform: scale(1.18) translateX(-2%); } }
        @keyframes ab-shimmer { from { background-position: -200% 0; } to { background-position: 200% 0; } }
        @keyframes ab-bounce { 0%,100% { transform: translateY(0); } 40% { transform: translateY(-7px) rotate(-6deg); } 70% { transform: translateY(0) rotate(4deg); } }
        @keyframes ab-pulse-ring { 0% { transform: scale(.9); opacity:.6; } 100% { transform: scale(1.8); opacity:0; } }
        @keyframes ab-scroll { 0%,100% { transform: translateY(0); opacity:1; } 60% { transform: translateY(8px); opacity:.2; } }

        .ab-hero-bg { animation: ab-pan 18s ease-in-out infinite alternate; }
        .ab-word { display:inline-block; overflow:hidden; vertical-align:bottom; }
        .ab-word > span { display:inline-block; animation: ab-word .8s cubic-bezier(.2,.8,.2,1) both; }
        .ab-badge {
          background: linear-gradient(110deg, transparent 30%, rgba(255,255,255,.35) 50%, transparent 70%);
          background-size: 200% 100%; animation: ab-shimmer 3s linear infinite;
        }
        .ab-stat { transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; }
        .ab-stat:hover { transform: translateY(-8px) scale(1.03); }
        .ab-service { position: relative; overflow: hidden; transition: transform .35s cubic-bezier(.2,.8,.2,1), box-shadow .35s; }
        .ab-service:hover { transform: translateY(-8px); }
        .ab-service::before {
          content:""; position:absolute; inset:auto 0 0 0; height:4px; background: currentColor;
          transform: scaleX(0); transform-origin: left; transition: transform .5s ease;
        }
        [dir="rtl"] .ab-service::before { transform-origin: right; }
        .ab-service:hover::before { transform: scaleX(1); }
        .ab-service:hover .ab-icon { animation: ab-bounce .8s ease; }

        @media (prefers-reduced-motion: reduce) {
          .ab-hero-bg, .ab-word > span, .ab-badge, .ab-shape, .ab-scroll-dot, .ab-ring { animation: none !important; }
          .ab-service:hover .ab-icon { animation: none !important; }
        }
      `}</style>

      {/* ───────── HERO ───────── */}
      <section className="relative text-primaryLight overflow-hidden">
        <div
          className="ab-hero-bg absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgHero})` }}
        />
        <div className="absolute inset-0 bg-primary/80" />

        {/* Formes flottantes */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="ab-shape absolute top-10 start-[8%] w-24 h-24 rounded-full bg-tertiary/25 blur-xl" style={{ animation: "ab-float 9s ease-in-out infinite" }} />
          <div className="ab-shape absolute bottom-16 end-[10%] w-40 h-40 rounded-full bg-white/10 blur-2xl" style={{ animation: "ab-float 12s ease-in-out infinite reverse" }} />
          <div className="ab-shape absolute top-1/3 end-[28%] w-16 h-16 rounded-2xl border border-white/20 rotate-12" style={{ animation: "ab-float 10s ease-in-out infinite" }} />
          <div className="ab-shape absolute bottom-1/3 start-[22%] w-12 h-12 rounded-full border-2 border-tertiary/50" style={{ animation: "ab-float 11s ease-in-out infinite reverse" }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 pt-24 pb-32 text-center">
          <span
            className="ab-badge inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-tertiary font-semibold text-xs tracking-widest uppercase mb-5"
            style={{ animation: "ab-rise .7s ease-out both" }}
          >
            {t.aboutHeroBadge}
          </span>

          <h1 className="text-4xl sm:text-6xl font-black mb-5 tracking-tight">
            {titleWords.map((w, i) => (
              <span key={i} className="ab-word me-3">
                <span style={{ animationDelay: `${0.15 + i * 0.15}s` }}>{w}</span>
              </span>
            ))}
          </h1>

          <p
            className="text-gray-20 max-w-xl mx-auto text-sm sm:text-base"
            style={{ animation: "ab-rise .8s ease-out .5s both" }}
          >
            {t.aboutHeroDesc}
          </p>

          {/* Indicateur de scroll */}
          <div
            aria-hidden
            className="mt-10 mx-auto w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2"
            style={{ animation: "ab-rise .8s ease-out .9s both" }}
          >
            <span className="ab-scroll-dot w-1 h-2 rounded-full bg-tertiary" style={{ animation: "ab-scroll 1.6s ease-in-out infinite" }} />
          </div>
        </div>
      </section>

      {/* ───────── STATS ───────── */}
      <section ref={statsRef} className="max-w-6xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="ab-stat bg-primaryLight rounded-2xl shadow-lg shadow-primary/10 hover:shadow-2xl border border-gray-10 p-6 text-center"
              style={
                statsIn
                  ? { animation: `ab-rise .7s cubic-bezier(.2,.8,.2,1) ${i * 0.12}s both` }
                  : { opacity: 0 }
              }
            >
              <p className="text-3xl sm:text-4xl font-black text-primary tabular-nums">
                <Counter value={s.value} start={statsIn} />
              </p>
              <div className="mx-auto my-2 h-0.5 w-8 rounded bg-tertiary" />
              <p className="text-xs sm:text-sm text-gray-30">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── SERVICES ───────── */}
      <section ref={servicesRef} className="max-w-6xl mx-auto px-4 py-24">
        <div
          className="text-center mb-14"
          style={servicesIn ? { animation: "ab-rise .7s ease-out both" } : { opacity: 0 }}
        >
          <h2 className="text-2xl sm:text-4xl font-black text-primary tracking-tight">
            {t.ourServices}
          </h2>
          <div className="mx-auto mt-3 h-1 w-14 rounded-full bg-tertiary" />
          <p className="text-sm text-gray-30 mt-4">{t.ourServicesSub}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="ab-service text-tertiary group p-7 rounded-2xl bg-gray-10 hover:bg-primary hover:shadow-2xl transition-colors duration-300"
              style={
                servicesIn
                  ? { animation: `ab-rise .7s cubic-bezier(.2,.8,.2,1) ${0.15 + i * 0.13}s both` }
                  : { opacity: 0 }
              }
            >
              <div className="relative w-14 h-14 mb-5">
                <span className="ab-ring absolute inset-0 rounded-full bg-tertiary/40 opacity-0 group-hover:opacity-100" style={{ animation: "ab-pulse-ring 1.6s ease-out infinite" }} />
                <div className="ab-icon relative w-14 h-14 flex items-center justify-center rounded-full bg-primary group-hover:bg-tertiary transition-colors duration-300">
                  <Icon className="w-6 h-6 text-primaryLight" />
                </div>
              </div>
              <h3 className="font-bold text-lg text-primary group-hover:text-primaryLight transition-colors duration-300">
                {title}
              </h3>
              <p className="text-sm text-gray-30 group-hover:text-gray-20 mt-2 leading-relaxed transition-colors duration-300">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────── CONTACT ───────── */}
      <section ref={contactRef} className="relative bg-gray-10 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="ab-shape absolute -top-20 -start-20 w-72 h-72 rounded-full bg-tertiary/10 blur-3xl" style={{ animation: "ab-float 14s ease-in-out infinite" }} />
          <div className="ab-shape absolute -bottom-24 -end-16 w-80 h-80 rounded-full bg-primary/10 blur-3xl" style={{ animation: "ab-float 16s ease-in-out infinite reverse" }} />
        </div>

        <div
          className="relative max-w-6xl mx-auto px-4 py-24 text-center"
          style={contactIn ? { animation: "ab-rise .8s ease-out both" } : { opacity: 0 }}
        >
          <h2 className="text-2xl sm:text-4xl font-black text-primary tracking-tight mb-2">
            {t.gotQuestion}
          </h2>
          <div className="mx-auto mb-4 h-1 w-14 rounded-full bg-tertiary" />
          <p className="text-sm text-gray-30 mb-10">{t.gotQuestionSub}</p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}