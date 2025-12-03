import Button from "../../../customs/button/button";
import styles from "./jobDetails.module.scss";
import FlagJobicon from "../../../assets/flag.svg";
import JobLocation from "../../../assets/joblocation.svg";
import StatusBadge from "../../../partials/statusBadge/statusBadge";
import ArrowIcon from "../../../assets/arrow-right-green.svg";
import MoreJobsLikeThis from "../jobLikeThis/jobsLikeThis";
import { useNavigate, useParams } from "react-router-dom";
import { App, Modal } from "antd";
import { useState } from "react";
import FlagJob from "./flagJob/flagJob";
import { useMutation, useQueries } from "@tanstack/react-query";
import {
  ApplyForJobApi,
  getFlaggedJobByJob_idUser_id,
  getJobDetails,
} from "../../request";
import { AxiosError } from "axios";
import { formatAmount, getTimeAgo } from "../../../utils/formatTime";
import DOMPurify from "dompurify";
import JobTypeIcon from "../../../assets/jobtype.svg";
import WorkIcon from "../../../assets/jobarrange.svg";
import JobLevelIon from "../../../assets/joblevel.svg";
import SalaryIcon from "../../../assets/salary.svg";
import RouteIndicator from "../../../customs/routeIndicator";
import { userAtom } from "../../../utils/store";
import { useAtomValue } from "jotai";
import { routes } from "../../../routes";
import ModalContent from "../../../partials/successModal/modalContent";
import { errorMessage } from "../../../utils/errorMessage";
import CustomSpin from "../../../customs/spin";
import {
  getColorByString,
  getInitials,
} from "../../../utils/limitNotification";
import JobWelcome from "../jobLogin/jobLogin";

const JobDetails = () => {
  const navigate = useNavigate();
  const [flagJob, setFlagJob] = useState(false);
  const { id } = useParams();
  const user = useAtomValue(userAtom);
  const [regModal, setRegModal] = useState(false);
  const { notification } = App.useApp();
  // const currentPath = location.pathname;
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const handleNavigateToMoreJob = () => {
    navigate(`/job/more-jobs-like-this/${id}`);
    window.scrollTo(0, 0);
  };
  const handleNavigateApplyToJob = () => {
    // if (!user) {
    //   notification.error({
    //     message: "Log in required",
    //     description: "You need to log in to access this page!",
    //     placement: "top",
    //     duration: 3,
    //     onClose: () => {
    //       navigate(`/login?redirect=${currentPath}`);
    //     },
    //   });
    // } else
    if (user?.is_applicant) {
      // navigate(`/job/apply/${id}`);
      ApplyJobHandler();
    } else {
      setRegModal(true);
    }
    window.scrollTo(0, 0);
  };

  const [getJobDetailsQuery, getFlaggedJobQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-jobs-details", id],
        queryFn: () => getJobDetails(parseInt(id!)),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!id,
      },
      {
        queryKey: ["get-flagged-job-by-userId", id],
        queryFn: () => getFlaggedJobByJob_idUser_id(parseInt(id!), user?.id!),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!user?.id,
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
  const handleFlagJob = () => {
    if (!user) {
      setOpenLoginModal(true);

      // notification.open({
      //   message: "You need to log in to complete this action.",
      //   description: (
      //     <>
      //       <br />
      //       <Button
      //         type="button"
      //         onClick={() => {
      //           notification.destroy();
      //           navigate(`/login?redirect=${currentPath}`);
      //         }}
      //       >
      //         Click here to Login
      //       </Button>
      //     </>
      //   ),
      //   placement: "top",
      //   duration: 4, // Auto close after 5 seconds
      //   icon: null,
      // });
    } else if (user.is_applicant) {
      setFlagJob(true);
    } else {
      setRegModal(true);
    }
  };

  const handleRegModal = () => {
    navigate(routes?.job?.RegAsApplicant);
  };

  const ApplyJobMutation = useMutation({
    mutationFn: ApplyForJobApi,
    mutationKey: ["apply-job"],
  });
  console.log(user?.applicant?.id);

  const ApplyJobHandler = async () => {
    const payload: Partial<FlagJob> = {
      job_id: id!,
      applicant_id: user?.applicant?.id || user?.applicantId,
      message: "Applying",
    };

    try {
      await ApplyJobMutation.mutateAsync(payload, {
        onSuccess: (data) => {
          notification.success({
            message: "Success",
            description: data?.message,
          });
        },
      });
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: errorMessage(error) || "An error occurred",
      });
    }
  };
  const hasUserFlaggedJob = getFlaggedJobQuery?.data?.data?.data?.length > 0;

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
                {/* <img
                  className={styles.icon}
                  src={JobDetailsData?.business?.logo}
                  alt="logo"
                /> */}
                <>
                  {JobDetailsData?.business?.logo ? (
                    <img
                      className={styles.icon}
                      src={JobDetailsData.business.logo}
                      alt="Business Logo"
                    />
                  ) : (
                    <div
                      className={styles.placeholderCircle}
                      style={{
                        backgroundColor: getColorByString(
                          JobDetailsData?.title
                        ),
                      }}
                    >
                      {getInitials(JobDetailsData?.title)}
                    </div>
                  )}
                </>

                <p>
                  {JobDetailsData?.business?.name ||
                    JobDetailsData?.user?.store_name ||
                    JobDetailsData?.user?.name}
                </p>
              </span>
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
              </div>
            </div>

            <div className={styles.btnFlex}>
              {JobDetailsData?.status?.toString() === "1" && (
                <div>
                  <Button
                    type="submit"
                    text="Apply For Job"
                    className="buttonStyle"
                    onClick={handleNavigateApplyToJob}
                  />
                </div>
              )}

              <div>
                <Button
                  type="submit"
                  variant="redOutline"
                  text={hasUserFlaggedJob ? "Unflag This Job" : "Flag This Job"}
                  className={styles.buttonStyle}
                  icon={<img src={FlagJobicon} alt="FlagJobicon" />}
                  onClick={handleFlagJob}
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

      {JobDetailsData?.related_jobs &&
        JobDetailsData?.related_jobs?.length > 0 && (
          <section>
            <div className="wrapper">
              <div className={styles.review}>
                <div className={styles.reviewbtn}>
                  <p className={styles.title}>More Jobs Like This</p>

                  {JobDetailsData?.related_jobs &&
                    JobDetailsData?.related_jobs?.length > 4 && (
                      <div
                        onClick={handleNavigateToMoreJob}
                        className={styles.btnWrapper}
                      >
                        <p className={styles.btn}>See All</p>
                        <img src={ArrowIcon} alt="ArrowIcon" />
                      </div>
                    )}
                </div>
                {/* <p>No Reviews available yet</p> */}
              </div>
            </div>
            <MoreJobsLikeThis limit={4} canSeeBtn={false} />,
          </section>
        )}

      <Modal
        open={flagJob}
        onCancel={() => setFlagJob(false)}
        centered
        title="Flag Job"
        footer={null}
      >
        <FlagJob handleCloseModal={() => setFlagJob(false)} />
      </Modal>

      <ModalContent
        open={regModal}
        handleCancel={() => setRegModal(false)}
        handleClick={() => {
          handleRegModal();
        }}
        heading={"Please Register as an applicant before perform this action"}
      />

      <Modal
        open={openLoginModal}
        onCancel={() => setOpenLoginModal(false)}
        centered
        footer={null}
      >
        <JobWelcome
          handleCloseModal={() => setOpenLoginModal(false)}
        />
      </Modal>
    </main>
  );
};
export default JobDetails;
