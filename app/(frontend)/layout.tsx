import NavBar from "@/components/frontend/navbar/NavBar";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";
import "swiper/css";
import { AuthProvider } from "@/providers/Providers";
import Footer from "@/components/frontend/footer/Footer";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";

const poppins = Montserrat({
  weight: ["100", "300", "400", "700", "900"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  metadataBase: new URL("https://pointbatteries.com"),
  keywords: [
    "pointbatteries",
    "batteries",
    "vente batteries",
    "batteries maroc",
    "batterie",
    "top vendeur batterie",
  ],
  title: {
    default: "Point Batterie Service",
    template: `%s | Point Batterie Service`,
  },
  openGraph: {
    title: "Point Batterie Service - Vente de Batteries",
    description:
      "Entreprise de vente de batteries de différentes catégories au Maroc.",
    url: "https://pointbatteries.com",
    siteName: "Point Batterie Service",
    images: [
      {
        url: "https://pointbatteries.com/og-image.jpg", // Replace with actual image
        width: 1200,
        height: 630,
        alt: "Point Batterie Service",
      },
    ],
    type: "website",
  },
};

export default function FrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased `}>
        <AuthProvider>
          <NextTopLoader color="#ffffff" height={5} />
          <NavBar />
          <Toaster />
          <main className="flex-grow min-h-[650px] bg-gray-50">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
