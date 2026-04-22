import Image from "next/image";
import Background from "../../public/background.webp";

export default function page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <Image
          src={Background}
          alt="Background"
          fill
          className="object-cover"
        />
        {/* dark overlay so text pops */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Text — bottom left like the reference */}
      <div className="flex flex-col justify-center min-h-screen pb-24 px-8 md:px-16">
        {/* Big headline */}
        <h1
          className="text-6xl md:text-8xl font-bold text-white leading-none mb-6"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          welcome to
          <br />
          my portfolio
        </h1>

        {/* Subtitle */}
        <p
          className="text-white/90 text-lg md:text-xl max-w-xl mb-16 leading-relaxed"
          style={{ fontFamily: "var(--font-instrument-serif)" }}
        >
          an electrical engineering student building at the intersection of
          hardware and software.{" "}
          <span className="underline underline-offset-4 cursor-pointer hover:text-gray-300 transition">
            learn more here →
          </span>
        </p>

        {/* Social Icons — centered at bottom */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-6">
          {/* Instagram */}
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/40 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
            </svg>
          </a>
          {/* X / Twitter */}
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/40 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.25 2.25h6.846l4.262 5.632 5.886-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          {/* YouTube */}
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/40 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
}
