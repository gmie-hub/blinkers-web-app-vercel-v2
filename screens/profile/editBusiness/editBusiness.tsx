import { useCallback, useState } from "react";
import { Spin, Steps } from "antd";
import styles from "./editBusiness.module.scss";
// import BasicInfoForm from './basicInfo/basicInfo';
import AddGalleryForm from "./addGallery/addGallery";
import { useQuery } from "@tanstack/react-query";
import RouteIndicator from "../../../customs/routeIndicator";
import Card from "../../../customs/card/card";
import { getBusinessById } from "../../request";
import SocialsCoverPhotoForm from "./socialCoverPhoto/socialCoverPhoto";
import BasicInfoForm from "./basicInfo/basicInfo";
import { useAtomValue } from "jotai";
import { userAtom } from "../../../utils/store";

const EditBusinessForm = () => {
  const [current, setCurrent] = useState(0);
  const user = useAtomValue(userAtom);

  const { Step } = Steps;

  const next = useCallback(() => {
    setCurrent((prev) => prev + 1);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => prev - 1);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["get-business-details"],
    queryFn: () => getBusinessById(user?.business?.id ?? 0),
  });

  const businessDetailsData = data?.data
  console.log(businessDetailsData,'businessDetailsData')

  if (isLoading) {
    return <Spin size="large" />;
  }

  return (
    <div className="wrapper">
      <RouteIndicator showBack={true} />
      <div  style={{ display: "flex", justifyContent: "center" }}>
        <Card style={styles.card}>
          <section className={styles.textContainer}>
            <div>
              <p>Edit business details</p>
            </div>

            <Steps current={current} labelPlacement="vertical" responsive>
              <Step
                title="Basic Information"
                icon={
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background:
                        current >= 0
                          ? "linear-gradient(180deg, #009900 0%, #2fce2f 100%)"
                          : "#e0e0e0",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                    }}
                  >
                    1
                  </div>
                }
              />
              <Step
                title="Socials & Cover Photo"
                icon={
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background:
                        current >= 1
                          ? "linear-gradient(180deg, #009900 0%, #2fce2f 100%)"
                          : "#e0e0e0",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                    }}
                  >
                    2
                  </div>
                }
              />
              <Step
                title="Add Gallery" // The new third step
                icon={
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background:
                        current >= 2
                          ? "linear-gradient(180deg, #009900 0%, #2fce2f 100%)"
                          : "#e0e0e0",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                    }}
                  >
                    3
                  </div>
                }
              />
            </Steps>
          </section>
          {/* Conditionally render the forms based on the current step */}
          {current === 0 && (
            <BasicInfoForm
              businessDetailsData={businessDetailsData}
              handleNext={next}
            />
          )}
          {current === 1 && (
            <SocialsCoverPhotoForm
              businessDetailsData={businessDetailsData}
              onPrev={prev}
              handleNext={next}
            />
          )}
          {current === 2 && (
            <AddGalleryForm
              onPrev={prev}
              businessDetailsData={businessDetailsData}
            />
          )}{" "}
          {/* Add Gallery form */}
        </Card>
      </div>
    </div>
  );
};

export default EditBusinessForm;
