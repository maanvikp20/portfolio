import { FaYoutube, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import DarkModeToggle from "@/src/components/ui/DarkModeToggle";

export default function Page() {
  return (
    <main
      className="relative min-h-screen overflow-hidden 
                 [--text-primary:#ffffff] [--text-secondary:rgba(255,255,255,0.75)] [--overlay-color:0,0,0] [--overlay-opacity:0.5]
                 dark:[--text-primary:#000000] dark:[--text-secondary:rgba(0,0,0,0.75)] dark:[--overlay-color:255,255,255] dark:[--overlay-opacity:0.3]"
    >
      {/* Background Video */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <video
          src="/IMG_6577.mp4"
          className="w-full h-full object-cover"
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
          className="text-lg md:text-xl max-w-xl mb-16 leading-relaxed transition-colors duration-300"
          style={{
            fontFamily: "var(--font-instrument-serif)",
            color: "var(--text-secondary)",
          }}
        >
          an electrical engineering student building at the intersection of{" "}
          hardware and software.{" "}
          <a
            href="/portfolio"
            className="underline underline-offset-4 cursor-pointer hover:opacity-70 transition"
          >
            learn more here →
          </a>
        </p>

        {/* Social Icons */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-6">
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/40 transition"
          >
            <FaInstagram
              className="w-5 h-5 transition-colors duration-300"
              style={{ color: "var(--text-primary)" }}
            />
          </a>
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/40 transition"
          >
            <FaXTwitter
              className="w-5 h-5 transition-colors duration-300"
              style={{ color: "var(--text-primary)" }}
            />
          </a>
          <a
            href="#"
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/40 transition"
          >
            <FaYoutube
              className="w-5 h-5 transition-colors duration-300"
              style={{ color: "var(--text-primary)" }}
            />
          </a>
        </div>
      </div>
    </main>
  );
}
