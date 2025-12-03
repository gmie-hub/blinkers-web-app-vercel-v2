import { Modal } from "antd";
// import Button from "../../customs/button/button";
import PricingOptions from "./priceModal/pricemodal";
import styles from "./styles.module.scss";
import { CheckCircleFilled } from "@ant-design/icons";
import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Gold from "../../assets/gold.svg";
import Free from "../../assets/Frame 1618872852.svg";
import Platinum from "../../assets/platinum.svg";
import { useAtomValue } from "jotai";
import Button from "@/components/ui/button/button";
import { getAllSubscription } from "@/services/pricingService";
import CustomSpin from "@/components/ui/spin";
import GeneralWelcome from "../home/market/marketLogin/marketLogin";
import ModalContent from "@/components/partials/successModal/modalContent";
import { userAtom } from "@/lib/utils/store";
import { useRouter } from "next/navigation";

const PricingPlansPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const user = useAtomValue(userAtom);

  const router = useRouter();
  const [getAllSubQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-all-sub"],
        queryFn: getAllSubscription,
        retry: 0,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const subData = getAllSubQuery?.data?.data?.data || [];
  const subError = getAllSubQuery?.error as AxiosError;
  const subErrorMessage =
    subError?.message || "An error occurred. Please try again later.";

  const getPlanImage = (name: string) => {
    const planName = name?.toLowerCase();
    if (planName === "gold") return Gold;
    if (planName === "free") return Free;
    return Platinum;
  };

  const resetSelection = () => {
    setResetTrigger((prev) => !prev);
  };
  const selectedPlanFromStorage = JSON.parse(
    localStorage.getItem("setPlan") || "{}"
  );

  return (
    <>
      <main className="wrapper">
        <div className={styles.pricingPage}>
          <div className={styles.para}>
            <h2 className={styles.title}>
              Choose a plan that fits your business needs
            </h2>
            <p className={styles.subtitle}>
              Find the right plan for you. Our flexible plans offer the features
              and support you need to get your business growing
            </p>
          </div>

          {getAllSubQuery?.isLoading ? (
            <CustomSpin />
          ) : getAllSubQuery?.isError ? (
            <h1 className="error">{subErrorMessage}</h1>
          ) : (
            <>

<div className={styles.plansContainer}>
              {/* {[...subData]
                .sort((a, b) => {
                  const order = { free: 0, platinum: 1, gold: 2 };
                  return (
                    order[
                      a?.name?.toLowerCase() as "free" | "platinum" | "gold"
                    ] -
                    order[
                      b?.name?.toLowerCase() as "free" | "platinum" | "gold"
                    ]
                  );
                })
                .map((plan: any, index: number) => ( */}
              {[...subData]
                .filter((plan) => plan?.name?.toLowerCase() !== "free")
                .sort((a, b) => {
                  const order = { platinum: 0, gold: 1 };
                  return (
                    order[a?.name?.toLowerCase() as "platinum" | "gold"] -
                    order[b?.name?.toLowerCase() as "platinum" | "gold"]
                  );
                })
                .map((plan: any, index: number) => (
                  <div
                    className={`${styles.planCard} ${
                      plan.name?.toLowerCase() === "platinum"
                        ? styles.platinumPlan
                        : ""
                    }`}
                    key={index}
                  >
                    <div className={styles.planHeader}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "0.5rem",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={getPlanImage(plan?.name)}
                          alt={`${plan.name} plan`}
                          className={styles.planImage}
                        />
                        <h3 className={styles.planTitle}>
                          {plan.name?.charAt(0).toUpperCase() +
                            plan.name?.slice(1)}{" "}
                          Plan{" "}
                        </h3>
                      </div>

                      <p className={styles.planPrice}>
                        From N
                        {Math.min(
                          ...(plan?.pricings?.map((item: any) => item.price) ||
                            [])
                        )}
                      </p>

                      {plan.name?.toLowerCase() !== "free" && (
                        <Button
                          variant="green"
                          type="submit"
                          text={"Choose Plan"}
                          className={styles.chooseButton}
                          onClick={() => {
                            if (!user) {
                              setOpenLoginModal(true);
                            } else {
                              localStorage.setItem(
                                "setPlan",
                                JSON.stringify(plan?.name)
                              );

                              setSelectedPlan(plan?.id);
                              setOpenModal(true);
                            }
                          }}
                        />
                      )}
                    </div>

                    <div className={styles.planBody}>
                      <h4 className={styles.featureTitle}>{"What's included"}</h4>
                      <ul className={styles.featureList}>
                        {plan?.features?.map((feature: any, idx: number) => (
                          <li key={idx} className={styles.featureItem}>
                            <CheckCircleFilled className={styles.icon} />{" "}
                            {feature?.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
            </div>
            <br /><br />
                  <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="white"
                    type="submit"
                    text={"Choose Free Plan"}
                    className={"buttonStyle"}
                    onClick={() => {
                      router.push("/create-ad");
                      // navigate("/profile");
                      // localStorage.setItem("activeTabKeyProfile", "3");
                      window.scrollTo(0, 0);
                    }}
                  />
                </div>

            </>
       
            
          )}
        </div>

   
      </main>

      <Modal
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          setSelectedPlan(null);
          resetSelection();
        }}
        centered
        footer={null}
      >
        <PricingOptions
          selectedPlan={selectedPlan}
          handleClose={() => {
            setOpenModal(false);
            setSelectedPlan(null);
            resetSelection();
          }}
          handlePaymentSuccess={() => setOpenSuccess(true)}
          resetTrigger={resetTrigger}
        />
      </Modal>

      <ModalContent
        open={openSuccess}
        handleCancel={() => setOpenSuccess(false)}
        handleClick={() => {
          setOpenSuccess(false);
          router.push("/profile");
          localStorage.setItem("activeTabKeyProfile", "3");
        }}
        text={`You've successfully activated the ${selectedPlanFromStorage} Plan.`}
      />

      <Modal
        open={openLoginModal}
        onCancel={() => setOpenLoginModal(false)}
        centered
        footer={null}
      >
        <GeneralWelcome handleCloseModal={() => setOpenLoginModal(false)} />
      </Modal>
    </>
  );
};

export default PricingPlansPage;
