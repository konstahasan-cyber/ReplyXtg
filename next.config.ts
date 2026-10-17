import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

/** `STATIC_EXPORT=true npm run export` produces a plain-HTML build in `out/` (no server needed). */
const staticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  ...(staticExport ? { output: "export" as const, trailingSlash: true } : {}),
  env: { NEXT_PUBLIC_STATIC_EXPORT: staticExport ? "true" : "false" },
  images: {
    unoptimized: staticExport,
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2400],
  },
  async headers() {
    if (staticExport) return [];
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
