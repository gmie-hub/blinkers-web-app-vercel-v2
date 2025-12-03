"use client"

import { Lato } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";
import Header from "@/components/layouts/header/header";
import Footer from "@/components/layouts/footer/footer";
import Foot from "@/components/layouts/footer/foot";
import QueryProvider from "./providers/QueryProvider";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  style: ["normal", "italic"],
});

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
