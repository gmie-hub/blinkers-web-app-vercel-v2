"use client"

import styles from "./card.module.scss";
import { useQueries } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Pagination, Image } from "antd";
import { useEffect, useRef } from "react";
import CustomSpin from "@/components/ui/spin";
import usePagination from "@/hooks/usePagination";
import Button from "@/components/ui/button/button";
import { useRouter } from "next/navigation";
import { sanitizeUrlParam } from "@/lib/utils";
import { getColorByString, getInitials } from "@/lib/utils/limitNotification";
import { getTimeAgo } from "@/lib/utils/formatTime";
import { getAllJobs } from "@/services/jobServices";

interface Props {
  searchTerm: string;
  resetSearchTerm: () => void;
}

const JobLists = ({ searchTerm, resetSearchTerm }: Props) => {
  const router = useRouter();
  const { currentPage, setCurrentPage, onChange, pageNum } = usePagination();
  useEffect(() => {
    if (currentPage !== pageNum) {
      setCurrentPage(pageNum);
    }
  }, [pageNum, currentPage, setCurrentPage]);
  const moreJobsRef = useRef<HTMLParagraphElement>(null);

  const handlePageChange = (page: number) => {
    onChange(page); // this triggers the pagination logic from your custom hook
    if (moreJobsRef.current) {
      moreJobsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  // const handleNavigateDetails = (
  //   id: number,
  //   title: string,
  //   description:string,
  // ) => {
  //   navigate(
  //     `/job-details/${id}/${sanitizeUrlParam(title)}/${sanitizeUrlParam(description)}`
  //   );
  //   window.scrollTo(0, 0);
  // };

  const handleNavigateDetails = (id: number, title: string) => {
    router.push(`/jobs/job-details/${id}/${sanitizeUrlParam(title)}`);
    window.scrollTo(0, 0);
  };

  const [getAllJobQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-all-jobs", currentPage, searchTerm],
        queryFn: () => getAllJobs(currentPage, searchTerm),
        retry: 0,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const JobData = getAllJobQuery?.data?.data?.data || [];
  const jobError = getAllJobQuery?.error as AxiosError;
  const jobErrorMessage =
    jobError?.message || "An error occurred. Please try again later.";

  const handleBack = () => {
    resetSearchTerm();
    setCurrentPage(1);
    router.push("/jobs");
    getAllJobQuery.refetch();
  };

  return (
    <div className={styles.whyWrapper}>
      {getAllJobQuery?.isLoading ? (
        <CustomSpin />
      ) : getAllJobQuery?.isError ? (
        <h1 className="error">{jobErrorMessage}</h1>
      ) : (
        <>
          {/* <p>{searchTerm?.length > 0 && "Viewall"}</p> */}
          {searchTerm?.length > 0 && JobData?.length > 0 && (
            <div>
              <Button
                type="button"
                className="buttonStyle"
                onClick={handleBack}
                text="view all jobs"
                icon={<img src='/backArrow.svg' alt="FaArrowLeft" />}
              />
              <br />
              <br />
            </div>
          )}

          <p ref={moreJobsRef} className={styles.titleMoreJobs}>
            More Jobs
          </p>

          <div className={styles.cardContainer}>
            {JobData && JobData?.length > 0 ? (
              JobData?.map((item) => (
                <div
                  onClick={() => handleNavigateDetails(item?.id, item?.title)}
                  className={styles.chooseCard}
                  key={item.id}
                >
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
                  <div>
                    <span className={styles.type}>
                      {" "}
                      {item?.employment_type &&
                        item?.employment_type?.length > 0 &&
                        item?.employment_type?.charAt(0)?.toUpperCase() +
                          item?.employment_type?.slice(1)}
                    </span>{" "}
                    {/* <div className={styles.dot}></div> */}
                    <span className={styles.type}>
                      {" "}
                      {item?.job_type &&
                        item?.job_type?.length > 0 &&
                        item?.job_type?.charAt(0)?.toUpperCase() +
                          item?.job_type?.slice(1)}
                    </span>{" "}
                    {/* <div className={styles.dot}></div> */}
                    <span className={styles.type}>
                      {" "}
                      {item?.level &&
                        item?.level?.length > 0 &&
                        item?.level?.charAt(0)?.toUpperCase() +
                          item?.level?.slice(1)}
                    </span>
                  </div>
                  <p>{getTimeAgo(item?.created_at || "")}</p>
                  {item?.location && (
                    <div style={{ display: "flex" }}>
                      <Image width={20} src='/locationrelated.svg' alt="LocationIcon" />
                      <p>{item?.location}</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <section style={{ width: "100%" }}>
                <div className="noDataContainer">
                  <p>No data available</p>
                  <Button
                    type="button"
                    className="buttonStyle"
                    onClick={handleBack}
                    text="view all jobs"
                    icon={<img src='/backArrow.svg' alt="FaArrowLeft" />}
                  />
                </div>
              </section>
            )}
          </div>

          <Pagination
            current={currentPage}
            total={getAllJobQuery?.data?.data?.total} // Total number of items
            pageSize={20} // Number of items per page
            onChange={handlePageChange} // Handle page change
            showSizeChanger={false} // Hide the option to change the page size
            style={{
              marginTop: "20px",
              textAlign: "center", // Center the pagination
              display: "flex",
              justifyContent: "center", // Ensure the pagination is centered
            }}
          />
        </>
      )}
    </div>
  );
};
export default JobLists;
