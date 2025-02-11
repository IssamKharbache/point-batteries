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
  title: "Point Batteries Services Dashboard",
  description:
    "Entreprise de vente de batteries de différentes catégories au Maroc",
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
