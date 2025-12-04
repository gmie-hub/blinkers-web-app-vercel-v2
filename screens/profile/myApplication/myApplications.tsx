import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import { useQueries } from "@tanstack/react-query";
import { getMyApplications } from "../../request";
import { AxiosError } from "axios";
import { Pagination, Tabs, TabsProps } from "antd";
import { getTimeAgo } from "../../../utils/formatTime";
import CustomSpin from "../../../customs/spin";
import usePagination from "../../../hooks/usePagnation";
import { useState } from "react";
import { userAtom } from "../../../utils/store";
import { useAtomValue } from "jotai";

const MyApplications = () => {
  const navigate = useNavigate();
  const { currentPage, onChange } = usePagination();
  const user = useAtomValue(userAtom);

  const [activeKey, setActiveKey] = useState("0");

  const handleNavigateDetails = (id: number,applicationDetailsId:number) => {
    navigate(`/my-application-details/${id}/${applicationDetailsId}`);
    window.scrollTo(0, 0);
  };

  const [getAllJobQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-all-jobs", currentPage,activeKey, user?.id],
        queryFn: () => getMyApplications(currentPage, user?.applicantId ?? 0,parseInt(activeKey!)),
        retry: 0,
        refetchOnWindowFocus: false,
        enabled:!!user?.id
      },
    ],
  });

  const jobData = getAllJobQuery?.data?.data?.data || [];
  const jobError = getAllJobQuery?.error as AxiosError;
  const jobErrorMessage =
    jobError?.message || "An error occurred. Please try again later.";


  const items: TabsProps["items"] = [
    { key: "0", label: "Pending" },
    { key: "3", label: "Rejected" },
    { key: "2", label: "Shortlisted" },
  ];

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    localStorage?.setItem("activeTabKeyBasicInfo", key);
  };
 

  return (
    <div className={styles.whyWrapper}>
      {getAllJobQuery?.isLoading ? (
        <CustomSpin />
      ) : getAllJobQuery?.isError ? (
        <h1 className="error">{jobErrorMessage}</h1>
      ) : (
        <>
          <h3>My Applications</h3>
          <p>Track your submitted job applications and see their status.</p>
          <div>
            <Tabs
              className={styles.tabs}
              activeKey={activeKey}
              onChange={handleTabChange}
              items={items}
            />
          </div>

          <div className={styles.cardContainer}>
            {jobData && jobData?.length > 0 ? (
              jobData?.map((item) => (
                <div
                  onClick={() => handleNavigateDetails(item?.job_id,item?.id)}
                  className={styles.chooseCard}
                  key={item?.id}
                >
                  <div className={styles.cardWrapper}>
                    <img
                      className={styles.icon}
                      src={item?.business?.logo}
                      alt="Logo"
                    />
                    <div className={styles.textContent}>
                      <p className={styles.title}>{item?.job?.title}</p>
                      {item?.business?.name}
                    </div>
                  </div>
                  <div>
                    <span>
                      {item?.job?.employment_type &&
                        item?.job?.employment_type?.charAt(0)?.toUpperCase() +
                          item?.job?.employment_type?.slice(1)}
                    </span>
                    <div className={styles.dot}></div>
                    <span>
                      {item?.job?.job_type &&
                        item?.job?.job_type?.charAt(0)?.toUpperCase() +
                          item?.job?.job_type?.slice(1)}
                    </span>
                    <div className={styles.dot}></div>
                    <span>
                      {item?.job?.level &&
                        item?.job?.level?.charAt(0)?.toUpperCase() +
                          item?.job?.level?.slice(1)}
                    </span>
                  </div>
                  <p>{getTimeAgo(item?.created_at || "")}</p>
                </div>
              ))
            ) : (
              <p>No applications found for this status.</p>
            )}
          </div>

          <Pagination
            current={currentPage}
            total={getAllJobQuery?.data?.data?.total}
            pageSize={20}
            onChange={onChange}
            showSizeChanger={false}
            style={{
              marginTop: "20px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
            }}
          />
        </>
      )}
    </div>
  );
};

export default MyApplications;
