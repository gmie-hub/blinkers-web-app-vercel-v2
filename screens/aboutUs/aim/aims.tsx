import styles from "./aim.module.scss";
import { Image } from "antd";

const aimData = [
  {
    id: 1,
    text: "Provide an accessible marketplace where users can explore products, services, and employment opportunities.",
  },
  {
    id: 2,
    text: "Support businesses by offering a comprehensive directory to boost their visibility.",
  },
  {
    id: 3,
    text: "Facilitate smooth connections between buyers and sellers, and job seekers and employers, all under one platform.",
  },
];

const Aim = () => {
  return (
    <div >
      <div className={styles.mainContainer}>
        <div className={styles.leftSection}>
          <h1>Our Aim Is To:</h1>
          {aimData?.map((item) => (
            <div key={item.id} className={styles.aimItem}>
              <Image height={'3.3rem'}  width={'3.3rem'} src='/iconmark.svg' alt="iconmark" preview={false} />
              <p>{item.text}</p>
            </div>
          ))}
        </div>
        <div className={styles.rightSection}>
        <Image
        src='Group 41349.svg'
        alt="cardIcon"
        preview={false}
      />

        </div>
      </div>
    </div>
  );
};

export default Aim;
