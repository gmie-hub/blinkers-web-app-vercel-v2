import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import { getTimeAgo } from "../../../utils/formatTime";
import { AxiosError } from "axios";
import { useQueries } from "@tanstack/react-query";
import { getPopularJobs } from "../../request";
import RouteIndicator from "../../../customs/routeIndicator";
import CustomSpin from "../../../customs/spin";
import { sanitizeUrlParam } from "../../../utils";
import {
  getColorByString,
  getInitials,
} from "../../../utils/limitNotification";
import usePagination from "../../../hooks/usePagnation";
import { useEffect } from "react";
import { Pagination } from "antd";

interface Props {
  canSeeBtn?: boolean;
  limit?: number;
}

const PopularJobs = ({ canSeeBtn = true, limit }: Props) => {
  const navigate = useNavigate();
  const { currentPage, setCurrentPage, onChange, pageNum } = usePagination();
  useEffect(() => {
    if (currentPage !== pageNum) {
      setCurrentPage(pageNum);
    }
  }, [pageNum, currentPage, setCurrentPage]);

  const [getPopularJobsQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-popular-jobs", currentPage],
        queryFn: () => getPopularJobs(currentPage),
        retry: 0,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const popularJobsData = getPopularJobsQuery?.data?.data?.data;
  const jobDetailsError = getPopularJobsQuery?.error as AxiosError;
  const jobDetailsErrorMessage =
    jobDetailsError?.message || "An error occurred. Please try again later.";

  const popularJobs =
    popularJobsData && popularJobsData?.length > 0
      ? popularJobsData.slice(0, limit)
      : popularJobsData;

  const businessReviewError = getPopularJobsQuery?.error as AxiosError;
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
    <div className={canSeeBtn ? "wrapper" : ""}>
      <div className={styles.whyWrapper}>
        {canSeeBtn && (
          <div>
            <RouteIndicator showBack />

            <p className={styles.title}>Popular Job</p>
          </div>
        )}

        {getPopularJobsQuery?.isLoading ? (
          <CustomSpin />
        ) : getPopularJobsQuery?.isError ? (
          <h1 className="error">{jobDetailsErrorMessage}</h1>
        ) : (
          <div className={styles.cardContainer}>
            {/* Only map through the data if it's not empty */}
            {popularJobs && popularJobs.length > 0 ? (
              popularJobs?.map((item: any, index: number) => (
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

      {canSeeBtn && (
        <Pagination
          current={currentPage}
          total={getPopularJobsQuery?.data?.data?.total} // Total number of items
          pageSize={20} // Number of items per page
          onChange={onChange} // Handle page change
          showSizeChanger={false} // Hide the option to change the page size
          style={{
            marginTop: "20px",
            textAlign: "center", // Center the pagination
            display: "flex",
            justifyContent: "center", // Ensure the pagination is centered
          }}
        />
      )}
    </div>
  );
};

export default PopularJobs;
