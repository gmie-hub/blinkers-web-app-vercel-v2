import styles from "./relatedAds.module.scss";
import { Image } from "antd";
import { useRouter } from "next/navigation";

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
];

// Main component
const PromotedAds = () => {
  const router = useRouter();

  return (
    <div className="wrapper" style={{ marginBlock: "2rem" }}>
      <div
        // onClick={()=>navigate('/market')}
        onClick={() => router.push("/product-listing")}
        className={styles.back}
      >
        <Image width={9} src="/back.svg" alt="BackIncon" preview={false} />
        <p>Back</p>
      </div>

      <div>
        <div className={styles.promoHead}>
          <p>Related Ads</p>
        </div>

        {/* Display the promo images */}
        <section className={styles.promoImageContainer}>
          {cardData?.map((card) => (
            <div className={styles.promoImage} key={card.id}>
              {card.icon}
              <div className={styles.productList}>
                <p>{card.title}</p>
                <p>{card.location}</p>
                <p>{card.amount}</p>
                {/* <div className={styles.starWrapper}>
                  {countUpTo(
                    card?.rating || 0,
                    <Image
                      width={20}
                      src="/staryellow.svg"
                      alt="StarYellow"
                      preview={false}
                    />,
                    <Image width={20} src="/Vector.svg" alt="Star" preview={false} />
                  )}{" "}
                  <span>(20)</span>
                </div> */}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default PromotedAds;
