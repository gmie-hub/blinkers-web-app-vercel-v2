import styles from "./footer.module.scss";
import { Image } from "antd";

const Foot = () => {
  return (
    <div>
      <section className={styles.section3}>
        <p>© 2024 Blinkers Nigeria. All rights reserved.</p>
        <div className={styles.social}>
          <a
            href="https://x.com/BlinkersN/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/social4.svg" alt="x" preview={false} />
          </a>
          <a
            href="https://www.instagram.com/blinkers_bd/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/social3.svg" alt="instagram" preview={false} />
          </a>

          <a
            href="https://www.facebook.com/blinkersbd/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/social2.svg" alt="facebook" preview={false} />
          </a>
          <a
            href="https://wa.me/message/KOJ2KLTGA6SZO1/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/social1.svg" alt="whatsap" preview={false} />
          </a>
        </div>
      </section>
    </div>
  );
};
export default Foot;
