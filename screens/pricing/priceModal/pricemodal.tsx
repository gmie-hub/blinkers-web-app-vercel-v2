import { App, Modal, Radio } from "antd";
import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { AxiosError } from "axios";
import PaymentMethod from "./paymentMethod";
import Button from "@/components/ui/button/button";
import CustomSpin from "@/components/ui/spin";
import { formatAmount } from "@/lib/utils/formatTime";
import { getAllSubscriptionById } from "@/services/pricingService";

interface Props {
  handleClose: () => void;
  selectedPlan: any;
  handlePaymentSuccess: () => void;
  resetTrigger: boolean;
}

const PricingOptions = ({
  handleClose,
  handlePaymentSuccess,
  selectedPlan,
  resetTrigger,
}: Props) => {
  const [selected, setSelected] = useState<number>();
  const [price, setPrice] = useState<number>(0);
  const [openModal, setOpenModal] = useState(false);
  const { notification } = App.useApp();

  const [getSubQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-all-sub-by-id", selectedPlan],
        queryFn: () => getAllSubscriptionById(selectedPlan),
        retry: 0,
        refetchOnWindowFocus: false,
        enabled: !!selectedPlan,
      },
    ],
  });

  const planData = getSubQuery?.data?.data;
  const planError = getSubQuery?.error as AxiosError;
  const planErrorMessage =
    planError?.message || "An error occurred. Please try again later.";

  // Reset selection on trigger from parent
  useEffect(() => {
    setSelected(undefined);
    setPrice(0);
  }, [resetTrigger]);

  return (
    <>
      {getSubQuery?.isLoading ? (
        <CustomSpin />
      ) : getSubQuery?.isError ? (
        <h1 className="error">{planErrorMessage}</h1>
      ) : (
        <div className={styles.pricingModal}>
          <h3>Select Pricing For {planData?.name} Plan</h3>
          <p className={styles.subtitle}>
            Select the pricing you would like to subscribe to
          </p>

          <Radio.Group
            onChange={(e) => setSelected(e.target.value)}
            value={selected}
            className={styles.radioGroup}
          >
            {planData?.pricings?.map((option) => (
              <div
                key={option.value}
                className={`${styles.optionCard} ${
                  selected === option.id ? styles.active : ""
                }`}
              >
                <Radio
                  value={option.id}
                  className={styles.radio}
                  onClick={() => {
                    setPrice(option?.price);
                    localStorage.setItem(
                      "setPricingId",
                      JSON.stringify(option?.id)
                    );
                  }}
                >
                  <div className={styles.optionText}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "start",
                      }}
                    >
                      <p>
                        {option?.duration}{" "}
                        {option?.duration === 1 ? "Month" : "Months"}
                      </p>
                      <p className={styles.price}>
                        {formatAmount(option?.price)}
                      </p>
                    </div>
                  </div>
                </Radio>
              </div>
            ))}
          </Radio.Group>

          <div className={styles.footerButtons}>
            <Button
              variant="greenOutline"
              onClick={handleClose}
              className={"buttonStyle"}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!selected) {
                  // Modal.warning({
                  //   title: "No Plan Selected",
                  //   content: "Please select a plan before subscribing.",
                  //   centered: true,
                  // });

                  notification.error({
                    title: "No Plan Selected",
                    description: "Please select a plan before subscribing.  ",
                  });
                  return;
                }
                setOpenModal(true);
                handleClose();
              }}
              className={"buttonStyle"}
            >
              Subscribe Now
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          setSelected(undefined);
          setPrice(0);
        }}
        centered
        footer={null}
      >
        <PaymentMethod
          price={price}
          selectedPlan={selectedPlan}
          handleClose={() => {
            setOpenModal(false);
            setSelected(undefined);
            setPrice(0);
          }}
          handlePaymentSuccess={handlePaymentSuccess}
        />
      </Modal>
    </>
  );
};

export default PricingOptions;
