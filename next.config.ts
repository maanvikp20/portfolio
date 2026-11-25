import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose"],
  async redirects() {
    return [
      // keep old /resume links working; the file is public/resume.pdf
      { source: "/resume", destination: "/resume.pdf", permanent: false },
    ];
  },
};

export default nextConfig;
