import styles from "./styles.module.scss";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/ui/button/button";

interface Props {
  handleCloseModal: () => void;
}

const BusinessDirectoryWelcome = ({ handleCloseModal }: Props) => {
  const router = useRouter();
  // const currentPath = location.pathname;
  const currentPath = usePathname();

  return (
    <div className={styles.container}>
      <img src="/image 33.svg" alt="DirectoryImage" />

      <h2 className={styles.title}>Welcome To Blinkers Business Directory</h2>
      <p className={styles.subtitle}>
        Discover businesses, claim your business, or add a new business to the
        directory.
      </p>

      <div className={styles.noticeBox}>
        <span className={styles.warningIcon}>⚠️</span>

        <p>
          After logging in, you can access the directory portal from this
          directory page from the Top navigation bar.
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

export default BusinessDirectoryWelcome;
