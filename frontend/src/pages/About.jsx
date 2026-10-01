import { Truck, ShieldCheck, Sparkles, Tag } from "lucide-react";
import ContactForm from "../components/ContactForm";
import bgHero from "../assets/bg_hero.jpg";
import { useLang } from "../context/LangContext";

export default function About() {
  const { t } = useLang();

  const stats = [
    { value: "240K+", label: t.statFollowers },
    { value: "500+", label: t.statModels },
    { value: "15K+", label: t.statCustomers },
    { value: "30+", label: t.statBrands },
  ];

  const services = [
    {
      icon: Sparkles,
      title: t.service1Title,
      desc: t.service1Desc,
    },
    {
      icon: Truck,
      title: t.service2Title,
      desc: t.service2Desc,
    },
    {
      icon: ShieldCheck,
      title: t.service3Title,
      desc: t.service3Desc,
    },
    {
      icon: Tag,
      title: t.service4Title,
      desc: t.service4Desc,
    },
  ];

  return (
    <div>
      <section className="relative text-primaryLight overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgHero})` }}
        />
        <div className="absolute inset-0 bg-primary/80" />
       
        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
          <span className="inline-block text-tertiary font-semibold text-sm tracking-widest uppercase mb-3">
            {t.aboutHeroBadge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">
            {t.aboutHeroTitle}
          </h1>
          <p className="text-gray-20 max-w-xl mx-auto text-sm sm:text-base">
            {t.aboutHeroDesc}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-primaryLight rounded-2xl shadow-lg shadow-primary/10 border border-gray-10 p-6 text-center hover:-translate-y-1 transition-transform duration-300"
            >
              <p className="text-2xl sm:text-3xl font-bold text-primary">
                {s.value}
              </p>
              <p className="text-xs sm:text-sm text-gray-30 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            {t.ourServices}
          </h2>
          <p className="text-sm text-gray-30 mt-2">
            {t.ourServicesSub}
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group p-6 rounded-2xl bg-gray-10 hover:bg-primary transition-colors duration-300"
            >
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary group-hover:bg-tertiary transition-colors duration-300 mb-4">
                <Icon className="w-6 h-6 text-primaryLight" />
              </div>
              <h3 className="font-semibold text-primary group-hover:text-primaryLight transition-colors duration-300">
                {title}
              </h3>
              <p className="text-sm text-gray-30 group-hover:text-gray-20 mt-2 transition-colors duration-300">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-10">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-2">
            {t.gotQuestion}
          </h2>
          <p className="text-sm text-gray-30 mb-10">
            {t.gotQuestionSub}
          </p>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}