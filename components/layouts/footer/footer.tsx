"use client"

import { routes } from "@/lib/routes";
import styles from "./footer.module.scss";
import { Image } from "antd";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();

  return (
    <main className={styles.footerWrapper}>
      <section className={styles.section1}>
        <div className={styles.leftSection}>
          <h3>Download The App</h3>
          <p>
            Buy, sell and find out about anything using the app on your mobile.
            Whether you're buying or selling, our mobile app gives you instant
            access to a world of opportunities, anytime, anywhere. Get real-time
            updates, manage your listings, and connect with customers
            effortlessly.
          </p>
          <div className={styles.logoWrapper}>
            {/* <div className={styles.logo}>
              <Image src={appleLogo} alt="back" preview={false} />
              <div className={styles.logoPara}>
                <p>Download on the</p>
                <p>Apple Store</p>
              </div>
            </div> */}
            <div
              onClick={() =>
                window.open(
                  "https://apps.apple.com/ng/app/blinkers/id6473721412",
                  "_blank"
                )
              }
            >
              <Image
                style={{ cursor: "pointer" }}
                src="apstore.svg"
                alt="AppStore"
                preview={false}
              />
            </div>
            <div
              onClick={() =>
                window.open(
                  "https://play.google.com/store/apps/details?id=com.app.blinkers",
                  "_blank"
                )
              }
            >
              <Image
                style={{ cursor: "pointer" }}
                src="googleplay.svg"
                alt="GooglePlay"
                preview={false}
              />
            </div>
          </div>
        </div>
        <div className={styles.rightSection}>
          <Image src="/Iphone.svg" alt="Iphone" preview={false} />
        </div>
      </section>
      <section className={styles.section2}>
        <div className={styles.section2Item}>
          <div className={styles.list1}>
            <Image
              className={styles.BlinkersLogo}
              src="/Logo.svg"
              alt="appleStoreIcon"
              preview={false}
            />

            <p>E-mail: blinkersnigeria@gmail.com</p>
            <p>Phone: +2348087396478</p>
            <p>
              Address: 18B, Onikepo Akande street, off Admiralty way, Lekki
              phase 1, Lagos, Nigeria
            </p>
          </div>
        </div>
        <div className={styles.section2Item}>
          <div className={styles.list}>
            <h3 className={styles.title}>Company</h3>
            <p
              onClick={() => {
                router.push("/about-us");
                window.scroll(0, 0);
              }}
            >
              About Us
            </p>
            <p
              onClick={() => {
                router.push("/contact-us");
                window.scroll(0, 0);
              }}
            >
              Contact Us
            </p>
            <p  onClick={()=>{router.push(routes.page.howToBuy) ; window.scroll(0, 0)} }>How to Buy</p>
            <p  onClick={()=>{router.push(routes.page.howToSell) ; window.scroll(0, 0)} }>How to Sell</p>
          </div>
        </div>
        <div className={styles.section2Item}>
          <div className={styles.list}>
            <h3 className={styles.title}>Quick Links</h3>
            <p onClick={()=>{router.push(routes.page.PrivacyPolicy); window.scroll(0, 0)}}  >Privacy Policy</p>
            <p onClick={()=>{router.push(routes.page.terms) ; window.scroll(0, 0)} }>Terms and Conditions</p>
            <p  onClick={()=>{router.push(routes.page.safetyTips) ; window.scroll(0, 0)} }>Safety Tips</p>
            <p
              onClick={() => {
                router.push("/faq");
                window.scroll(0, 0); // Scroll to the top of the page
              }}
            >
              FAQ
            </p>
          </div>
        </div>

        <div className={styles.section2Item}>
          <div className={styles.list2}>
            <p style={{ paddingBlockEnd: "0.5rem" }} className={styles.title}>
              Download Now
            </p>

            <div className={styles.smallsre}>
              <div
                onClick={() =>
                  window.open(
                    "https://apps.apple.com/ng/app/blinkers/id6473721412",
                    "_blank"
                  )
                }
              >
                <Image
                  className={styles.BlinkersLogo}
                  src="app-store.svg"
                  alt="appleStoreIcon"
                  preview={false}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div
                onClick={() =>
                  window.open(
                    "https://play.google.com/store/apps/details?id=com.app.blinkers",
                    "_blank"
                  )
                }
              >
                <Image
                  src="googlestore.svg"
                  alt="GoolgeStoreIcon"
                  preview={false}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default Footer;
