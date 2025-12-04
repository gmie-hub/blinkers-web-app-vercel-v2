import styles from "./viewApplicant.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import Button from "../../../../../../customs/button/button";
import EyeIcon from "../../../../../../assets/eyewhite.svg";
import StatusBadge from "../../../../../../partials/statusBadge/statusBadge";
import JobDetailsElements from "./jobDetailsElements/jobDetailsElements";
import {
  getApplicationDetails,
  updateApplicationStatus,
} from "../../../../../request";
import { Education, EmploymentHistory } from "../../../../../../utils/type";
import { formatDateToMonthYear } from "../../../../../../utils/formatTime";
import CustomSpin from "../../../../../../customs/spin";
import { AxiosError } from "axios";
import RouteIndicator from "../../../../../../customs/routeIndicator";
import { App, Modal } from "antd";
import { useState } from "react";
import RejectApplication from "./rejectApplication";

interface BasicInformationProps {
  title?: string;
  name?: JSX.Element | string;
  icon?: JSX.Element;
}
/* eslint-disable no-empty-pattern */
export default function ApplicantDetails({}: BasicInformationProps) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [openDelete, setOpenDelete] = useState(false);

  const [getApplicantDetailsQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-applicant-details"],
        queryFn: () => getApplicationDetails(parseInt(id!)),
        retry: 0,
        refetchOnWindowFocus: false,
        enabled:!!id
      },
    ],
  });
  const ApplicantDetailsData =
    getApplicantDetailsQuery?.data?.data?.applicant?.user;
  const ApplicantDetails = getApplicantDetailsQuery?.data?.data?.applicant;

  const ApplicantDetailsError = getApplicantDetailsQuery?.error as AxiosError;
  const ApplicantDetailsErrorMessage =
    ApplicantDetailsError?.message ||
    "An error occurred. Please try again later.";

  //   const updateApplicationStatus = async (payload: ApplicationStatusPayload, id: number) => {
  //     const response = await api.patch(`jobs/application/${id}`, payload);
  //     return response.data;
  //   };

  const approveApplicationMutation = useMutation({
    mutationFn: ({
      payload,
      id,
    }: {
      payload: ApplicationStatusPayload;
      id: number;
    }) => updateApplicationStatus(payload, id),
    mutationKey: ["reject-status"],
  });

  const approveApplicationHandler = async (id: number) => {
    const payload: ApplicationStatusPayload = {
      status: "2", // Use a number if required
    };

    try {
      await approveApplicationMutation.mutateAsync(
        { payload, id },
        {
          onSuccess: (data) => {
            notification.success({
              message: "Success",
              description: data?.message || "Application rejected successfully",
            });
            queryClient.refetchQueries({
              queryKey: ["get-all-job-applicants"],
            });
            navigate(-1); // Go back to the previous page
          },
        }
      );
    } catch (error: any) {
      notification.error({
        message: "Error",
        description:
          error?.message || "An error occurred while rejecting the application",
      });
    }
  };

 
  
  return (
    <div className="wrapper">
      {getApplicantDetailsQuery?.isLoading ? (
        <CustomSpin />
      ) : getApplicantDetailsQuery?.isError ? (
        <h1 style={{ textAlign: "center" }} className="error">
          {ApplicantDetailsErrorMessage}
        </h1>
      ) : (
        <>
          <RouteIndicator showBack />
          <div className={"space-between"}>
            <h3>Applicant’s Details</h3>
            <Button
              type="button"
              variant="green"
              icon={<img src={EyeIcon} alt="TimeIcon" />}
              text="View Profile"
              className={styles.buttonStyle}
              // onClick={() => setIsDeleteModal(true)}
            />
          </div>

          <div className={styles.subCard}>
            <JobDetailsElements
              title={"First Name"}
              name={ApplicantDetailsData?.name}
            />
            <JobDetailsElements title={"Last Name"} name={"last name"} />
            <JobDetailsElements
              title={"Email Address"}
              name={ApplicantDetailsData?.email}
            />
            <JobDetailsElements
              title={"Phone Number"}
              name={ApplicantDetailsData?.number}
            />
            <JobDetailsElements
              title={"Job Specialization"}
              name={ApplicantDetails?.specialization}
            />
            <JobDetailsElements
              title={"Last Login"}
              name={formatDateToMonthYear(
                ApplicantDetailsData?.last_login || ""
              )}
            />

            <JobDetailsElements
              title={"Status"}
              name={
                <StatusBadge
                  status={
                    ApplicantDetailsData?.status?.toString() === "1"
                      ? "pending"
                      : ApplicantDetailsData?.status?.toString() === "2"
                      ? "Shortlisted"
                      : "Rejected"
                  }
                />
              }
            />
          </div>

          <div className={styles.cardContent}>
            <p className={styles.cv}>CV</p>
            {/* <p className={styles.fileName}> */}{" "}
            {/* <ViewIcon /> <a href={ApplicantDetails?.cv_url}>cv</a> */}
            <a
              className={styles.fileName}
              href={ApplicantDetails?.cv_url}
              target="_blank"
              rel="noreferrer"
            >
              <img src={EyeIcon} alt="TimeIcon" /> {ApplicantDetailsData?.name}
              's CV
            </a>
            {/* </p> */}
          </div>

          <section className={styles.sectionBottom}>
            <h3>Employment History</h3>

            <div className={styles.cardContainer}>
              {ApplicantDetails?.employment_history &&
                ApplicantDetails?.employment_history.map(
                  (card: EmploymentHistory, index: number) => (
                    <div className={styles.cardEdu} key={index}>
                      <h3>
                        {card.job_title} at {card?.company_name}
                      </h3>
                      <p>{card.employment_type}</p>
                      <p>{card.job_type}</p>
                      <p>{card.location}</p>
                    </div>
                  )
                )}
            </div>
          </section>
          <section className={styles.sectionBottom}>
            <h3>Education</h3>

            <div className={styles.cardContainer}>
              {ApplicantDetails?.education &&
                ApplicantDetails?.education?.map(
                  (card: Education, index: number) => (
                    <div key={index} className={styles.cardEdu}>
                      <h3>{card?.institution}</h3>
                      <p>
                        {formatDateToMonthYear(card?.start_date)}-
                        {formatDateToMonthYear(card?.end_date)}
                      </p>
                      <p>{card?.degree}</p>
                    </div>
                  )
                )}
            </div>
          </section>
          <section className={styles.sectionBottom}>
            <h3>Cover Letter</h3>

            <div className={styles.cardContent}>
              <a
                className={styles.fileName}
                href={ApplicantDetails?.cover_letter_url}
                target="_blank"
                rel="noreferrer"
              >
                <img src={EyeIcon} alt="TimeIcon" />{" "}
                {ApplicantDetailsData?.name}'s Cover letter
              </a>
            </div>
          </section>

          <section className={styles.sectionBottom}>
            <h3>Skills</h3>

            <div className={styles.cardContainer}>
              {ApplicantDetails?.skills?.map((card: string, index: number) => (
                <div className={styles.cardEdu} key={index}>
                  <p>{card}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h3>Links</h3>

            <div className={styles.cardContainer}>
              {ApplicantDetails?.links?.map((card, index) => (
                <div className={styles.cardEdu} key={index}>
                  <h3>{card.type}</h3>
                  <p>{card?.url}</p>
                </div>
              ))}
            </div>

            <section className={styles.buttonGroup}>
              <Button
                variant="redOutline"
                type="submit"
                // disabled={rejectApplicationMutation?.isPending}
                // text={
                //   rejectApplicationMutation?.isPending
                //     ? "loading..."
                //     : "Reject Application"
                // }
                className="buttonStyle"
                // onClick={() => rejectApplicationHandler(parseInt(id!))}
                onClick={() => setOpenDelete(true)}
                text="Reject Application"
              />

              <Button
                variant="green"
                type="submit"
                disabled={approveApplicationMutation?.isPending}
                text={
                  approveApplicationMutation?.isPending
                    ? "loading..."
                    : "Approve Application"
                }
                className="buttonStyle"
                onClick={() => approveApplicationHandler(parseInt(id!))}
              />
            </section>
          </section>
        </>
      )}
      <Modal
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        centered
        footer={null}
      >
        <RejectApplication handleCloseModal={() => setOpenDelete(false)} />
      </Modal>
    </div>
  );
}
/* eslint-disable no-empty-pattern */
