import styles from "./contactUs.module.scss";
import { App, Image } from "antd";
import {
  ErrorMessage,
  Field,
  FieldProps,
  Form,
  Formik,
  FormikValues,
} from "formik";
import { useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import PhoneInput from "react-phone-input-2";
import Input from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";
import { errorMessage } from "@/lib/utils/errorMessage";
import { ContactUsApi } from "@/services/contactServices";

const cardData = [
  {
    id: 1,
    icon: (
      <Image
        width="4rem"
        height={"4rem"}
        src="/Icon (5).svg"
        alt="cardIcon"
        preview={false}
      />
    ),
    title: "Send Us An Email",
    para: "support@blinkersnigeria.com",
  },
  {
    id: 2,
    icon: (
      <Image
        width="4rem"
        height={"4rem"}
        src="/Icon (6).svg"
        alt="cardIcon"
        preview={false}
      />
    ),
    title: "Call Us",
    para: "+2348087396478",
  },
  {
    id: 3,
    icon: (
      <Image
        width="4rem"
        height={"4rem"}
        src="/Icon (7).svg"
        alt="cardIcon"
        preview={false}
      />
    ),
    title: "Our Address",
    para: "+18B, Onikepo Akande Street, Off Admiralty way, Lekki Phase 1, Lagos State, Nigeria.",
  },
];

const ContactUs = () => {
  const { notification } = App.useApp();

  const contactUsMutation = useMutation({
    mutationFn: ContactUsApi,
    mutationKey: ["add-fav"],
  });
  const contactUsHandler = async (
    values: FormikValues,
     resetForm : any
  ) => {
  
  // const contactUsHandler = async (values: FormikValues, resetForm) => {
    const payload: Partial<ContactUs> = {
      // id: values?.,
      name: values?.name,
      mobileNum: values?.mobileNum,
      email: values?.email,
      subject: values?.subject,
      message: values?.message,
    };

    try {
      await contactUsMutation.mutateAsync(payload, {
        onSuccess: (data) => {
          notification.success({
            message: "Success",
            title: "",
            description: data?.message,
          });
          
          resetForm()
        },
      });
    } catch (error) {
      notification.error({
        message: "Error",
        title: "",
        description: errorMessage(error) || "An error occurred",
      });
    }
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("required"),
    // mobileNum: Yup.string().required("required"),
    email: Yup.string().required("required"),
    subject: Yup.string().required("required"),
    message: Yup.string().required("required"),
    mobileNum: Yup.string()
      .required("Phone number is required")
      .matches(/^\d+$/, "Phone number must contain only digits"),
  });

  return (
    <div className="wrapper">
      <div className={styles.container}>
        <div
          className={styles.image}
          style={{
            backgroundImage: "url(/Container.svg)", // Ensure you use the correct image reference
          }}
        >
          <div className={styles.home}>
            <p className={styles.picHead}>Contact Us</p>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <p className={styles.title}>We’d Love To Answer All Your Questions</p>
        <div className={styles.mainContainer}>
          <div className={styles.leftSection}>
            <div className={styles.cardContainer}>
              {cardData?.map((item) => (
                <div key={item.id} className={styles.card}>
                  <div className={styles.icon}>{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.para}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.rightSection}>
            <Formik
              initialValues={{
                message: "",
                name: "",
                email: "",
                mobileNum: "",
                subject: "",
              }}
              onSubmit={(values, {resetForm}) => {
                contactUsHandler(values,resetForm);
              }}
              enableReinitialize={true}
              validationSchema={validationSchema}
            >
              <Form>
                <div className={styles.inputContainer}>
                  <Input
                    name="name"
                    placeholder="First name and last name"
                    label="Full Name"
                  />
                </div>
                <div className={styles.inputContainer}>
                  <Input
                    name="email"
                    placeholder="Email Address"
                    label="Email "
                  />
                </div>
             
                <div>
                  <p className="label">Phone Number </p>
                  <Field name="mobileNum">
                    {({ field, form }: FieldProps) => (
                      <PhoneInput
                        country={"ng"} // Default country
                        value={field.value} // Directly use Formik field's value
                        onChange={(mobileNum) =>
                          form.setFieldValue("mobileNum", mobileNum)
                        } // Update Formik state
                        inputStyle={{ width: "100%" }}
                        preferredCountries={["ng", "gb", "gh", "cm", "lr"]}
                        onlyCountries={["ng", "gb", "gh", "cm", "lr"]}
                        placeholder="Enter phone numer"
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="mobileNum"
                    component="div"
                    className="error"
                  />
                </div>
                <div className={styles.inputContainer}>
                  <Input
                    name="subject"
                    label="Subject"
                    placeholder="Subject"
                    className={styles.inputText}
                  />
                </div>
                <div className={styles.inputContainer}>
                  <Input
                    name="message"
                    label="Message"
                    placeholder="Write your message"
                    className={styles.inputText}
                    type="textarea"
                  />
                </div>
                <div className={styles.btn}>
                  <Button type="submit" text="Submit Form" />
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </section>
    </div>
  );
};
export default ContactUs;
