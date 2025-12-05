import Button from "../../../customs/button/button";
import styles from "./subPlan.module.scss";
import BillingIcon from "../../..//assets/billing 1.svg";
import { Image } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import RouteIndicator from "../../../customs/routeIndicator";

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
  const navigate =useNavigate()
  const { id } = useParams();

  return (
    <div className="wrapper">
      <RouteIndicator showBack/>
      {/* Header Section */}

      {/* Card Section */}
      <div className={styles.submittedCard}>
        <div className={styles.header}>
          <h1 className={styles.headerText}>Platinum Plan</h1>
        </div>
        <div className={styles.billing}>
          <Image src={BillingIcon} alt="Billing Icon" preview={false} />
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
                  color:'var(--color-body-text)'
                }}
              >
                <CheckOutlined style={{ color: "#009900", marginRight: "8px" }} />
                {item}
              </li>
            ))}
          </ul>
          <div className={styles.subBtn}>
            <Button onClick={()=>{navigate(`/claim-business/${id}`)}} text="Subscribe Now" />
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubPlan;
