import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import ClientLayout from "@/components/ClientLayout";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_URL, SITE_NAME } from "@/constants/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const homeTitle = "Zaref — Custom Software, Web & Mobile App Development";
const homeDescription =
  "Zaref is a software development company building custom software, web applications, mobile apps, business systems, integrations and automation for businesses and organizations.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: homeTitle,
    template: "%s — Zaref",
  },
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: homeTitle,
    description: homeDescription,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/zaref-icon.png`,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      // The inline script below sets the real data-theme attribute (from localStorage / OS
      // preference) before the browser paints, so it legitimately differs from this JSX
      // default before React hydrates — see node_modules/next/dist/docs/01-app/02-guides/
      // preventing-flash-before-hydration.md ("Themes"). Scoped to this one attribute on
      // <html> only; body/page content is never suppressed.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Runs synchronously during HTML parsing, before first paint — avoids a light/dark
            flash without blocking rendering or requiring a cookie-based theme architecture.
            Same storage key and resolution priority (stored -> OS preference -> light) as
            ThemeContext's own client-side logic; intentionally duplicated here since an inline
            script must be self-contained. No CSP is configured on this project (checked
            next.config.ts), so inline `dangerouslySetInnerHTML` script execution isn't blocked. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=(t==="light"||t==="dark")?t:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",d)}catch(e){}})()`,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          {/* ClientLayout conditionally shows Navbar/Footer — hidden on /admin/*. Both are
              rendered here (in a Server Component) so Footer can fetch settings server-side.
              AuthProvider is intentionally NOT here — admin/layout.tsx provides its own, scoped
              to /admin/*, so firebase/auth never ships in the public site's client bundle. */}
          <ClientLayout navbar={<Navbar />} footer={<Footer />}>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
