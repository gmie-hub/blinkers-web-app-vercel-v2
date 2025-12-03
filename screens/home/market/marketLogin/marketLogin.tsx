"use client";
import styles from "./styles.module.scss";
import Button from "@/components/ui/button/button";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  handleCloseModal: () => void;
}

const GeneralWelcome = ({ handleCloseModal }: Props) => {
  const router = useRouter();
  const currentPath = usePathname();

  return (
    <div className={styles.container}>
      <img width={"30%"} src="/Logo.svg" alt="BlinkersLogo" />

      <h2 className={styles.title}>Welcome To Blinker</h2>
      <p className={styles.subtitle}>
        Explore the marketplace, job opportunities, discover businesses, and
        connect with the right people all in one place
      </p>

      <div className={styles.noticeBox}>
        <span className={styles.warningIcon}>⚠️</span>

        <p>
          After logging in, you can access our main features from the Top
          navigation bar.
        </p>
      </div>

      <Button
        onClick={() => {
          router.push(`/login?redirect=${currentPath}`);
        }}
        type="button"
      >
        {" "}
        Login
      </Button>
      <br />
      <br />

      <Button variant="greenOutline" onClick={() => router.push("/sign-up")}>
        Sign Up
      </Button>

      <p className={styles.guestLink} onClick={handleCloseModal}>
        Continue As A Guest
      </p>
    </div>
  );
};

export default GeneralWelcome;
