import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.scss";
import { getTimeAgo } from "../../../utils/formatTime";
import { AxiosError } from "axios";
import { useQueries } from "@tanstack/react-query";
import { getJobDetails } from "../../request";
import RouteIndicator from "../../../customs/routeIndicator";
import CustomSpin from "../../../customs/spin";
import { sanitizeUrlParam } from "../../../utils";
import { getColorByString, getInitials } from "../../../utils/limitNotification";

interface Props {
  canSeeBtn?: boolean;
  limit?: number;
}

const MoreJobsLikeThis = ({ canSeeBtn = true, limit }: Props) => {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const reletedJob = JobDetailsData?.related_jobs;

  const relatedJobsData =
    reletedJob && reletedJob?.length > 0
      ? reletedJob.slice(0, limit)
      : reletedJob;

  const businessReviewError = getJobDetailsQuery?.error as AxiosError;
  const businessReviewErrorMessage =
    businessReviewError?.message ||
    "An error occurred. Please try again later.";

  // const handleNavigateDetails = (id: number,title:string,description:string) => {
  //   navigate(`/job-details/${id}/${sanitizeUrlParam(title)}/${sanitizeUrlParam(description)}`);

  //   window.scrollTo(0, 0);
  // };

  const handleNavigateDetails = (id: number, title: string) => {
    navigate(`/job-details/${id}/${sanitizeUrlParam(title)}`);

    window.scrollTo(0, 0);
  };

  return (
    <div className="wrapper">
      <div className={styles.whyWrapper}>
        {canSeeBtn && (
          // <div onClick={() => navigate(-1)} className={styles.back}>
          //   <img src={BackIcon} alt="BackIcon" />
          //   <p>Back</p>
          // </div>
          <RouteIndicator showBack />
        )}

        {getJobDetailsQuery?.isLoading ? (
          <CustomSpin />
        ) : getJobDetailsQuery?.isError ? (
          <h1 className="error">{jobDetailsErrorMessage}</h1>
        ) : (
          <div className={styles.cardContainer}>
            {/* Only map through the data if it's not empty */}
            {relatedJobsData && relatedJobsData.length > 0 ? (
              relatedJobsData?.map((item: any, index: number) => (
                <div
                  onClick={() => handleNavigateDetails(item?.id, item?.title)}
                  className={styles.chooseCard}
                  key={index}
                >
                  {/* <div className={styles.cardWrapper}>
                    <div className={styles.textContent}>
                      <h3>{item?.title}</h3>
                      {item?.business?.name}
                    </div>
                  </div> */}
                   <div className={styles.cardWrapper}>
                    {item?.business?.logo ? (
                      <img
                        className={styles.icon}
                        src={item?.business?.logo}
                        alt="Business Logo"
                      />
                    ) : (
                      <div
                        className={styles.placeholderCircle}
                        style={{
                          backgroundColor: getColorByString(item?.title),
                        }}
                      >
                        {getInitials(item?.title)}
                      </div>
                    )}
                    <div className={styles.textContent}>
                      <p className={styles.title}>{item?.title}</p>
                      {item?.business?.name}
                    </div>
                  </div>
                  <div className={styles.full}>
                    <span className={styles.type}>
                      {" "}
                      {item?.employment_type &&
                        item?.employment_type?.length > 0 &&
                        item?.employment_type?.charAt(0).toUpperCase() +
                          item?.employment_type?.slice(1)}
                    </span>{" "}
                    {/* <span className={styles.dot}></span> */}
                    <span className={styles.type}>
                      {" "}
                      {item?.job_type &&
                        item?.job_type?.length > 0 &&
                        item?.job_type?.charAt(0)?.toUpperCase() +
                          item?.job_type?.slice(1)}
                    </span>{" "}
                    {/* <span className={styles.dot}></span> */}
                    <span className={styles.type}>
                      {" "}
                      {item?.level &&
                        item?.level?.length > 0 &&
                        item?.level?.charAt(0)?.toUpperCase() +
                          item?.level?.slice(1)}
                    </span>{" "}
                    <p className={styles.posted}>
                      {getTimeAgo(item?.created_at || "")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>{businessReviewErrorMessage}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoreJobsLikeThis;
