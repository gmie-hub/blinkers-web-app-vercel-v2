import { Form, Formik, FormikValues } from "formik";
import styles from "../styles.module.scss";
import { FC } from "react";
import { useSetAtom } from "jotai";
import * as Yup from "yup";
import Input from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";
import Checkbox from "@/components/ui/checkBox/checkbox";
import { EducationInfoAtom } from "@/lib/utils/store";
import { convertDate } from "@/lib/utils/formatTime";

interface ComponentProps {
  handleClose: () => void;
  indexData: Education;
  handleSubmit: (values: FormikValues, data: Payload) => void;
  index: number;
}

const EducationModal: FC<ComponentProps> = ({
  handleClose,
  indexData,
  index,
  handleSubmit,
}) => {
  const educationInfoFormData = useSetAtom(EducationInfoAtom);

  console.log(indexData?.studying, indexData?.studying, "indexData?.studying");
  // Initial values are derived directly from `indexData`
  const initialValues = {
    id: indexData?.id || 0,
    institution: indexData?.institution || "",
    degree: indexData?.degree || "",
    field_of_study: indexData?.field_of_study || "",
    // Grade: indexData?.degree || "",
    start_date: convertDate(indexData?.start_date) || "",
    end_date: convertDate(indexData?.end_date) || "",
    studying:
      indexData?.studying && indexData?.studying?.toString() === "1"
        ? true
        : false,
  };

  const validationSchema = Yup.object({
    institution: Yup.string().required("Institution name is required"),
    degree: Yup.string().required("Degree is required"),
    field_of_study: Yup.string().required("Field of study is required"),
    // Grade: Yup.string().required("Grade is required"),
    start_date: Yup.date().required("Start date is required").nullable(),
    end_date: Yup.date().min(Yup.ref("start_date"), "End Date must be after Start Date"),

    // end_date: Yup.date().when('studying', {
    //   is: false,
    //   then: Yup.date().required("End date is required").nullable(),
    // }),
  });

  return (
    <section>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          const currentEducationInfo = JSON.parse(
            localStorage.getItem("education-info") ?? "[]"
          );
          let updatedEducationInfo;

          if (indexData) {
            updatedEducationInfo = currentEducationInfo?.map(
              (item: Education, currIndex: number) =>
                currIndex === index ? { ...item, ...values } : item
            );
            educationInfoFormData(updatedEducationInfo);
          } else {
            const newdata = {
              ...values,
              id: currentEducationInfo.length + 1, // Dynamically set id based on array length
            };
            updatedEducationInfo = [...currentEducationInfo, newdata];
            educationInfoFormData(updatedEducationInfo);
            resetForm();
          }
          // handleSubmit(values, resetForm);
          handleSubmit(values, { Education: updatedEducationInfo });

          resetForm();

          handleClose();
          resetForm();
        }}
        validationSchema={validationSchema} // Attach validation schema
      >
        {({  values }) => (
          <Form>
            <div className={styles.inputContainer}>
              <Input
                name="institution"
                label="Name of Instituition"
                type="text"
              />

              <Input name="degree" label="Degree" type="text" />

              <Input
                label="Field of Study"
                placeholder="What did you study"
                name="field_of_study"
                type="text"
              />

              {/* <Input name="Grade" label="Grade" type="text" /> */}

              <Input
                name="start_date"
                placeholder="Start Date"
                label="Start Date"
                type="date"
              />
              <Input
                name="end_date"
                placeholder="End Date"
                label="End Date"
                type="date"
              />

              <Checkbox
                label="I am still studying"
                name="studying"
                isChecked={values.studying}
              />

              <section className={styles.buttonGroup}>
                <Button
                  variant="white"
                  type="button"
                  onClick={handleClose}
                  text="Cancel"
                  className={styles.btn}
                />
                <Button
                  variant="green"
                  type="submit"
                  disabled={false}
                  text="Save"
                  className={styles.btn}
                />
              </section>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default EducationModal;
