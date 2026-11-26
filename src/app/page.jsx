import Link from "next/link";
import { FaYoutube, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import DarkModeToggle from "@/src/components/ui/DarkModeToggle";
import { socials } from "@/src/lib/socials";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/src/lib/site";

export const metadata = {
  title: { absolute: SITE_NAME },
  alternates: { canonical: "/" },
};

const ICONS = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedin,
  Instagram: FaInstagram,
  X: FaXTwitter,
  YouTube: FaYoutube,
};

const SECONDARY_LINKS = [
  { label: "Blog", href: "/blog" },
  { label: "Resume", href: "/resume.pdf", external: true },
  { label: "Contact", href: "/portfolio#contact" },
];

// only show icons that have a real http(s) link
const visibleSocials = socials.filter(
  (s) => ICONS[s.label] && /^https?:\/\//i.test(s.href),
);

// structured data so search engines know this site is about a person
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  jobTitle: "Electrical Engineering Student",
  sameAs: visibleSocials.map((s) => s.href),
};

export default function Page() {
  return (
    <main
      className="relative min-h-screen overflow-hidden
                 [--text-primary:#ffffff] [--text-secondary:rgba(255,255,255,0.92)] [--text-inverse:#000000] [--overlay-color:0,0,0] [--overlay-opacity:0.6]
                 dark:[--text-primary:#000000] dark:[--text-secondary:rgba(0,0,0,0.9)] dark:[--text-inverse:#ffffff] dark:[--overlay-color:255,255,255] dark:[--overlay-opacity:0.5]"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Background Video */}
      <div
        className="fixed top-0 left-0 w-full h-full -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/hero-poster.jpg)" }}
      >
        {/* motion-reduce: no autoplaying video; the poster image above shows instead */}
        <video
          src="/hero.mp4"
          poster="/hero-poster.jpg"
          className="w-full h-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
        />
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            backgroundColor: `rgba(var(--overlay-color), var(--overlay-opacity))`,
          }}
        />
      </div>

      {/* Dark mode toggle */}
      <div className="fixed top-4 right-6 z-50">
        <DarkModeToggle />
      </div>

      {/* Hero Text */}
      <div className="flex flex-col justify-center min-h-screen pb-24 px-8 md:px-16">
        <h1
          className="text-6xl md:text-8xl font-bold leading-none mb-6 transition-colors duration-300"
          style={{
            fontFamily: "var(--font-instrument-serif)",
            color: "var(--text-primary)",
          }}
        >
          welcome to
          <br />
          my portfolio
        </h1>

        <p
          className="text-lg md:text-xl max-w-xl mb-10 leading-relaxed transition-colors duration-300"
          style={{
            fontFamily: "var(--font-instrument-serif)",
            color: "var(--text-secondary)",
          }}
        >
          an electrical engineering student building at the intersection of
          hardware and software.
        </p>

        {/* Where to go next */}
        <nav aria-label="Primary" className="flex flex-wrap gap-3 mb-16">
          <Link
            href="/portfolio"
            className="px-6 py-3 rounded-xl text-sm font-medium hover:opacity-80 transition"
            style={{
              backgroundColor: "var(--text-primary)",
              color: "var(--text-inverse)",
            }}
          >
            See my work →
          </Link>
          {SECONDARY_LINKS.map(({ label, href, external }) => (
            <Link
              key={label}
              href={href}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="px-6 py-3 rounded-xl text-sm font-medium backdrop-blur hover:opacity-80 transition"
              style={{
                border: "1.5px solid var(--text-primary)",
                color: "var(--text-primary)",
              }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 w-full pb-6 flex flex-col items-center gap-4">
        {visibleSocials.length > 0 && (
          <div className="flex gap-6">
            {visibleSocials.map(({ label, href }) => {
              const Icon = ICONS[label];
              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/40 transition"
                >
                  <Icon
                    className="w-5 h-5 transition-colors duration-300"
                    style={{ color: "var(--text-primary)" }}
                  />
                </a>
              );
            })}
          </div>
        )}
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          © {SITE_NAME}
        </p>
      </footer>
    </main>
  );
}
