import type { Metadata } from "next";
import { DM_Serif_Text, Poppins } from "next/font/google";
import "../styles/globals.css";

const dmSerifText = DM_Serif_Text({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "easyemAll — Creá y enviá emails con IA",
  description: "Generá correos profesionales en segundos, enviá campañas y gestioná tus contactos sin complicaciones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSerifText.variable} ${poppins.variable}`}>
        {children}
      </body>
    </html>
  );
}
