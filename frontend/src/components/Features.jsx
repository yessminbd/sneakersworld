import { Truck, ShieldCheck, BadgePercent, CheckCircle2, Clock, Sparkles } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      subtitle: "Across Tunisia",
      badge: "24-48h Express",
      dotColor: "bg-emerald-500",
      description: "Fast, reliable shipping right to your doorstep anywhere in Tunisia.",
      points: [
        "Delivered to all 24 governorates",
        "Real-time SMS & phone tracking",
        "Pay on delivery (Cash on Delivery)",
      ],
      footerNote: "Dispatches daily from Tunis",
    },
    {
      icon: ShieldCheck,
      title: "High Quality",
      subtitle: "100% Authentic",
      badge: "Guaranteed Original",
      dotColor: "bg-blue-500",
      description: "Only genuine sneakers sourced directly from verified international partners.",
      points: [
        "10-point physical inspection",
        "Original box, SKU & factory laces",
        "Zero fakes, zero compromises",
      ],
      footerNote: "Certified authenticity check",
    },
    {
      icon: BadgePercent,
      title: "Best Price",
      subtitle: "True Local Rates",
      badge: "No Hidden Fees",
      dotColor: "bg-tertiary",
      description: "Transparent pricing in Tunisian Dinar with no unexpected customs markups.",
      points: [
        "Direct-to-consumer pricing in TND",
        "No international customs surprises",
        "Exclusive member drops & discounts",
      ],
      footerNote: "Price match assurance",
    },
  ];

  return (
    <section className="py-20 bg-primaryLight border-y border-gray-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-10 shadow-xs text-xs font-bold uppercase tracking-wider text-tertiary mb-3">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            The Sneakers World Guarantee
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary tracking-tight">
            Why Sneakerheads Choose Us
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-50">
            Premium authentic sneakers with fast delivery and the best rates in Tunisia.
          </p>
        </div>

        {/* 3 Features Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="group relative flex flex-col justify-between p-8 rounded-3xl bg-white border border-gray-10 hover:border-gray-20 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5"
              >
                <div>
                  {/* Top Bar with Icon & Live Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-13 h-13 rounded-2xl bg-primary text-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:bg-tertiary shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gray-10/70 text-primary border border-gray-10">
                      <span className={`w-2 h-2 rounded-full ${item.dotColor} animate-ping`} />
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-black text-primary tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs font-bold uppercase tracking-wider text-tertiary mb-3">
                    {item.subtitle}
                  </p>
                  <p className="text-sm text-gray-50 leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Key Feature Points */}
                  <ul className="space-y-2.5 pt-4 border-t border-gray-10">
                    {item.points.map((point) => (
                      <li key={point} className="flex items-center gap-2.5 text-xs text-secondary font-medium">
                        <CheckCircle2 className="w-4 h-4 text-tertiary shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer Note */}
                <div className="mt-8 pt-4 border-t border-dashed border-gray-10 flex items-center justify-between text-[11px] font-semibold text-gray-30">
                  <span>{item.footerNote}</span>
                  <span className="text-tertiary font-bold group-hover:translate-x-1 transition-transform">
                    ● Active
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
