"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Image } from "antd";
import styles from "./layout.module.scss";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  const router = useRouter();

  return (
    <main className={styles.container}>
      <section className={styles.leftSide}>
        <div
          onClick={() => router.push("/")}
          className={styles.logoContainer}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") router.push("/");
          }}
        >
          <Image src="/Frame 1618868702.svg" alt="Logo" preview={false} />
        </div>

        <div className={styles.centerContent}>
          <div>
            <Image src="Stars.svg" alt="Stars" preview={false} />
          </div>

          <p className={styles.textFirst}>
            A New Way to Buy, Sell and Connect Across <br /> Borders!
          </p>

          <p className={styles.secondText}>
            Connecting you to a global network of buyers and sellers at your{" "}
            <br /> convenience.
          </p>
        </div>
      </section>

      <section className={styles.rightSide}>{children}</section>
    </main>
  );
}
