import styles from "./style.module.scss";
import FlagJobicon from "../../../../assets/flag.svg";
import JobLocation from "../../../../assets/joblocation.svg";
import ArrowIcon from "../../../../assets/arrow-right-green.svg";
import { useNavigate, useParams } from "react-router-dom";
import {  Modal } from "antd";
import { useState } from "react";
import {  useQueries } from "@tanstack/react-query";
import { AxiosError } from "axios";
import DOMPurify from "dompurify";
import JobTypeIcon from "../../../../assets/jobtype.svg";
import WorkIcon from "../../../../assets/jobarrange.svg";
import JobLevelIon from "../../../../assets/joblevel.svg";
import SalaryIcon from "../../../../assets/salary.svg";
import { useAtomValue } from "jotai";
import { userAtom } from "../../../../utils/store";
import { getFlaggedJobByJob_idUser_id, getMyApplicationDetails } from "../../../request";
import CustomSpin from "../../../../customs/spin";
import RouteIndicator from "../../../../customs/routeIndicator";
import FlagJob from "../../../job/jobDetails/flagJob/flagJob";
import MoreJobsLikeThis from "../../../job/jobLikeThis/jobsLikeThis";
import { formatAmount, formatDateToDayMonthYear, getTimeAgo } from "../../../../utils/formatTime";
import StatusBadge from "../../../../partials/statusBadge/statusBadge";
import Button from "../../../../customs/button/button";

const MyApplicationDetails = () => {
  const navigate = useNavigate();
  const [flagJob,setFlagJob] = useState(false);
  const { id } = useParams();
  const { applicationDetailsId } = useParams();
  const user = useAtomValue(userAtom);


  const handleNavigateToMoreJob = () => {
    navigate(`/job/more-jobs-like-this/${id}`);
    window.scrollTo(0, 0);
  };

  const [getJobDetailsQuery,getFlaggedJobQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-jobs-application-details", applicationDetailsId],
        queryFn: () => getMyApplicationDetails(parseInt(applicationDetailsId!)),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!applicationDetailsId,
      },
      {
        queryKey: ["get-flagged-job-by-userId",id],
        queryFn: () => getFlaggedJobByJob_idUser_id(parseInt(id!), user?.id!),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!user?.id 
      },
    ],
  });


  const hasUserFlaggedJob = getFlaggedJobQuery?.data?.data?.data?.length > 0;

  const JobDetailsData = getJobDetailsQuery?.data?.data;
  const jobDetailsError = getJobDetailsQuery?.error as AxiosError;
  const jobDetailsErrorMessage =
    jobDetailsError?.message || "An error occurred. Please try again later.";

  const getStatus = () => {
    let status;

    switch (JobDetailsData?.job?.status) {
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

  const getApplicationStatus = () => {
    let status;

    switch (JobDetailsData?.status) {
      case "0":
        status = "Pending";
        break;
      case "1":
        status = "Shortlisted";
        break;
      case "2":
        status = "Rejected";
        break;
      default:
        status = "Approved";
    }

    return status;
  };


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
                <img
                  className={styles.icon}
                  src={JobDetailsData?.business?.logo}
                  alt="logo"
                />
                <p>{JobDetailsData?.business?.name}</p>
              </span>
              <span className={styles.location}>
                <img src={JobLocation} alt="JobLocation" />
                <p>{JobDetailsData?.job?.location}</p>
              </span>
              <h3 className={styles.jobTitle}>{JobDetailsData?.job?.title}</h3>
              <div className={styles.open}>
                <span style={{ color: "#009900" }}>
                  {getTimeAgo(JobDetailsData?.created_at)}
                </span>
                <div className={styles.dot}></div>

                <span style={{ color: "#828282" }}>
                  {JobDetailsData?.job?.total_applicant} Applicants
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
                    // onClick={handleNavigateApplyToJob}
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
                  onClick={()=>{setFlagJob(true)}}
                />
              </div>
            </div>
          </section>
          <div style={{ marginBlockStart: "4rem" }}>
            {JobDetailsData?.job?.status?.toString() !== "1" && (
              <p style={{ color: "#E21B1B" }}>
                This job is no longer accepting applications
              </p>
            )}
            <p>You applied for this job on the {formatDateToDayMonthYear(JobDetailsData?.created_at!)}</p>
            {JobDetailsData?.status === '3' &&
            <p>Thank you for applying, Unfortunately you were not selected for this job</p>

            }
             <span style={{display:'flex', gap:'1rem'}}>
                <span>Application Status:</span> <StatusBadge status={getApplicationStatus()} />
              </span>

            <section className={styles.container}>
             
              <div className={styles.info}>
                <img src={JobTypeIcon} alt="TimeIcon" />

                <p>Job Type</p>
              </div>
              <p>
                {JobDetailsData?.job?.employment_type &&
                  JobDetailsData?.job?.employment_type?.length > 0 &&
                  JobDetailsData?.job?.employment_type
                    ?.charAt(0)
                    ?.toUpperCase() +
                    JobDetailsData?.job?.employment_type?.slice(1)}
              </p>

              <div className={styles.info}>
                <img src={JobLevelIon} alt="TimeIcon" />

                <p>Full Time</p>
              </div>
              <p>
                {JobDetailsData?.job?.level &&
                  JobDetailsData?.job?.level?.length > 0 &&
                  JobDetailsData?.job?.level?.charAt(0)?.toUpperCase() +
                    JobDetailsData?.job?.level?.slice(1)}
              </p>
              <div className={styles.info}>
                <img src={WorkIcon} alt="TimeIcon" />

                <p>Work Arrangement</p>
              </div>
              <p>
                {JobDetailsData?.job?.job_type &&
                  JobDetailsData?.job?.job_type?.length > 0 &&
                  JobDetailsData?.job?.job_type?.charAt(0)?.toUpperCase() +
                    JobDetailsData?.job?.job_type?.slice(1)}
              </p>
              <div className={styles.info}>
                <img src={SalaryIcon} alt="TimeIcon" />

                <p>Salary</p>
              </div>
              <p>
                {formatAmount(
                  parseInt(JobDetailsData?.job?.renumeration || "0")
                )}{" "}
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
                  __html: DOMPurify.sanitize(
                    JobDetailsData?.job?.description || ""
                  ),
                }}
              />
            </div>

            <div>
              <h3>Key Responsibilities</h3>

              <p
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    JobDetailsData?.job?.responsibilities || ""
                  ),
                }}
              />
            </div>

            <div>
              <h3>Qualifications</h3>
              <p
                dangerouslySetInnerHTML={{
                  __html: DOMPurify?.sanitize(
                    JobDetailsData?.job?.qualifications || ""
                  ),
                }}
              />{" "}
            </div>
            <div>
              <h3>Benefits</h3>
              <p
                dangerouslySetInnerHTML={{
                  __html: DOMPurify?.sanitize(
                    JobDetailsData?.job?.benefits || ""
                  ),
                }}
              />
            </div>
          </section>
        </div>
      )}
      <section>
        <div className="wrapper">
          <div className={styles.review}>
            <div className={styles.reviewbtn}>
              <p className={styles.title}>More Jobs Like This</p>

              <div
                onClick={handleNavigateToMoreJob}
                className={styles.btnWrapper}
              >
                <p className={styles.btn}>See All</p>
                <img src={ArrowIcon} alt="ArrowIcon" />
              </div>
            </div>
            {/* <p>No Reviews available yet</p> */}
          </div>
        </div>
        <MoreJobsLikeThis limit={4} canSeeBtn={false} />,
      </section>

      <Modal
        open={flagJob}
        onCancel={() => setFlagJob(false)}
        centered
        title="Flag Job"
        footer={null}
      >
        <FlagJob handleCloseModal={() => setFlagJob(false)} />
      </Modal>
    </main>
  );
};
export default MyApplicationDetails;
