import styles from "./aboutUs.module.scss";
import { Image } from "antd";
import Main from "./secondSection.tsx";

import DOMPurify from "dompurify";
import { useCms } from "@/hooks/getCms";
import Aim from "./aim/aims";
import WhyChooseUs from "./whyChooseUs";
import { useEffect, useState } from "react";

interface DescriptionProps {
  description: string;
}

const Description = ({ description }: DescriptionProps) => {
 const [sanitizedDescription, setSanitizedDescription] = useState("");

  useEffect(() => {
    setSanitizedDescription(DOMPurify.sanitize(description));
  }, [description]);

  return (
    <div
      style={{ paddingInlineStart: "1rem" }}
      dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
    />
  );
};

const cardData = [
  {
    id: 1,
    icon: <Image src="/about1.svg" alt="Image1" preview={false} />,
  },
  {
    id: 2,
    icon: <Image src="/about2.svg" alt="Image2" preview={false} />,
  },
  {
    id: 3,
    icon: <Image src="/about3.svg" alt="Image3" preview={false} />,
  },
  {
    id: 4,
    icon: <Image src="/about4.svg" alt="Image4" preview={false} />,
  },
];

const AboutUs = () => {
  const { data } = useCms();

  const cmsItem = data?.data?.data?.find((item: any) => item.id === 27);

  const cmsData = cmsItem?.description || "";
  const cmsDataTitle = cmsItem?.title || "";

  return (
    <div className="wrapper">
      <div className={styles.container}>
        <div
          className={styles.image}
          style={{
            backgroundImage: "url(/Container.svg)",
          }}
        >
          <div className={styles.home}>
            <p className={styles.picHead}>About Us</p>
          </div>
        </div>

        <div className={styles.mainContainer}>
          <div className={styles.leftSection}>
            <h1>{cmsDataTitle}</h1>

            {/* Removed <p> because Description returns a <div> */}
            <Description description={cmsData} />
          </div>

          <div className={styles.rightSection}>
            <div className={styles.cardContainer}>
              {cardData.map((card) => (
                <div key={card.id} className={styles.card}>
                  {card.icon}
                </div>
              ))}
            </div>
          </div>
        </div>

        <Main />
        <WhyChooseUs />
        <Aim />
      </div>
    </div>
  );
};

export default AboutUs;
