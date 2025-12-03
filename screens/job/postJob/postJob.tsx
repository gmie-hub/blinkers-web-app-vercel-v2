import { Form, Formik, FormikValues } from "formik";
import styles from "./postJob.module.scss";
import { App, Switch } from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { routes } from "../../../routes";
import Card from "../../../customs/card/card";
import Input from "../../../customs/input/input";
import Select from "../../../customs/select/select";
import Button from "../../../customs/button/button";
import ModalContent from "../../../partials/successModal/modalContent";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import {
  CreateJob,
  employmentTypeData,
  getAllState,
  getIndustries,
  getJobDetails,
  jobTypeData,
  LevelData,
  UpdateJob,
} from "../../request";
import RouteIndicator from "../../../customs/routeIndicator";
import { userAtom } from "../../../utils/store";
import { useAtomValue } from "jotai";
import { errorMessage } from "../../../utils/errorMessage";
import SearchableSelect from "../../../customs/searchableSelect/searchableSelect";

export default function PostJobs() {
  const navigate = useNavigate();
  const [openSuccess, setOpenSuccess] = useState(false);
  const user = useAtomValue(userAtom);
  const [editSuccess, setEditSuccess] = useState(false);
  const { notification } = App.useApp();
  const queryClient = useQueryClient();
  const { id } = useParams();

  const handleSucessEdit = () => {
    setEditSuccess(false);
    navigate(-1);
  };

  const [getJobDetailsQuery, getAllIndustriesQuery, getStateQuery] = useQueries(
    {
      queries: [
        {
          queryKey: ["get-jobs-details"],
          queryFn: () => getJobDetails(parseInt(id!)),
          retry: 0,
          refetchOnWindowFocus: false,
          enabled: !!id,
        },
        {
          queryKey: ["get-all-industries"],
          queryFn: () => getIndustries(),
          retry: 0,
          refetchOnWindowFocus: false,
        },
        {
          queryKey: ["get-all-state"],
          queryFn: getAllState,
          retry: 0,
          refetchOnWindowFocus: true,
        },
      ],
    }
  );

  const JobDetailsData = getJobDetailsQuery?.data?.data;
  const stateData = getStateQuery?.data?.data?.data ?? [];

  const industryData = getAllIndustriesQuery?.data?.data?.data || [];

  const allIndustriesOptions: { value: string; label: string }[] = [
    { value: 0, label: "Select Industry" },
    ...(industryData?.length > 0
      ? industryData?.map((item: IndustriesDatum) => ({
          value: item?.id?.toString(),
          label: item?.name,
        }))
      : []),
  ];
  const stateOptions: { value: string; label: string }[] = [
    { value: "", label: "Select State" }, // Default option
    ...(Array.isArray(stateData) && stateData.length > 0
      ? stateData.map((item: StateDatum) => ({
          value: item?.state_name ?? 0, // Fallback to 0 if undefined
          label: item?.state_name ?? "Unknown State", // Fallback to a default label
        }))
      : []),
  ];

  const createJobMutation = useMutation({
    mutationFn: CreateJob,
    mutationKey: ["create-jobs"],
  });
  const CreateJobHandler = async (
    values: FormikValues,
    resetForm: () => void
  ) => {
    const payload: Partial<JobDatum> = {
      title: values?.title,
      // business_id: values?.business_id,
      business_id: user?.business?.id,
      status: values?.status,
      employment_type: values?.employment_type,
      job_type: values?.job_type,
      level: values?.level,
      industry_id: values?.industry,
      is_admin: true,
      location: values?.location,
      description: values?.description,
      responsibilities: values?.responsibilities,
      qualifications: values?.qualifications,
      benefits: values?.benefits,
      start_date: values?.start_date || "",
      end_date: values?.end_date || "",
      renumeration: values?.salary,
    };

    try {
      await createJobMutation.mutateAsync(payload, {
        onSuccess: () => {
          // notification.success({
          //   message: 'Success',
          //   description: data?.message,
          // });
          queryClient.refetchQueries({
            queryKey: ["get-all-jobs"],
          });
          resetForm();
          setOpenSuccess(true);
          // resetForm();
          navigate(routes?.job.job);
        },
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: errorMessage(error) || "An error occurred",
      });
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Job title is required"),
    start_date: Yup.date()
      .required("Start date is required")
      .min(today, "Start date cannot be in the past"),
    employment_type: Yup.string().required("Employment type is required"),
    job_type: Yup.string().required("Job type is required"),
    level: Yup.string().required("Job level is required"),
    end_date: Yup.date()
      .required("required")
      .min(Yup.ref("start_date"), "End Date cannot be before Start Date"),
  });

  const employmentTypeOptions: any =
    employmentTypeData &&
    employmentTypeData?.length > 0 &&
    employmentTypeData?.map((item: any, index: number) => (
      <option value={item?.value} key={index}>
        {item?.name}
      </option>
    ));

  const jobTypeOptions: any =
    jobTypeData &&
    jobTypeData?.length > 0 &&
    jobTypeData?.map((item: any, index: number) => (
      <option value={item?.value} key={index}>
        {item?.name}
      </option>
    ));

  const LevelOptions: any =
    LevelData &&
    LevelData?.length > 0 &&
    LevelData?.map((item: any, index: number) => (
      <option value={item?.value} key={index}>
        {item?.name}
      </option>
    ));

  //   const handleSucessEdit = () => {
  //     setEditSuccess(false);
  //     navigate(routes?.jobs?.jobs);
  //   };
  const handleSucessPost = () => {
    setOpenSuccess(false);
    navigate(routes?.job?.job);
  };

  const editJobMutation = useMutation({
    mutationFn: UpdateJob,
    mutationKey: ["edit-jobs"],
  });
  const EditJobHandler = async (values: FormikValues) => {
    const payload: Partial<JobDatum> = {
      id: parseInt(id!) ?? 0,
      title: values?.title,
      business_id: values?.business_id,
      status: values?.accepting_applications === false ? "0" : "1",
      employment_type: values?.employment_type,
      job_type: values?.job_type,
      level: values?.level,
      industry_id: values?.industry,
      is_admin: values?.business_id === 0 ? true : false,
      location: values?.location,
      description: values?.description,
      responsibilities: values?.responsibilities,
      qualifications: values?.qualifications,
      benefits: values?.benefits,
      start_date: values?.start_date,
      end_date: values?.end_date,
      renumeration: values?.salary,
    };

    try {
      await editJobMutation.mutateAsync(payload, {
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: ["get-all-jobs"],
          });
          setEditSuccess(true);
          // navigate(routes?.jobs?.jobs);
        },
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: errorMessage(error) || "An error occurred",
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <RouteIndicator showBack={true} />

      <Card style={styles.card}>
        <div className={styles.postJob}>
          {id ? (
            <h2>Edit Job</h2>
          ) : (
            <>
              <h2>Post A Job</h2>
              <p className={styles.para}>Fill in the form to post a job</p>
            </>
          )}
        </div>
        <section>
          <Formik
            initialValues={{
              business_id: JobDetailsData?.business_id,
              title: JobDetailsData?.title || "",
              employment_type: JobDetailsData?.employment_type || "",
              job_type: JobDetailsData?.job_type || "",
              level: JobDetailsData?.level || "",
              industry: JobDetailsData?.industry_id || "",
              location: JobDetailsData?.location || "",
              description: JobDetailsData?.description || "",
              responsibilities: JobDetailsData?.responsibilities || "",
              qualifications: JobDetailsData?.qualifications || "",
              benefits: JobDetailsData?.benefits || "",
              start_date: JobDetailsData?.start_date || "",
              end_date: JobDetailsData?.end_date || "",
              salary: JobDetailsData?.renumeration || "",
              accepting_applications:
                JobDetailsData?.status?.toString() === "1" ? true : false, // <-- Ensures boolean value
            }}
            onSubmit={(values, { resetForm }) => {
              id ? EditJobHandler(values) : CreateJobHandler(values, resetForm);
            }}
            enableReinitialize={true}
            validationSchema={validationSchema}
          >
            {({ handleChange, setFieldValue, values }) => {
              return (
                <Form>
                  <div className={styles.inputContainer}>
                    <Input
                      name="title"
                      label="Job Title"
                      placeholder="Customer Service"
                      type="text"
                      //   value={values.title}
                      onChange={handleChange}
                    />

                    <SearchableSelect
                      name="location"
                      label="Location"
                      options={stateOptions}
                      placeholder="Select State"
                    />

                    <SearchableSelect
                      name="industry"
                      label="Industry"
                      options={allIndustriesOptions}
                      placeholder="Select Industry"
                    />
                    {/* <Input
                      name="industry"
                      label="industry"
                      placeholder="industry"
                      type="text"
                      //   value={values.industry}
                      onChange={handleChange}
                    /> */}
                    <Input
                      name="start_date"
                      label="Start Date"
                      type="date"
                      //   value={values.start_date}
                      onChange={handleChange}
                    />
                    <Input
                      name="end_date"
                      label="End Date"
                      type="date"
                      //   value={values.end_date}
                      onChange={handleChange}
                    />

                    <Select
                      name="employment_type"
                      label="Employment Type"
                      placeholder=" Select Employment type"
                      options={employmentTypeOptions}
                      onChange={handleChange}
                    />

                    <Select
                      name="job_type"
                      label="Job Type"
                      placeholder="Select Job Type"
                      options={jobTypeOptions}
                      onChange={handleChange}
                    />

                    <Select
                      label="Job Level"
                      placeholder="Select Job Level"
                      name="level"
                      onChange={handleChange}
                      options={LevelOptions}
                    />

                    <Input
                      name="salary"
                      label="Salary"
                      type="text"
                      placeholder="input Salary"
                      //   value={values.salary}
                      onChange={handleChange}
                    />

                    {/* <Editor
                      name="description"
                      label="Job Description"
                      initialData={values.description}
                      onChange={(_, editor) => {
                        const data = editor.getData();
                        setFieldValue("description", data);
                      }}
                    /> */}
                    <Input
                      name="description"
                      type="textarea"
                      label="Job Description"
                      placeholder="Job Description"
                      className={styles.inputText}
                    />

                    {/* <Editor
                      name="responsibilities"
                      label="Key Responsibilities"
                      initialData={values?.responsibilities}
                      onChange={(_, editor) => {
                        const data = editor.getData();
                        setFieldValue("responsibilities", data);
                      }}
                    /> */}
                    <Input
                      name="responsibilities"
                      type="textarea"
                      label="Key Responsibilities"
                      placeholder="Key Responsibilities"
                      className={styles.inputText}
                    />

                    {/* <Editor
                      name="qualifications"
                      label="Qualifications"
                      initialData={values?.qualifications}
                      onChange={(_, editor) => {
                        const data = editor?.getData();
                        setFieldValue("qualifications", data);
                      }}
                    /> */}
                    <Input
                      name="qualifications"
                      type="textarea"
                      label="Qualifications"
                      placeholder="Qualifications"
                      className={styles.inputText}
                    />

                    {/* <Editor
                      name="benefits"
                      label="Benefits"
                      initialData={values.benefits}
                      onChange={(_, editor) => {
                        const data = editor.getData();
                        setFieldValue("benefits", data);
                      }}
                    /> */}
                    <Input
                      name="benefits"
                      type="textarea"
                      label="Benefits"
                      placeholder="Benefits"
                      className={styles.inputText}
                    />

                    <div className="switchWrapper">
                      Accepting Applications{" "}
                      <Switch
                        checked={values.accepting_applications}
                        onChange={(checked) =>
                          setFieldValue("accepting_applications", checked)
                        }
                      />
                    </div>

                    <section className={styles.buttonGroup}>
                      {/* <Button
                        variant="green"
                        type="submit"
                        disabled={createJobMutation?.isPending}
                        text={"Post Job"}
                        className={styles.btn}
                      /> */}

                      <Button
                        variant="green"
                        type="submit"
                        disabled={
                          editJobMutation?.isPending ||
                          createJobMutation?.isPending
                        }
                        // text={id ? "Save Changes" : "Post Job"}
                        className={styles.btn}
                        text={
                          id
                            ? editJobMutation?.isPending
                              ? "Updating..."
                              : "Save Changes"
                            : createJobMutation?.isPending
                            ? "Submitting..."
                            : "Post Job"
                        }
                      />
                    </section>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </section>
      </Card>
      <ModalContent
        open={openSuccess}
        handleCancel={() => handleSucessPost()}
        handleClick={() => {
          handleSucessPost();
        }}
        heading={"Job Posted Successfully"}
      />
      <ModalContent
        open={editSuccess}
        handleCancel={handleSucessEdit}
        handleClick={handleSucessEdit}
        text={"Job Updates Successfully"}
      />
    </div>
  );
}
