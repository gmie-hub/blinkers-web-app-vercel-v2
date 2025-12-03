import { Form, Formik, FormikValues } from "formik";
import styles from "../styles.module.scss";
import { FC } from "react";
import * as Yup from "yup";
import {useSetAtom } from "jotai";
import Input from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";
import Checkbox from "@/components/ui/checkBox/checkbox";
import { EmploymentHistoryInfoAtom } from "@/lib/utils/store";
import { convertDate } from "@/lib/utils/formatTime";
import Select from "@/components/ui/select/select";
import { employmentTypeData, jobTypeData } from "@/services/jobServices";

interface ComponentProps {
  handleClose: () => void;
  indexData: EmploymentHistory;
  handleSubmit: (values: FormikValues, data: Payload) => void;
  index: number;

}

const EmpHistory: FC<ComponentProps> = ({
  handleClose,
  indexData,
  index,
  handleSubmit,
}) => {
  const employementHistoryData = useSetAtom(EmploymentHistoryInfoAtom);


  const validationSchema = Yup.object().shape({
    job_title: Yup.string().required("Job Title is required"),
    job_type: Yup.string().required("Job Type is required"),
    company_name: Yup.string().required("Company Name is required"),
    location: Yup.string().required("Location is required"),
    employment_type: Yup.string().required("Work Arrangement is required"),
    start_date: Yup.date()
      .required("Start Date is required")
      .max(new Date(), "Start Date cannot be in the future"),
    end_date: Yup.date().min(Yup.ref("start_date"), "End Date must be after Start Date"),
    //   .nullable()
    //   .when("current_work", {
    //     is: false, // Only validate `end_date` if `current_work` is false
    //     then: Yup.date()
    //       .required("End Date is required")
    //       .min(Yup.ref("start_date"), "End Date must be after Start Date"),
    //   }),
    summary: Yup.string()
      .required("Work Summary is required")
      .max(2000, "Work Summary cannot exceed 2000 characters"),

      current_work: Yup.boolean(),
  });

  const jobTypeOptions: any =
    jobTypeData &&
    jobTypeData?.length > 0 &&
    jobTypeData?.map((item: any, index: number) => (
      <option value={item?.value} key={index}>
        {item?.name}
      </option>
    ));

  const employmentTypeOptions: any =
    employmentTypeData &&
    employmentTypeData?.length > 0 &&
    employmentTypeData?.map((item: any, index: number) => (
      <option value={item?.value} key={index}>
        {item?.name}
      </option>
    ));

    console.log(indexData?.summary,'indexData?.summary')
  return (
    <section>
      <Formik
        initialValues={{
          
          id: indexData?.id || 0,
          job_title: indexData?.job_title || "",
          job_type: indexData?.job_type || "",
          company_name: indexData?.company_name || "",
          location: indexData?.location || "",
          start_date: convertDate(indexData?.start_date) || "",
          end_date: convertDate(indexData?.end_date) || "",
          employment_type: indexData?.employment_type || "",
          summary:indexData?.summary  && indexData?.summary || "",
          current_work:
            indexData?.current_work && indexData?.current_work?.toString() === "1"
              ? true
              : false,
        }}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          const currentEmpHistoryInfo = JSON.parse(
            localStorage.getItem("employment-History") ?? "[]"
          );
          let updatedEmpInfo;

          if (indexData) {
            updatedEmpInfo = currentEmpHistoryInfo?.map(
              (item: EmploymentHistory,currIndex: number) =>
                currIndex === index
                  ? { ...item, ...values }
                  : item
            );
            employementHistoryData(updatedEmpInfo);
          } else {
            const newdata = {
              ...values,
              id: currentEmpHistoryInfo.length + 1,
            };
             updatedEmpInfo = [...currentEmpHistoryInfo, newdata];
            employementHistoryData(updatedEmpInfo);
          }

          handleSubmit(values, { EmpHistory: updatedEmpInfo });
          resetForm();

          handleClose();
          resetForm();
        }}
        validationSchema={validationSchema}
      >
        {({ values,  handleChange }) => {
          return (
            <Form>
              <div className={styles.inputContainer}>
                <Input
                  name="job_title"
                  label="Job Title"
                  placeholder="Job Title"
                  type="text"
                />

                {/* <Input
                  name="job_type"
                  label="Job Type"
                  placeholder="Job Type"
                  type="text"
                /> */}
                <Select
                  name="job_type"
                  label="Job Type"
                  placeholder="Select Job Type"
                  options={jobTypeOptions}
                  onChange={handleChange}
                />

                <Input
                  label="Company Name"
                  placeholder="Name of company "
                  name="company_name"
                  type="text"
                />
                <Input
                  label="Location"
                  placeholder="Enter Location"
                  name="location"
                  type="text"
                />

                <Select
                  name="employment_type"
                  label="Work Arrangement"
                  placeholder=" Select Work Arrangement"
                  options={employmentTypeOptions}
                  onChange={handleChange}
                />
                {/* <Input
                  label="Work Arrangement"
                  placeholder="Work Arrangement"
                  name="employment_type"
                  type="text"
                /> */}

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

                <Input
                  name="summary"
                  label="Work Summary"
                  type="textarea"
                  placeholder="Write your day to day activities"
                />
                <div style={{ display: "flex", justifyContent: "end" }}>
                  <p>0/2000</p>
                </div>

             

                <Checkbox
                  label="Current work"
                  name="current_work"
                  isChecked={values.current_work}
                />

                <section className={styles.buttonGroup}>
                  <Button
                    variant="white"
                    type="submit"
                    disabled={false}
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
          );
        }}
      </Formik>
    </section>
  );
};

export default EmpHistory;
