import { MapPin, Mail, Phone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import logo from "../assets/logo-sneakers-world.png";

const ADMIN_URL = import.meta.env.VITE_ADMIN_URL;

// Inline social SVGs
const InstagramIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

const FacebookIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
);

const TwitterIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const YoutubeIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
    </svg>
);

const socials = [
    { Icon: InstagramIcon, href: "https://www.instagram.com/sneakersworld913/", label: "Instagram" },
    { Icon: FacebookIcon, href: "#", label: "Facebook" },
];

export default function Footer() {
    const { t } = useLang();

    const footerSections = [
        {
            category: t.shopSection,
            links: [
                { label: t.newArrivals, href: "/collection" },
                { label: t.collection, href: "/collection" },
                { label: t.bestSellers, href: "/collection" },
                { label: t.sale, href: "/collection" },
            ],
        },
        {
            category: t.companySection,
            links: [
                { label: t.aboutUs, href: "/about" },
                { label: t.contact, href: "/about" },
                { label: t.ordersTitle, href: "/profile" },
                { label: t.trackOrder, href: "/orders" },
            ],
        },
        {
            category: t.supportSection,
            links: [
                { label: t.faq, href: "/about" },
                { label: t.returns, href: "/about" },
                { label: t.sizeGuide, href: "/size-guide" },
                { label: t.shippingInfo, href: "/about" },
            ],
        },
    ];

    return (
        <footer className="bg-primary text-primaryLight">
            {/* Main footer grid */}
            <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

                {/* Brand column */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                    <Link to="/" className="inline-block transition-opacity hover:opacity-80">
                        <img src={logo} alt="Sneakers World" className="h-8 w-auto" />
                    </Link>
                    <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                        {t.footerSlogan}
                    </p>

                    {/* Contact info */}
                    <div className="flex flex-col gap-2 text-sm text-white/50">
                        <span className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-tertiary shrink-0" />
                        Tunisia
                        </span>
                    </div>

                    {/* Socials */}
                    <div className="flex items-center gap-3 mt-1">
                        {socials.map(({ Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                className="p-2 rounded-full border border-white/10 text-white/50 hover:border-tertiary hover:text-tertiary transition-all duration-200 hover:scale-110"
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Links columns */}
                {footerSections.map((sec, idx) => (
                    <div key={idx}>
                        <h3 className="text-xs font-bold tracking-widest uppercase text-white/30 mb-4">
                            {sec.category}
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {sec.links.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="text-sm text-white/60 hover:text-tertiary transition-colors duration-200"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
                    <p>© {new Date().getFullYear()} Sneakers World. {t.rightsReserved}</p>
                    <div className="flex items-center gap-6">
                        <span className="hover:text-white/60 transition-colors cursor-pointer">{t.privacyPolicy}</span>
                        <span className="hover:text-white/60 transition-colors cursor-pointer">{t.termsOfService}</span>
                        <a
                            href={ADMIN_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-white/60 transition-colors"
                        >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {t.adminPanel}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
