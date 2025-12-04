import styles from "./postedJob.module.scss";
import { useNavigate,  } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Spin } from "antd"; // Import Spin from Ant Design
import { getJobBYBusinessId } from "../../../request";
import { userAtom } from "../../../../utils/store";
import { useAtomValue } from "jotai";
import { formatDateToMonthYear } from "../../../../utils/formatTime";
import Card from "../../../../customs/card/card";

interface JobItem {
  id: number;
  title: string;
  job_type: string;
  status: string;
  total_applicant: number;
  start_date: string;
}

export default function JobPosted() {
  const navigate = useNavigate();
  const user = useAtomValue(userAtom);

  const [getAllJobByBusinessQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-all-jobs",user?.id],
        queryFn: () => getJobBYBusinessId(user?.id!),
        retry: 0,
        refetchOnWindowFocus: false,
        enabled:!!user?.id!
      },
    ],
  });

  const handleNavigateToViewJobDetails = 
    (jobId: number) => {
      navigate(`/view-job-details/${jobId}`);

    }
  

  const JobData = getAllJobByBusinessQuery?.data?.data?.data || [];
  const jobError = getAllJobByBusinessQuery?.error as AxiosError;
  const jobErrorMessage =
    jobError?.message || "An error occurred. Please try again later.";

  const jobPostedJsx =JobData && JobData?.map((item: JobItem, index: number) => (
    <Card
      key={index}
      onClick={() => handleNavigateToViewJobDetails(item.id)}
      style={styles.card}
    >
      <div className={styles.headerWrapper}>
        <img style={{borderRadius:'50%'}} width={20} src={user?.business?.logo} alt="businesslogo"  />
        <h3>{item?.title}</h3>
      </div>

      <div className={styles.wrapper1}>
        <div className={styles.jobKindWrapper}>
          <p>{item?.job_type}</p>
        </div>
      </div>

      <div className={styles.status}>
        <p>
          {item.status?.toString() === "0"
            ? "InActive"
            : item.status?.toString() === "1"
            ? "Active"
            : item.status?.toString() === "2"
            ? "Closed"
            : "Banned"}
        </p>
        <p>{item.total_applicant} Applicant/s</p>
      </div>

      <div className={styles.date}>
        <p>Date Posted:</p>
        <p>{formatDateToMonthYear(item.start_date)}</p>
      </div>
    </Card>
  ));

  return (
    <div className={styles.wrapper}>
      {getAllJobByBusinessQuery?.isLoading ? (
        <Spin />
      ) : getAllJobByBusinessQuery?.isError ? (
        <h1 className="error">{jobErrorMessage}</h1>
      ) : JobData.length > 0 ? (
        jobPostedJsx
      ) : (
        <div>No Job</div>
      )}
    </div>
  );
}
