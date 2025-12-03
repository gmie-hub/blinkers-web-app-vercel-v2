import styles from "./secondSection.tsx/index.module.scss";
import { Image } from "antd";



const cardData = [
  {
    id: 1,
    icon: <Image src='/why3.svg' alt="Image2" preview={false} />,
    title: "For Buyers",
    content:
      "Buyers can instantly connect with multiple sellers, compare offers, and negotiate prices before making a purchase. We also provide timely updates on new products, keeping buyers informed.",
  },
  {
    id: 2,
    icon: <Image src='/why1.svg' alt="Image1" preview={false} />,
    title: "For Sellers",
    content:
      "Sellers can reach a targeted global audience, making it easy to introduce new products, connect with potential buyers, and expand their market reach effectively.",
  },
  {
    id: 3,
    icon: <Image src='/why2.svg' alt="Image2" preview={false} />,
    title: "For Service Providers",
    content:
      "Service providers are listed based on their proximity to potential customers, and our real-time locator shows their location to facilitate seamless connections.",
  },


];
const WhyChooseUs = () => {
  return (
    <div >
  <div className={styles.whyWrapper}>
      <div className={styles.head}>
        <h1>Why Choose Us</h1>
      </div>
      <div className={styles.cardContainer}>
        {cardData?.length &&
          cardData?.map((card) => (
            <div className={styles.chooseCard} key={card.id}>
              <div className={styles.leftSection}>{card.icon}</div>
              <div className={styles.rightSection}>
              <h3>{card.title}</h3>
              <p>{card.content}</p>
              </div>
            
            </div>
          ))}
      </div>
    </div>
    </div>
  
  );
};
export default WhyChooseUs;
