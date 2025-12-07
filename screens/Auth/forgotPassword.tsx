import {
  ErrorMessage,
  Field,
  FieldProps,
  Form,
  Formik,
  FormikValues,
} from "formik";
import styles from "./index.module.scss";
import * as Yup from "yup";
import { App, Image, Tabs, TabsProps } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";
import Card from "@/components/ui/card/card";
import { routes } from "@/lib/routes";
import { errorMessage } from "@/lib/utils/errorMessage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ForgotPasswordCall } from "@/services/authService";

const ForgotPassword = () => {
  const { notification } = App.useApp();
  const router = useRouter();
  const [activeKey, setActiveKey] = useState("1");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const handleNavigateToVerifyOtp = (email: string) => {
    router.push(`/reset-password-verification-code/${email}`);
  };

  const ForgotPasswordMutation = useMutation({
    mutationFn: ForgotPasswordCall,
    mutationKey: ["forgot-password"],
  });

  const ForgotPasswordHandler = async (
    values: FormikValues,
    resetForm: () => void
  ) => {
    try {
      await ForgotPasswordMutation.mutateAsync(
        values.email || values.phoneNumber,
        {
          onSuccess: (data) => {
            notification.success({
              title: "Success",
              description: data?.message,
            });
            const pin =
              data?.data?.pin_id?.length > 4 ? data?.data?.pin_id : "";
            localStorage.setItem("savedPin", pin);

            handleNavigateToVerifyOtp(values?.email || values?.phoneNumber);
            resetForm();
          },
        }
      );
    } catch (error) {
      notification.error({
        title: "Error",
        description: errorMessage(error) || "An error occurred",
      });
    }
  };

  const getValidationSchema = (activeKey: string) => {
    return Yup.object().shape({
      ...(activeKey === "1" && {
        email: Yup.string()
          .required("Email Address is required")
          .email("Invalid email Address"),
      }),
      ...(activeKey === "2" && {
        phoneNumber: Yup.string()
          .required("Phone number is required")
          .matches(/^\d+$/, "Phone number must contain only digits"),
      }),
    });
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Email OTP",
    },
    {
      key: "2",
      label: "Phone Number OTP",
    },
  ];

  const handleTabChange = (key: string, resetForm: () => void) => {
    setActiveKey(key);
    resetForm();
  };

  return (
    <section className={styles.container}>
      <div
        onClick={() => {
          router.push("/");
        }}
        className={styles.smallScreen}
      >
        <Image
          src="/Frame 1618868702.svg"
          alt="Blinkers Logo"
          preview={false}
        />
      </div>

      <Card style={styles.card}>
        <Image src="/Featured icon.svg" alt="Login Icon" preview={false} />
        <p className={styles.welcome}>Forgot Password</p>
        <small>Enter the email address associated with your account</small>

        <Formik
          initialValues={{
            email: "",
            countryCode: "",
            phoneNumber: "",
          }}
          onSubmit={(values, { resetForm }) => {
            ForgotPasswordHandler(values, resetForm);
          }}
          validationSchema={getValidationSchema(activeKey)}
        >
          {({ handleSubmit, resetForm }) => (
            <Form className="fields" onSubmit={handleSubmit}>
              <Tabs
                defaultActiveKey="1"
                onChange={(key) => handleTabChange(key, resetForm)}
                items={items}
              />
              {activeKey === "1" ? (
                <Input
                  name="email"
                  placeholder="jummy@gmail.com"
                  className={styles.inputText}
                />
              ) : (
                <div>
                  {/* <Field name="phoneNumber">
                    {({ field , form }:FieldProps) => (
                      <PhoneInput
                        country={"ng"} // Default country
                        value={field.value} // Directly use Formik field's value
                        onChange={(phoneNumber) =>
                          form.setFieldValue("phoneNumber", phoneNumber)
                        } // Update Formik state
                        inputStyle={{ width: "100%" }}
                        preferredCountries={["ng", "gb", "gh", "cm","lr"]} 
                        onlyCountries={["ng", "gb", "gh", "cm","lr"]} 
                        placeholder="Enter phone numer"

                      />
                    )}
                  </Field> */}
                  <Field
                    name="phoneNumber"
                    render={({ form }: FieldProps) => (
                      <PhoneInput
                        country={"ng"} // Default country
                        value={`${countryCode}${phoneNumber}`} // Concatenate the country code and phone number
                        onChange={(phone: string, country: CountryData) => {
                          const dialCode = country.dialCode; // Extract the dialCode from the country object
                          const number = phone.replace(dialCode, "").trim(); // Remove the dial code from the phone number

                          setCountryCode(dialCode); // Update country code state
                          setPhoneNumber(number); // Update phone number state
                          form.setFieldValue("phoneNumber", number); // Update Formik state
                          form.setFieldValue("country_code", dialCode); // Update Formik country_code field
                        }}
                        inputStyle={{ width: "100%" }}
                        preferredCountries={["ng", "gb", "gh", "cm", "lr"]}
                        onlyCountries={["ng", "gb", "gh", "cm", "lr"]}
                        placeholder="Enter phone numer"
                      />
                    )}
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="error"
                  />
                </div>
              )}

              <Button
                disabled={ForgotPasswordMutation?.isPending}
                type="submit"
                text={
                  ForgotPasswordMutation?.isPending ? "loading..." : "Send Code"
                }
                className={styles.button}
              />
              <div className={styles.footer}>
                <p> Remember Password?</p>

                <Link href={routes.auth.login} className={styles.loginLink}>
                  <p>Log in</p>
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </Card>
    </section>
  );
};

export default ForgotPassword;
