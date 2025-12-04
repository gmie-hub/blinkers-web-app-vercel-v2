import Button from "../../../../../customs/button/button";
import styles from "./viewJob.module.scss";
import DeleteIcon from "../../../../../assets/deleteicon.svg";
import JobLocation from "../../../../../assets/joblocation.svg";
import StatusBadge from "../../../../../partials/statusBadge/statusBadge";
import EditIcon from "../../../../../assets/edit-2.svg";
import EyeIcon from "../../../../../assets/eyewhite.svg"
import { useNavigate, useParams } from "react-router-dom";
import { App } from "antd";
import { useState } from "react";
// import FlagJob from "./flagJob/flagJob";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import {  deleteJob, getJobDetails } from "../../../../request";
import { AxiosError } from "axios";
import DOMPurify from "dompurify";
import JobTypeIcon from "../../../../../assets/jobtype.svg";
import WorkIcon from "../../../../../assets/jobarrange.svg";
import JobLevelIon from "../../../../../assets/joblevel.svg";
import SalaryIcon from "../../../../../assets/salary.svg";
import RouteIndicator from "../../../../../customs/routeIndicator";
import CustomSpin from "../../../../../customs/spin";
import { formatAmount, getTimeAgo } from "../../../../../utils/formatTime";
import ReusableModal from "../../../../../partials/deleteModal/deleteModal";
import ModalContent from "../../../../../partials/successModal/modalContent";
import { errorMessage } from "../../../../../utils/errorMessage";

const JobDetails = () => {
  const navigate = useNavigate();
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isDeleteSuccessful, setIsDeleteSucessful] = useState(false);
    const { id } = useParams();
  const { notification } = App.useApp();
  const queryClient = useQueryClient();


  const [getJobDetailsQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-jobs-details", id],
        queryFn: () => getJobDetails(parseInt(id!)),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!id,
      },
    ],
  });

  const JobDetailsData = getJobDetailsQuery?.data?.data;
  const jobDetailsError = getJobDetailsQuery?.error as AxiosError;
  const jobDetailsErrorMessage =
    jobDetailsError?.message || "An error occurred. Please try again later.";

  const getStatus = () => {
    let status;

    switch (JobDetailsData?.status) {
      case "0":
        status = "InActive";
        break;
      case "1":
        status = "Open";
        break;
      case "2":
        status = "Close";
        break;
      default:
        status = "Banned";
    }

    return status;
  };

  const handleNavigateTojobPage = () => {
    setIsDeleteSucessful(true);
    navigate(-1)
  };

  const deleteJobMutation = useMutation({ mutationFn: deleteJob });

  const DeleteJobHandler = async () => {
    try {
      await deleteJobMutation.mutateAsync(
        {
          id: parseInt(id!),
        },
        {
          onSuccess: () => {
            notification.success({
              message: 'Success',
              description: 'deleted Successfully',
            });
            setIsDeleteModal(false);
            setIsDeleteSucessful(true);

            queryClient.refetchQueries({
              queryKey: ['get-all-jobs'],
            });
          },
        },
      );
    } catch (error  : any) {
      notification.error({
        message: 'Error',
        description:errorMessage(error) || "An error occurred",
      });
    }
  };
  
  const handleEdit = () => {
    navigate(`/edit-job/${id}`);
  };
  const ViewApplicants =()=>{
    navigate(`/applicants/${id}`);

  }

  return (
    <main>
      {getJobDetailsQuery?.isLoading ? (
        <CustomSpin />
      ) : getJobDetailsQuery?.isError ? (
        <h1 className="error">{jobDetailsErrorMessage}</h1>
      ) : (
        <div className="wrapper">
          <div>
            <RouteIndicator showBack />
          </div>
          <section className={styles.header}>
            <div>
            <span className={styles.logo}>
             
                <>
                {JobDetailsData?.business?.logo ? (
                  <img
                    className={styles.icon}
                    src={JobDetailsData.business.logo}
                    alt="Business Logo"
                  />
                ) : (
                  <div className={styles.placeholderCircle}></div>
                )}
                </>

                <p>
                  {JobDetailsData?.business?.name ||
                    JobDetailsData?.user?.store_name}
                </p>
              </span>
              {/* <span className={styles.logo}>
                <img
                  className={styles.icon}
                  src={JobDetailsData?.business?.logo}
                  alt="logo"
                />
                <p>{JobDetailsData?.business?.name}</p>
              </span> */}
              <span className={styles.location}>
                <img src={JobLocation} alt="JobLocation" />
                <p>{JobDetailsData?.location}</p>
              </span>
              <h3 className={styles.jobTitle}>{JobDetailsData?.title}</h3>
              <div className={styles.open}>
                <span style={{ color: "#009900" }}>
                  {getTimeAgo(JobDetailsData?.created_at)}
                </span>
                <div className={styles.dot}></div>

                <span style={{ color: "#828282" }}>
                  {JobDetailsData?.total_applicant} Applicants
                </span>

                <StatusBadge status={getStatus()} />

                <Button
                    icon={<img src={EyeIcon} alt="EyeIcon" />}
                    type="submit"
                    text="View Applicants"
                    className="buttonStyle"
                    onClick={ViewApplicants}
                  />

              </div>
            </div>

            <div className={styles.btnFlex}>
              {JobDetailsData?.status?.toString() === "1" && (
                <div>
                  <Button
                    icon={<img src={EditIcon} alt="FlagJobicon" />}
                    type="submit"
                    text="Edit Job"
                    className="buttonStyle"
                    onClick={handleEdit}
                  />
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  variant="redOutline"
                  text="Delete Job"
                  className={styles.buttonStyle}
                  icon={<img src={DeleteIcon} alt="FlagJobicon" />}
                  onClick={() => setIsDeleteModal(true)}
                  />
              </div>
            </div>
          </section>
          <div style={{ marginBlockStart: "4rem" }}>
            {JobDetailsData?.status?.toString() !== "1" && (
              <p style={{ color: "#E21B1B" }}>
                This job is no longer accepting applications
              </p>
            )}

            <section className={styles.container}>
              <div className={styles.info}>
                <img src={JobTypeIcon} alt="TimeIcon" />

                <p>Job Type</p>
              </div>
              <p>
                {JobDetailsData?.employment_type &&
                  JobDetailsData?.employment_type?.length > 0 &&
                  JobDetailsData?.employment_type?.charAt(0).toUpperCase() +
                    JobDetailsData?.employment_type?.slice(1)}
              </p>

              <div className={styles.info}>
                <img src={JobLevelIon} alt="TimeIcon" />

                <p>Full Time</p>
              </div>
              <p>
                {JobDetailsData?.level &&
                  JobDetailsData?.level?.length > 0 &&
                  JobDetailsData?.level?.charAt(0).toUpperCase() +
                    JobDetailsData?.level?.slice(1)}
              </p>
              <div className={styles.info}>
                <img src={WorkIcon} alt="TimeIcon" />

                <p>Work Arrangement</p>
              </div>
              <p>
                {JobDetailsData?.job_type &&
                  JobDetailsData?.job_type?.length > 0 &&
                  JobDetailsData?.job_type?.charAt(0).toUpperCase() +
                    JobDetailsData?.job_type?.slice(1)}
              </p>
              <div className={styles.info}>
                <img src={SalaryIcon} alt="TimeIcon" />

                <p>Salary</p>
              </div>
              <p>
                {formatAmount(parseInt(JobDetailsData?.renumeration || "0"))}{" "}
                <small style={{ color: "#707070" }}>/ month</small>
              </p>
              <span></span>
            </section>
          </div>
          <section className={styles.Description}>
            <div>
              <h3>Job Description:</h3>
              <p
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(JobDetailsData?.description || ""),
                }}
              />
            </div>

            <div>
              <h3>Key Responsibilities</h3>

              <p
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    JobDetailsData?.responsibilities || ""
                  ),
                }}
              />
            </div>

            <div>
              <h3>Qualifications</h3>
              <p
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    JobDetailsData?.qualifications || ""
                  ),
                }}
              />{" "}
            </div>
            <div>
              <h3>Benefits</h3>
              <p
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(JobDetailsData?.benefits || ""),
                }}
              />
            </div>
          </section>
        </div>
      )}

      <ReusableModal
        open={isDeleteModal}
        handleCancel={() => setIsDeleteModal(false)}
        handleConfirm={DeleteJobHandler}
        title="Are You Sure You Want to Delete This Job?"
        description="All details about this job will be deleted along with the user applications."
        confirmText={deleteJobMutation?.isPending ? 'loading...' : "Yes, Delete Job"}
        cancelText="No, Go Back"
        disabled={deleteJobMutation?.isPending}
      />

      <ModalContent
        open={isDeleteSuccessful}
        handleCancel={ handleNavigateTojobPage}
        handleClick={handleNavigateTojobPage}
        text={"Job Updated Successfully"}
      />
    </main>
  );
};
export default JobDetails;
