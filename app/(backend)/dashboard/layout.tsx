import { AuthProvider } from "@/providers/Providers";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../../globals.css";
import BackendLayout from "@/components/backend/MainLayout";
import NextTopLoader from "nextjs-toploader";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
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
      "Bienvenue sur Point Batterie Service, votre fournisseur de batteries de qualité au Maroc.",
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
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://pointbatteries.com",
  },
};

export default async function RootBackendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased`}>
        <NextTopLoader />
        <AuthProvider>
          <BackendLayout>{children}</BackendLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
