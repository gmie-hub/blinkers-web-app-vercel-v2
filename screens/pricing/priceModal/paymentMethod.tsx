/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, Radio } from "antd";
import styles from "./styles.module.scss";
import { useState } from "react";
import { useMutation, useQueries } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { PaystackButton } from "react-paystack";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";
import { useAtomValue } from "jotai";
import Button from "@/components/ui/button/button";
import api from "@/lib/utils/apiClient";
import { userAtom } from "@/lib/utils/store";
import CustomSpin from "@/components/ui/spin";
import { getAllSubscriptionById } from "@/services/pricingService";
import { errorMessage } from "@/lib/utils/errorMessage";
import btnStyles from "@/components/ui/button/button.module.scss";

interface Props {
  handleClose: () => void;
  selectedPlan: any;
  price: number;
  handlePaymentSuccess: () => void;
}

interface VerifyPayload {
  reference: string;
  gateway: string;
  pricing_id: number;
}

const PAYSTACK = "Paystack";
const FLUTTERWAVE = "Flutterwave";

const PaymentMethod = ({
  handleClose,
  handlePaymentSuccess,
  selectedPlan,
  price,
}: Props) => {
  const [selected, setSelected] = useState(PAYSTACK);

  const userInfo = useAtomValue(userAtom);

  const { notification } = App.useApp();
  const [txRef] = useState(() => Date.now().toString());

  const postVerifyPayment = async (payload: VerifyPayload) => {
    return (await api.post("payments/verify", payload)).data;
  };

  const verifyPaymentMutation = useMutation({
    mutationKey: ["verifyPayment"],
    mutationFn: postVerifyPayment,
  });

  const selectedPrincingFromStorage = JSON.parse(
    localStorage.getItem("setPricingId") || "{}"
  );

  const verifyPaymentHandler = async (reference: string) => {
    const payload: VerifyPayload = {
      reference,
      gateway: selected?.toUpperCase(),
      pricing_id: selectedPrincingFromStorage,
    };

    try {
      await verifyPaymentMutation.mutateAsync(payload, {
        onSuccess: (data) => {
          notification.success({
            title: "Success",
            description: data?.message,
          });
        },
      });
    } catch (error) {
      notification.error({
        title: "Error",
        description: errorMessage(error) || "An error occurred",
      });
    }
  };

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!;
  //  import.meta.env.NEXT_PAYSTACK_PUBLIC_KEY;
  const amount = price * 100;
  const email = userInfo?.email ?? "";

  const componentProps = {
    email,
    amount,
    publicKey,
    text: "Proceed",
    onSuccess: (data: any) => {
      handlePaymentSuccess();
      handleClose();

      verifyPaymentHandler(data?.reference);
    },
    onClose: () => {},
  };

  const config = {
    // public_key: import.meta.env.NEXT_PAYSTACK_PUBLIC_KEY,
    public_key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    // tx_ref: Date.now().toString(),
    tx_ref: txRef,
    amount: price,
    currency: "NGN",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email,
      phone_number: userInfo?.number || "",
      name: userInfo?.name || "",
    },
    customizations: {
      title: "Payment for Subscription",
      description: "Payment for Subscription",
      logo: "",
    },
  };

  const fwConfig = {
    ...config,
    text: "Proceed",
    callback: (response: any) => {
      console.log(response);
      closePaymentModal();
      handlePaymentSuccess();
      handleClose();

      verifyPaymentHandler(response?.transaction_id);
    },
    onClose: () => {},
  };

  const options = [{ label: "Paystack" }, { label: "Flutterwave" }];

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

  const planError = getSubQuery?.error as AxiosError;
  const planErrorMessage =
    planError?.message || "An error occurred. Please try again later.";

  return (
    <>
      {getSubQuery?.isLoading ? (
        <CustomSpin />
      ) : getSubQuery?.isError ? (
        <h1 className="error">{planErrorMessage}</h1>
      ) : (
        <div className={styles.pricingModal}>
          <h3>Select Payment Method</h3>

          <Radio.Group
            onChange={(e) => setSelected(e.target.value)}
            value={selected}
            className={styles.radioGroup}
          >
            {options?.map((option) => (
              <div
                key={option?.label}
                className={`${styles.optionCard} ${
                  selected === option.label ? styles.active : ""
                }`}
              >
                <Radio value={option.label} className={styles.radio}>
                  <div className={styles.optionText}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "start",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <p>{option?.label}</p>
                      </div>
                    </div>
                  </div>
                </Radio>
                <img src="arrow-right-noty.svg" alt="ArrowIcon" />
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
            {/* <Button className={"buttonStyle"}>Proceed</Button> */}

            {selected === PAYSTACK && (
              <PaystackButton className={btnStyles.green} {...componentProps} />
            )}

            {selected === FLUTTERWAVE && (
              <FlutterWaveButton className={btnStyles.green} {...fwConfig} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PaymentMethod;
