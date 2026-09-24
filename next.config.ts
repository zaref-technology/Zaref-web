import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      // /portfolio/{id} is intentionally NOT listed here — it needs a dynamic Firestore lookup
      // (id -> slug) that next.config redirects can't perform; that's handled by the kept
      // app/portfolio/[id]/page.tsx route instead, so there's no double-redirect chain.
      { source: "/portfolio", destination: "/work", permanent: true },
      { source: "/about", destination: "/company", permanent: true },
    ];
  },
  async rewrites() {
    return {
      // A Firestore document ID (20 alphanumeric chars, never contains a hyphen like a real
      // slug does) under /work is handed to the legacy ID→slug redirect handler, which issues a
      // single 308 to /work/{slug} for published projects and a 404 otherwise.
      beforeFiles: [{ source: "/work/:id([A-Za-z0-9]{20})", destination: "/portfolio/:id" }],
    };
  },
  async headers() {
    return [
      // Belt-and-braces with the metadata in app/admin/layout.tsx: never indexable, even if a
      // crawler ignores robots.txt.
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
