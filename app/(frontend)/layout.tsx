import NavBar from "@/components/frontend/navbar/NavBar";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";
import "swiper/css";
import { AuthProvider } from "@/providers/Providers";
import Footer from "@/components/frontend/footer/Footer";
import { Toaster } from "@/components/ui/toaster";
import NextTopLoader from "nextjs-toploader";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const montSerrat = Montserrat({
    weight: ["100", "300", "400", "700", "900"],
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
const globalStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Point Batterie Service",
    url: "https://pointbatteries.com",
    description:
        "Votre partenaire de confiance pour la vente de batteries de haute qualité.",
    potentialAction: {
        "@type": "SearchAction",
        target: "https://pointbatteries.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
    },
};

const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Point Batterie Service",
    url: "https://pointbatteries.com",
    logo: "https://pointbatteries.com/logopbsdark.png",
    contactPoint: {
        "@type": "ContactPoint",
        telephone: "+212656307044",
        contactType: "customer service",
    },
};

export default async function FrontLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    return (
        <html lang="en">
            <head>
                {/* Global structured data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(globalStructuredData),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationStructuredData),
                    }}
                />
            </head>
            <body className={`${montSerrat.className} antialiased `}>
                <AuthProvider>
                    <NextTopLoader color="#ffffff" height={5} />
                    <NavBar />
                    <Toaster />
                    <main className="flex-grow min-h-[650px] bg-gray-50 flex flex-col">
                        {children}
                    </main>
                    <Footer username={session?.user.identifiant || ""} />
                </AuthProvider>
            </body>
        </html>
    );
}
