import styles from "./styles.module.scss";
import { CheckCircleFilled } from "@ant-design/icons";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { AxiosError } from "axios";

import Button from "@/components/ui/button/button";
import { useRouter } from "next/navigation";
import { userAtom } from "@/lib/utils/store";
import { formatAmount, formatDateToDayMonthYear } from "@/lib/utils/formatTime";
import CustomSpin from "@/components/ui/spin";
import { getApplicantsbyId } from "@/services/applicantServices";
import { getAllSubscriptionbyId } from "@/services/profileService";


const SubscriptionCard = () => {
  const user = useAtomValue(userAtom);
  const router = useRouter();

  const [getProfileQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-profile"],
        queryFn: () => getApplicantsbyId(user?.id ?? 0),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!user?.id, 
      },
   
    ],
  });


  
  const planId = getProfileQuery?.data?.data?.subscription?.pricing?.plan?.id;
  
  const { data: subPlanData } = useQuery({
    queryKey: ["get-all-sub", planId],
    queryFn: () => getAllSubscriptionbyId(planId),
    retry: 0,
    enabled: !!planId, // only runs when planId is available
    refetchOnWindowFocus: false,
  });

  const features = subPlanData?.data?.features;
  

  const profileData = getProfileQuery?.data?.data;
  const profileDetailsError = getProfileQuery?.error as AxiosError;
  const profileDetailsErrorMessage =
    profileDetailsError?.message ||
    "An error occurred. Please try again later.";

  const getPlanImage = () => {
    const planName = profileData && profileData?.subscription?.pricing?.plan?.name?.toLowerCase();
    if (planName === "gold") return '/gold.svg';
    if (planName === "free") return '/Frame 1618872852.svg';
    return '/platinum.svg';
  };

  console.log(features,'subPlan')

//   const description = profileData && profileData?.subscription?.pricing?.plan
// ?.description
//   const features = description?.split(',');

  return (
    <>
       {getProfileQuery?.isLoading ? (
            <CustomSpin />
          ) : getProfileQuery?.isError ? (
            <h1 className="error">{profileDetailsErrorMessage}</h1>
          ) : (
      <div className={styles.card}>
      <div className={styles.header}>
        <img
          src={getPlanImage()}
          alt={`${profileData?.subscription?.pricing?.plan?.name} plan`}
          className={styles.planImage}
        />

        <span className={styles.planName}>{profileData?.subscription?.pricing?.plan?.name} Plan</span>
      </div>
      <h2 className={styles.price}>
        {profileData?.subscription?.pricing?.duration} months plan -{" "}
        {formatAmount(profileData?.subscription?.pricing?.price)}
      </h2>
      <p className={styles.bill}>Billing cycles</p>

      <div className={styles.timeline}>
        <div className={styles.line}>
          <span className={styles.dot}></span>
          <span className={styles.dot}></span>
        </div>
        <div className={styles.dates}>
          <span>
            {formatDateToDayMonthYear(profileData?.subscription?.created_at)}
            {/* {getTimeFromDate(profileData?.subscription?.created_at)} */}
          </span>
          <span>
            {formatDateToDayMonthYear(profileData?.subscription?.expires_at)}
            {/* {getTimeFromDate(profileData?.subscription?.expires_at)} */}
          </span>
        </div>
      </div>

      <div className={styles.included}>
        <h4>What's included</h4>
        <ul>
          {features?.map((item:any, index:number) => (
            <li key={index}>
              <CheckCircleFilled style={{ color: "green" }} />
              <span>{item?.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.buttons}>
        <Button
          // variant="  "
          // className={"buttonStyle"}
          onClick={() => {
            router.push("/pricing");
            window.scroll(0, 0);
          }}
        >
          Upgrade plan
        </Button>
        {/* <Button
          variant="redOutline"
          // className={"buttonStyle"}
        >
          Cancel Subscription
        </Button> */}
      </div>
    </div>
          )}
    </>
  
  );
};

export default SubscriptionCard;
