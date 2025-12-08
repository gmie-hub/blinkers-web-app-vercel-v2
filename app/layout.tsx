"use client"

import { Lato } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import Header from "@/components/layouts/header/header";
import Footer from "@/components/layouts/footer/footer";
import Foot from "@/components/layouts/footer/foot";
import QueryProvider from "./providers/QueryProvider";
// import { Metadata } from "next";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
});

// export const metadata: Metadata = {
//   metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://blinkers-web-app-vercel-v2-kxiu.vercel.app/'),
//   // Your other static metadata...
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <QueryProvider>
          <main className={styles.container}>
            <Header />
            <section className={styles.content}>
              <section className={styles.children}>
                <div>{children}</div>
                <Footer />
              </section>
              <Foot />
            </section>
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}
