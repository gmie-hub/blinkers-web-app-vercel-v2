import styles from "./details.module.scss";
import { Image,  } from "antd";
import { useQueries } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { getAllReviews } from "@/services/reviewServices";
import CustomSpin from "@/components/ui/spin";
import Button from "@/components/ui/button/button";
import { convertDate, getTimeFromDate } from "@/lib/utils/formatTime";
import { countUpTo } from "@/lib/utils";

// Reviews Component
export default function Reviews({
  canSeeAllBtn = true,
  limit,
}: {
  canSeeAllBtn?: boolean;
  limit?: number;
}) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // Fetch reviews
  const [getAllReviewQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-all-review", id,],
        queryFn: () => getAllReviews(id!,),
        retry: 0,
        refetchOnWindowFocus: false,
        enabled:!!id
      },
    ],
  });

  const reviewData = getAllReviewQuery?.data?.data?.data || [];
  const reviewError = getAllReviewQuery?.error as AxiosError;
  const reviewErrorMessage =
    reviewError?.message || "An error occurred. Please try again later.";

  // Dynamically set limit to reviewData.length if limit is undefined
  const calculatedLimit = limit ?? reviewData.length;
  const businessReviewData =
    reviewData &&
    reviewData?.length > 0 &&
    reviewData?.slice(0, calculatedLimit);

  console.log(businessReviewData, "businessReviewData");
  const handleNavigateToReview = () => {
    router.push(`/review`);
    window.scrollTo(0, 0);
  };

  const handleNavigateReview = () => {
    router.push(`/review/${id}`);
    window.scrollTo(0, 0);
  };

  // Render
  return (
    <div style={{ minWidth: "100%" }}>
      {getAllReviewQuery?.isLoading ? (
        <CustomSpin />
      ) : getAllReviewQuery?.isError ? (
        <h1 className="error">{reviewErrorMessage}</h1>
      ) : (
        <div className={styles.wrapper}>
          <div style={{ width: "100%" }}>
            <div onClick={handleNavigateReview} className={styles.reviewbtn}>
              <h1>Reviews</h1>

              {reviewData?.length > 0 && (
                <div className={styles.btnWrapper}>
                  <p className={styles.btn}>See All</p>
                  <Image
                    width={20}
                    src="/arrow-right-green.svg"
                    alt="ArrowIcon"
                    preview={false}
                  />
                </div>
              )}
            </div>
          </div>

          {businessReviewData && businessReviewData?.length > 0 ? (
            businessReviewData?.map((item, index) => (
              <ReviewCard key={index} item={item} />
            ))
          ) : (
            // <NoReviews navigate={navigate} />
            <div className={styles.review}>
              <p>No reviews added yet</p>
            </div>
          )}

          {reviewError && <p>{reviewErrorMessage}</p>}
     

          {canSeeAllBtn &&
            businessReviewData &&
            businessReviewData.length > 0 && (
              <div className={styles.seeBtn}>
                <Button
                  text="See All Reviews"
                  variant="transparent"
                  className="buttonStyle"
                  onClick={handleNavigateToReview}
                  AfterTexticon={
                    <Image
                      width={20}
                      src="/arrow-right-green.svg"
                      alt="ArrowIcon"
                      preview={false}
                    />
                  }
                />
              </div>
            )}
        </div>
      )}
    </div>
  );
}

// Review Card Component
function ReviewCard({ item }: { item: ReviewDatum }) {
  return (
    <div className={styles.card}>
      <div className={styles.dateTimeWrapper}>
        <div>
          <span>{convertDate(item?.created_at) || ""}</span>
          <div></div>
          <span>{getTimeFromDate(item?.created_at) || ""}</span>
        </div>
        <span>{item?.user?.name}</span>
      </div>
      <div className={styles.starWrapper}>
        {countUpTo(
          item.rating || 0,
          <Image
            width={20}
            src="/staryellow.svg"
            alt="StarYellow"
            preview={false}
          />,
          <Image width={20} src="/Vector.svg" alt="StarIcon" preview={false} />
        )}
      </div>
      <div className={styles.reviewContent}>{item.review}</div>
      
    </div>
  );
}