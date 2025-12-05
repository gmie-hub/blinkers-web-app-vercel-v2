import Card from "../../../../customs/card/card";
import BusinessDetailsElements from "../../businessElementDetails";
import styles from "./basicInfo.module.scss";
interface BasicInformationProps {
  title?: string;
  name?: JSX.Element | string;
  icon?: JSX.Element;
  businessDetailsData?: AllBusinessesDatum;
}

export default function BasicInformation({
  businessDetailsData,
}: BasicInformationProps) {
  return (
    <div className={styles.wrapper}>
      <section className={styles.border}>
        <Card style={styles.subCard}>
          <BusinessDetailsElements
            title={"Business Name"}
            name={businessDetailsData?.name || "N/A"}
          />
          <BusinessDetailsElements
            title={"Category"}
            name={businessDetailsData?.category?.title || "N/A"}
          />
          <BusinessDetailsElements
            title={"Address"}
            name={businessDetailsData?.address || "N/A"}
          />

          <BusinessDetailsElements
            title={"Phone Number"}
            name={businessDetailsData?.phone || "N/A"}
          />
          <BusinessDetailsElements
            title={"Email Address"}
            name={businessDetailsData?.email || "N/A"}
          />
          <BusinessDetailsElements
            title={"Website"}
            name={businessDetailsData?.website || "N/A"}
          />

          <BusinessDetailsElements
            title={"Whatsapp"}
            name={businessDetailsData?.whatsapp || "N/A"}
          />
          <BusinessDetailsElements
            title={"Instagram"}
            name={businessDetailsData?.instagram || "N/A"}
          />

          <BusinessDetailsElements
            title={"FaceBook"}
            name={businessDetailsData?.facebook || "N/A"}
          />
        </Card>
        <h4 className={styles.ab_title}>About Business</h4>
        <Card style={styles.ab_text}>
          {businessDetailsData?.about || "N/A"}
        </Card>
      </section>
    </div>
  );
}
