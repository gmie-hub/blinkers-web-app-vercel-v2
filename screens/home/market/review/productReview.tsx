import styles from "./review.module.scss";
import { Image, Pagination } from "antd";
import { AxiosError } from "axios";
import { useQueries } from "@tanstack/react-query";
import { useEffect } from "react";
import usePagination from "@/hooks/usePagination";
import { useParams, useRouter } from "next/navigation";
import { getAllSellerReviews } from "@/services/reviewServices";
import CustomSpin from "@/components/ui/spin";
import { convertDate } from "@/lib/utils/formatTime";
import { countUpTo } from "@/lib/utils";

export default function AllProductReviews() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { currentPage, setCurrentPage, onChange, pageNum } = usePagination();

  useEffect(() => {
    if (currentPage !== pageNum) {
      setCurrentPage(pageNum);
    }
  }, [pageNum, currentPage, setCurrentPage]);

  const handleNavigateToBack = () => {
    router.back();
    window.scrollTo(0, 0);
  };

  const [getAllReviewQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-all-review", id, currentPage],
        queryFn: () => getAllSellerReviews(id!, currentPage),
        retry: 0,
        refetchOnWindowFocus: false,
        enabled: !!id,
      },
    ],
  });

  const reviewData = getAllReviewQuery?.data?.data?.data || [];
  const reviewError = getAllReviewQuery?.error as AxiosError;
  const reviewErrorMessage =
    reviewError?.message || "An error occurred. Please try again later.";

  return (
    <div className="wrapper">
      <div onClick={handleNavigateToBack} className={styles.back}>
        <Image width={9} src="/back.svg" alt="BackIncon" preview={false} />
        <p>Back</p>
      </div>

      <div className={styles.reviweWrapper}>
        <div className={styles.promoHead}>
          <p>Reviews</p>
        </div>
        {getAllReviewQuery?.isLoading ? (
          <CustomSpin />
        ) : getAllReviewQuery?.isError ? (
          <h1 className="error">{reviewErrorMessage}</h1>
        ) : (
          <div className={styles.wrappers}>
            {reviewData && reviewData?.length > 0 ? (
              reviewData?.map((item, index) => (
                <div className={styles.card} key={index}>
                  <div className={styles.dateTimeWrapper}>
                    <div>
                      <span>{convertDate(item?.created_at) || ""}</span>
                      <div></div>
                      <span>{convertDate(item?.created_at) || ""}</span>
                    </div>
                    <span>{item?.from_user?.name}</span>
                  </div>
                  <div className={styles.starWrapper}>
                    {countUpTo(
                      item?.rating || 0,
                      <Image
                        width={20}
                        src="/staryellow.svg"
                        alt="StarYellow"
                        preview={false}
                      />,
                      <Image
                        width={20}
                        src="/Vector.svg"
                        alt="StarIcon"
                        preview={false}
                      />
                    )}
                  </div>
                  <div className={styles.reviewContent}>{item?.review}</div>
                </div>
              ))
            ) : (
              <p>No reviews available.</p>
            )}
          </div>
        )}
      </div>
      
      <Pagination
        current={currentPage}
        total={getAllReviewQuery?.data?.data?.total} // Total number of items
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
    </div>
  );
}
