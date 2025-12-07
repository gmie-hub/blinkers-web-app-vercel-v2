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
import { App, Image } from "antd";
import { useMutation } from "@tanstack/react-query";
import PhoneInput from "react-phone-input-2";
import { useEffect, useState } from "react";
import { CountryData } from "react-phone-input-2"; // Import the CountryData type
import Card from "@/components/ui/card/card";
import Input from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SignUpCall } from "@/services/authService";
import { errorMessage } from "@/lib/utils/errorMessage";
// import ReCAPTCHA from "react-google-recaptcha";
// import ReCAPTCHA from "react-google-recaptcha";

const SignUp = () => {
  const { notification } = App.useApp();
  const router = useRouter();
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.href.split("?").pop() || "");
      setReferralCode(params.get("referral_code"));
    }
  }, []);
  // const [recaptchaToken, setRecaptchaToken] = useState(""); // State for reCAPTCHA
  // const recaptchaRef = useRef<ReCAPTCHA | null>(null); // Reference for reCAPTCHA

  const SignUpMutation = useMutation({
    mutationFn: SignUpCall,
    mutationKey: ["sign-up"],
  });

  const handleNavigateToVerifyOtp = (email: string, phoneNumber: string) => {
    router.push(`/verification-code/${email}/${phoneNumber}`);
  };

  const SignUpHandler = async (values: FormikValues, resetForm: () => void) => {
    // if (!recaptchaToken) {
    //   notification.error({
    //     message: "Error",
    //     description: "Please verify the reCAPTCHA.",
    //   });
    //   return;
    // }

    const payload: Partial<signUp> = {
      name: values?.name,
      country_code: countryCode, // Use the updated country code
      number: values.phoneNumber,
      address: values.address,
      address_lat: values.address,
      address_long: values?.address,
      email: values?.email,
      password: values?.password,
      confirm_password: values.confirm_password,
      register_method: "WEB",
      ...(referralCode && { referral_code: referralCode }),
      ...(values?.referralCode && { referral_code: values?.referralCode }),

    };

    try {
      await SignUpMutation.mutateAsync(payload, {
        onSuccess: (data) => {
          notification.success({
            title: "Success",
            description: data?.message,
          });
          const pin = data?.data?.pin_id?.length > 4 ? data?.data?.pin_id : "";

          handleNavigateToVerifyOtp(
            values?.email,
            countryCode + values?.phoneNumber
          );
          localStorage.setItem("savedPinSignUp", pin);

          resetForm(); // Reset the form on success
          // (recaptchaRef.current as unknown as { reset: () => void })?.reset();
        },
      });
    } catch (error) {
      notification.error({
        title: "Error",
        description: errorMessage(error) || "An error occurred",
      });
    }
  };

  const validationSchema = Yup.object().shape({
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^\d+$/, "Phone number must contain only digits"),

    address: Yup.string().required("required"),
    name: Yup.string().required("required"),
    email: Yup.string()
      .required("Email Address is required")
      .email("Invalid email Address"),
    password: Yup.string()
      .required("Password is required")
      .max(20, "Password must have a maximum length of 20 characters"),
    confirm_password: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  // const handleRecaptcha = (token: string | null) => {
  //   setRecaptchaToken(token!);
  // };



  return (
    <section className={styles.container}>
      <div
        onClick={() => {
          router.push("/");
        }}
        className={styles.smallScreen}
      >
        <Image src={'/Frame 1618868702.svg'} alt={'BlinkersLogo'} preview={false} />
      </div>

      <Card style={styles.card}>
        <Image src="Featured icon.svg" alt={'LoginIcon'} preview={false} />

        <p className={styles.welcome}>Sign Up</p>
        <small></small>

        <Formik
          initialValues={{
            name: "",
            country_code: "",
            phoneNumber: "",
            address: "",
            address_lat: "",
            address_long: "",
            email: "",
            password: "",
            confirm_password: "",
            referralCode: "",
          }}
          onSubmit={(values, { resetForm }) => {
            SignUpHandler(values, resetForm);
            // resetForm();
            console.log(values);
          }}
          validationSchema={validationSchema}
        >
          {() => {
            return (
              <Form className="fields">
                <Input name="name" label="Name" className={styles.inputText} />

                <div style={{ marginBlockStart: "2rem" }}>
                  <p className="label">Phone Number</p>

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

                <Input
                  name="email"
                  label="Email Address"
                  placeholder="jummy@gmail.com"
                  className={styles.inputText}
                />

                <Input
                  name="address"
                  label="Address"
                  placeholder="Address"
                  className={styles.inputText}
                />

                <Input
                  name="referralCode"
                  label="Referral Code"
                  placeholder="Referral Code"
                  className={styles.inputText}
                />
                <Input
                  name="password"
                  label="Password"
                  placeholder="Input password"
                  type="password"
                  className={styles.inputText}
                />
                <Input
                  name="confirm_password"
                  label="Confirm Password"
                  placeholder="Confirm password"
                  type="password"
                  className={styles.inputText}
                />
                {/* <br /> */}

                {/* <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY } // Replace with your Site Key
                  // onChange={(token: string) => setRecaptchaToken(token || "")}
                  onChange={handleRecaptcha}
                /> */}

                <Button
                  disabled={SignUpMutation?.isPending}
                  text={SignUpMutation?.isPending ? "Submitting..." : "Submit"}
                  type="submit"
                  className={styles.button}
                />

                <span style={{ display: "flex" }}>
                  Already have an account?
                  <Link href="/login" className={styles.signUpLink}>
                    Sign In
                  </Link>
                </span>
              </Form>
            );
          }}
        </Formik>
      </Card>
    </section>
  );
};

export default SignUp;
