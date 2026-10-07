import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { HomeIntroBlockingScript } from "@/components/layout/home-intro-blocking-script";
import "./globals.css";
import "@/styles/home-layout-fixes.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const SITE_TITLE = "Sato";
const SITE_DESCRIPTION = "Comisiones personalizadas y contacto";
const SITE_ICON_PATH = "/works/icoDepagina/icono.ico";

function getMetadataBase(): URL {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL);
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: SITE_ICON_PATH,
    shortcut: SITE_ICON_PATH,
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SITE_ICON_PATH,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_ICON_PATH],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <head>
        <HomeIntroBlockingScript />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
