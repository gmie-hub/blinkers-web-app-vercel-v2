import styles from "./subPlan.module.scss";
import { Image } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button/button";
import RouteIndicator from "@/components/ui/routeIndicator";

const items = [
  "Permit business name",
  "10 product advert with 5 images each",
  "10 product advert with 5 images each",
  "10 product advert with 5 images each",
  "10 product advert with 5 images each",
  "Permit business name",
  "10 product advert with 5 images each",
];

const SubPlan = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="wrapper">
      <RouteIndicator showBack />
      {/* Header Section */}

      {/* Card Section */}
      <div className={styles.submittedCard}>
        <div className={styles.header}>
          <h1 className={styles.headerText}>Platinum Plan</h1>
        </div>
        <div className={styles.billing}>
          <Image src="/billing-1.svg" alt="Billing Icon" preview={false} />
          <h2 className={styles.amount}>
            NGN 100,000/ <span className={styles.year}>year</span>
          </h2>

          <ul style={{ listStyle: "none", paddingLeft: "0" }}>
            {items.map((item, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.8rem",
                  color: "var(--color-body-text)",
                }}
              >
                <CheckOutlined
                  style={{ color: "#009900", marginRight: "8px" }}
                />
                {item}
              </li>
            ))}
          </ul>
          <div className={styles.subBtn}>
            <Button
              onClick={() => {
                router.push(`/claim-business/${id}`);
              }}
              text="Subscribe Now"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubPlan;
