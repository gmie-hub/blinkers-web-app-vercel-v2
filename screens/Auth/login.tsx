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
import { useAtom } from "jotai";
import { useState } from "react";
import "react-phone-input-2/lib/style.css";
import PhoneInput, { CountryData } from "react-phone-input-2";
import { routes } from "@/lib/routes";
import Button from "@/components/ui/button/button";
import Card from "@/components/ui/card/card";
import { userAtom } from "@/lib/utils/store";
import { logout } from "@/lib/utils/logout";
import Input from "@/components/ui/input/input";
import { errorMessage } from "@/lib/utils/errorMessage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoginApiCall } from "@/services/authService";

const Login = () => {
  const router = useRouter();
  const { notification } = App.useApp();
  const [, setUser] = useAtom(userAtom);
  const [activeKey, setActiveKey] = useState("1");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [formData, setFormData] = useState({
  //   email: "",
  //   phoneNumber: "",
  // });
  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get("redirect");

  // const handleNavigateToVerifyOtp = (phoneNumber: string) => {
  //   navigate(`/verification-code/${phoneNumber}`);
  // };
  const handleNavigateToVerifyOtp = (email: string, phoneNumber: string) => {
    router.push(`/verification-code/${email}/${phoneNumber}`);
  };

  // /* eslint-enable react-hooks/exhaustive-deps */
  // useEffect(() => {
  //   if (user?.email && user?.email !== "") {
  //     navigate("/");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user, user?.email]);
  // /* eslint-enable react-hooks/exhaustive-deps */

  //  /* eslint-enable react-hooks/exhaustive-deps */
  //  useEffect(() => {
  //   if (user?.role && (user?.role === '1' || user?.role === '4')) {
  //   //  logout()
  //   navigate("/jobsss");
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user, user?.role]);
  // /* eslint-enable react-hooks/exhaustive-deps */

  const loginMutation = useMutation({
    mutationFn: LoginApiCall,
    mutationKey: ["post-user"],
  });

  const loginHandler = async (data: FormikValues) => {
    const loginUser: LoginPayload = {
      value: data?.email?.trim() || data?.phoneNumber,
      password: data?.password?.trim(),
      device_type: "IPHONE",
      device_id: "73737",
    };

    try {
      await loginMutation.mutateAsync(loginUser, {
        onSuccess: (data) => {
          notification.success({
            title: "Success",
            description: data?.message,
          });
          const pin = data?.data?.pin_id?.length > 4 ? data?.data?.pin_id : "";
          localStorage.setItem("savedPinSignUp", pin);

          const userResponse = {
            ...data, // Spread all matching properties
            // isManageInterestSaved: data?.data?.isManageInterestSaved || false, // Ensure defaults
            // is_applicant: data?.data?.is_applicant || false,
          };

          // Set the user data
          setUser(userResponse?.data);

          // resetForm();
          if (data?.message === "OTP sent, please verify your account.") {
            handleNavigateToVerifyOtp(
              data?.data?.user?.email,
              data?.data?.user?.number
            );
          }
          if (data?.data?.role === "1" || data?.data?.role === "4") {
            notification.success({
              title: "Success",
              description: "admin cant login on client side",
            });
            logout();
          }
          if (
            data?.message !== "OTP sent, please verify your account." &&
            (data?.data?.role !== "1" || data?.data?.role !== "4")
          ) {
            router.push(redirectPath ? redirectPath : "/");
          }
        },
      });
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
      password: Yup.string().required("Password is required"),
    });
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Email Login",
    },
    {
      key: "2",
      label: "Phone Number Login",
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
          src="Frame 1618868702.svg"
          alt={"BlinkersLogo"}
          preview={false}
        />
      </div>

      <Card style={styles.card}>
        <Image src='/Featured icon.svg' alt={'LoginIcon'} preview={false} />

        <p className={styles.welcome}>Welcome Back!</p>
        <small>Enter your details to log in</small>

        <Formik
          initialValues={{
            email: "",
            password: "",
            countryCode: "",
            phoneNumber: "",
          }}
          onSubmit={(values) => {
            loginHandler(values);
            // setFormData({
            //   email: values?.email,
            //   phoneNumber: values?.phoneNumber,
            // });
          }}
          validationSchema={getValidationSchema(activeKey)}
        >
          {({ resetForm }) => {
            // useEffect(() => {
            //   setFormData({
            //     ...formData,
            //     email: values.email,
            //     phoneNumber: values.phoneNumber,
            //   });
            // }, [values.email, values.phoneNumber]);

            return (
              <Form className="fields">
                <Tabs
                  defaultActiveKey="1"
                  // onChange={handleTabChange}
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
                      {({ field, form }: FieldProps) => (
                        <PhoneInput
                          country={"ng"} // Default country
                          value={field.value} // Directly use Formik field's value
                          onChange={(phoneNumber) =>
                            form.setFieldValue("phoneNumber", phoneNumber)
                          } // Update Formik state
                          inputStyle={{ width: "100%" }}
                          preferredCountries={["ng", "gb", "gh", "cm",'lr']} 
                          onlyCountries={["ng", "gb", "gh", "cm",'lr']} 
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

                <Input
                  name="password"
                  placeholder="Input password"
                  type="password"
                  className={styles.inputText}
                />

                <div>
                  <Link
                    className={styles.forgotPassword}
                    href={routes.auth.forgotPassword}
                  >
                    <p> Forgot Password?</p>
                  </Link>
                </div>

                <Button
                  type="submit"
                  text={loginMutation?.isPending ? "Loading..." : "Log In"}
                  disabled={loginMutation?.isPending}
                  className={styles.button}
                />

                <span style={{ display: "flex" }}>
                  Don’t have an account?
                  <Link href="/sign-up" className={styles.signUpLink}>
                    Sign Up
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

export default Login;
