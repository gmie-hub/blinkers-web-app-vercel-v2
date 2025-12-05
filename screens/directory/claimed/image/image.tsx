import styles from "./image.module.scss";
import { Image } from "antd";

// Data array
const cardData = [
  {
    id: 1,
    icon: <Image width="100%" src="/Image.svg" alt="cardIcon" preview={false} />,
    title: "Male Packing Shirt",
    location: "Lekki, Lagos",
    amount: "₦40,000",
    rating: 1,
  },
  {
    id: 2,
    icon: <Image width="100%" src="/Image.svg" alt="cardIcon" preview={false} />,
    title: "Male Packing Shirt",
    location: "Lekki, Lagos",
    amount: "₦40,000",
    rating: 2,
  },
  {
    id: 3,
    icon: <Image width="100%" src="/Image (1).svg" alt="cardIcon" preview={false} />,
    title: "Female Packing Shirt",
    location: "Lekki, Lagos",
    amount: "₦40,000",
    rating: 3,
  },
  {
    id: 4,
    icon: <Image width="100%" src="/Image.svg" alt="cardIcon" preview={false} />,
    title: "Male Packing Shirt",
    location: "Lekki, Lagos",
    amount: "₦40,000",
    rating: 5,
  },
  {
    id: 5,
    icon: <Image width="100%" src="/Image.svg" alt="cardIcon" preview={false} />,
    title: "Male Packing Shirt",
    location: "Lekki, Lagos",
    amount: "₦40,000",
    rating: 4,
  },
  // Add more data as needed...
];

// Main component with `limit` prop to control how many data to display
const Images = ({
  limit = cardData.length,
}: {
  limit?: number;
  showHeading?: boolean;
}) => {

  return (
    <div >
      {/* {showHeading && (
        <div onClick={() => handleNavigateToNotClaim()} className={styles.back}>
          <Image width={9} src={BackIncon} alt="BackIncon" preview={false} />
          <p>Back</p>
        </div>
      )} */}

      <div>
        {/* {showHeading && (
          <div className={styles.promoHead}>
            <p>Related Businesses</p>
          </div>
        )} */}

        {/* Display the promo images with the limit applied */}
        <section className={styles.promoImageContainer}>
          {cardData.slice(0, limit).map((card) => (
            <div className={styles.promoImage} key={card.id}>
              {card.icon}
           
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Images;
