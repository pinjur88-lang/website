import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { LanguageProvider } from "@/lib/language-context";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#0ea5e9",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Udruga Građana Baljci",
    template: "%s | Baljci",
  },
  description: "Udruga za očuvanje kulturne baštine, zaštitu okoliša i povratak u selo Baljci. Otkrijte naše korijene i gradimo budućnost zajedno.",
  metadataBase: new URL("https://www.baljci.com"),
  keywords: ["Baljci", "Drniš", "Dalmacija", "Kulturna baština", "Obnova", "Udruga Baljci"],
  authors: [{ name: "Udruga Građana Baljci" }],
  openGraph: {
    title: "Udruga Građana Baljci",
    description: "Zajedno gradimo bolju budućnost za naše selo i zajednicu. Pridružite nam se u očuvanju tradicije i unapređenju života u Baljcima.",
    url: "https://www.baljci.com",
    siteName: "Baljci.com",
    locale: "hr_HR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Udruga Građana Baljci",
    description: "Očuvajmo tradiciju i gradimo budućnost sela Baljci.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hr">
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
