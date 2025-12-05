import { Form, Formik, FormikValues } from "formik";
import styles from "./index.module.scss";
import { App, Image } from "antd";
import { useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import Card from "@/components/ui/card/card";
import Input from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";
import { ResetPasswordCall } from "@/services/authService";
import { routes } from "@/lib/routes";
import { errorMessage } from "@/lib/utils/errorMessage";
import { useParams, useRouter } from "next/navigation";

const ResetPassword = () => {
  const { notification } = App.useApp();
  const router = useRouter();
  const params = useParams();
  const email = params.email as string;

  const ResetPasswordMutation = useMutation({
    mutationFn: ResetPasswordCall,
    mutationKey: ["reset-Password"],
  });

  const handleNavigateToVerifyOtp = () => {
    router.push(routes?.auth?.login);
  };

  const resetPasswordHandler = async (values: FormikValues, resetForm: any) => {
    const payload: Partial<ResetPasswordPayload> = {
      email: email!,
      password: values?.password,
      confirm_password: values.confirmPassword,
    };

    try {
      await ResetPasswordMutation.mutateAsync(payload, {
        onSuccess: (data) => {
          notification.success({
            title: "Success",
            description: data?.message,
          });
          handleNavigateToVerifyOtp();

          resetForm(); // Reset the form on success
        },
      });
    } catch (error: any) {
      notification.error({
        title: "Error",
        description: errorMessage(error) || "An error occurred",
      });
    }
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .max(20, "Password must have a maximum length of 20 characters"),
    // .matches(
    //   /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/,
    //   "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character"
    // ),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

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
          alt={"BlinkersLogo"}
          preview={false}
        />
      </div>

      <Card style={styles.card}>
        <Image src="Featured icon.svg" alt={"LoginIcon"} preview={false} />

        <p className={styles.welcome}>Reset Password</p>
        <small>Kindly create a new password </small>

        <Formik
          initialValues={{
            confirmPassword: "",
            password: "",
          }}
          onSubmit={(values, { resetForm }) => {
            resetPasswordHandler(values, resetForm);
            // resetForm();
          }}
          validationSchema={validationSchema}
        >
          {() => {
            return (
              <Form className="fields">
                <div className={styles.inputContainer}>
                  <Input
                    name="password"
                    label="Password"
                    placeholder="Input password"
                    type="password"
                    className={styles.inputText}
                  />
                </div>
                <div className={styles.inputContainer}>
                  <Input
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Re-enter password"
                    type="password"
                    className={styles.inputText}
                  />
                </div>

                <Button
                  disabled={ResetPasswordMutation?.isPending}
                  type="submit"
                  text={
                    ResetPasswordMutation?.isPending
                      ? "loading..."
                      : "Reset Password"
                  }
                  className={styles.button}
                />
              </Form>
            );
          }}
        </Formik>
      </Card>
    </section>
  );
};

export default ResetPassword;
