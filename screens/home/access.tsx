import styles from "./index.module.scss";
import { Image } from "antd";
import Button from "@/components/ui/button/button";

const Access = () => {
  return (
    <div className={styles.accessWrapper}>
      <section className={styles.section1}>
        <div className={styles.rightSection}>
          <Image src="/image 17.svg" alt="Icon" preview={false} />
        </div>

        <div className={styles.leftSection}>
          <h3>Access from Anywhere</h3>
          <p>
            Our platform connects users across borders, providing instant access
            to businesses and products around the world. Communicate directly
            with sellers or businesses, get easy and direct access to the people
            behind the products and services
          </p>
          <Button
            type="button"
            variant="green"
            text="Download App"
            className="buttonStyle"
            onClick={() =>
              window.open(
                "https://onelink.to/32m46u",
                "_blank"
              )
            }
          />
        </div>
      </section>
    </div>
  );
};
export default Access;
