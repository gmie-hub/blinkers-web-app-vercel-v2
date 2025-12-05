import { Form, Formik, FormikValues } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { App } from "antd";
import { errorMessage } from "@/lib/utils/errorMessage";
import { changePassword } from "@/services/profileService";
import Input from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";

const ChangePassword = () => {
  const { notification } = App.useApp();

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    mutationKey: ["change-password"],
  });

  const ChangePasswordHandler = async (
    values: FormikValues,
    resetForm: () => void
  ) => {
    const payload: Partial<ChangePassword> = {
      current_password: values?.current_password?.trim(),
      password: values?.password?.trim(),
    };
    try {
      await changePasswordMutation.mutateAsync(payload, {
        onSuccess: (data) => {
          notification.success({
            title: "Success",
            description: data?.message,
          });
          resetForm();
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
    current_password: Yup.string().required("Password is required"),

    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must have a maximum length of 8 characters"),
      confirm_password: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });

  return (
    <Formik
      initialValues={{ newPassword: "", confirmPassword: "" }}
      onSubmit={(values, { resetForm }) => {
        ChangePasswordHandler(values, resetForm);
        console.log(values, 'sekoni')
      }}
      enableReinitialize={true}
      validationSchema={validationSchema}
    >
      {() => (
        <Form className="fields">
          <Input
            name="current_password"
            placeholder="Current Password"
            type="password"
          />
          <Input name="password" placeholder="New Password" type="password" />
          <Input
            name="confirm_password"
            placeholder="Confirm Password"
            type="password"
          />
          <br />
          <Button
          type="submit"
            disabled={changePasswordMutation?.isPending}
            text={changePasswordMutation?.isPending ? "Submitting" : "Submit"}
          />
          <br />
          <br />
            {/* <Button
              type="button"
              text="Delete Account"
              variant="redOutline"
            /> */}
             
        </Form>
      )}
    </Formik>
  );
};

export default ChangePassword;
