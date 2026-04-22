import { FaYoutube, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import DarkModeToggle from "../../components/DarkModeToggle";

export default function page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <DarkModeToggle />

      {/* Background Image */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <video
          src="/IMG_6577.mp4"
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />

        {/* dark overlay so text pops */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Hero Text — bottom left like the reference */}
      <div className="flex flex-col justify-center min-h-screen pb-24 px-8 md:px-16">
        {/* Big headline */}
        <h1
          className="text-6xl md:text-8xl font-bold text-black dark:text-white leading-none mb-6 "
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
            <FaInstagram className="w-5 h-5 text-white" />
          </a>

          {/* X / Twitter */}
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/40 transition"
          >
            <FaXTwitter className="w-5 h-5 text-white" />
          </a>

          {/* YouTube */}
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/40 transition"
          >
            <FaYoutube className="w-5 h-5 text-white" />
          </a>
        </div>
      </div>
    </main>
  );
}
