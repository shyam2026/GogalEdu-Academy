"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function RootLayout({ children }) {
  const pathname = usePathname();

  const isLinksPage = pathname?.startsWith("/links");

  return (
    <html lang="en">
      <body>

        {!isLinksPage && <Navbar />}

        {children}

        {!isLinksPage && <Footer />}

      </body>
    </html>
  );
}