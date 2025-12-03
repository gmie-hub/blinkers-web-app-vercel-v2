import styles from "./index.module.scss";
import { Image } from "antd";
import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { getRecommededAds } from "@/services/adsServices";
import CustomSpin from "@/components/ui/spin";

// Main component
const RecommendedAds = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // Number of items to display per page
  const router = useRouter();

  const [getRecommededAdsQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-Recommeded-ads"],
        queryFn: getRecommededAds,
        retry: 0,
        refetchOnWindowFocus: true,
      },
    ],
  });

  const recommededData = getRecommededAdsQuery?.data?.data?.data || [];
  const recommededError = getRecommededAdsQuery?.error as AxiosError;
  const recommededErrorMessage =
    recommededError?.message || "An error occurred. Please try again later.";

  const totalPages = Math.ceil(recommededData.length / pageSize);

  // Calculate the slice of data to display based on the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData =
    recommededData &&
    recommededData?.length > 0 &&
    recommededData?.slice(startIndex, endIndex);

  // Handle left button click (Previous)
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle right button click (Next)
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle dot click to jump to the respective page
  const handleDotClick = (page: number) => {
    setCurrentPage(page);
  };

  // const handleNavigateToProductDetails = (
  //   id: number,
  //   user_id: number,
  //   title: string,
  //   description:string,
  // ) => {
  //   navigate(
  //     `/product-details/${id}/${user_id}/${sanitizeUrlParam(
  //       title
  //     )}/${sanitizeUrlParam(
  //       description
  //     )}}`
  //   );
  //   window.scrollTo(0, 0);
  // };

  const handleNavigateToProductDetails = (id: string) => {
    router.push(`/product-details/${id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.promoWrapper}>
      <div className={styles.promoHead}>
        <p>Recommended Ads</p>

        <div className={styles.arrowContainer}>
          <div
            className={`${styles.arrowButton} ${
              currentPage === 1 ? styles.disabledArrow : styles.greenBackground
            }`}
            onClick={handlePrev}
            style={currentPage === 1 ? { backgroundColor: "#009900" } : {}}
          >
            <Image src="/arrow-left.svg" alt="Left Arrow" preview={false} />
          </div>
          <div
            className={`${styles.arrowButton} ${
              currentPage === totalPages
                ? styles.disabledArrow
                : styles.greenBackground
            }`}
            onClick={handleNext}
            style={
              currentPage === totalPages ? { backgroundColor: "#009900 " } : {}
            }
          >
            <Image src="/arrow-right.svg" alt="Right Arrow" preview={false} />
          </div>
        </div>
      </div>
      {getRecommededAdsQuery?.isLoading ? (
        <CustomSpin />
      ) : getRecommededAdsQuery?.isError ? (
        <h1 className="error">{recommededErrorMessage}</h1>
      ) : (
        <>
          {/* Display the promo images */}
          <section className={styles.promoImageContainer}>
            {currentData &&
              currentData?.length > 0 &&
              currentData?.map((item: any, index: number) => (
                <div className={styles.promoImage} key={index}>
                  <img
                    src={item && item?.recommendable?.cover_image_url}
                    // src={item && item?.recommendable?.add_images[0]?.add_image}
                    alt={"recommendedimg"}
                    // className={styles.trendingProductImage}
                    className={styles.proImage}
                    //  onClick={()=> handleNavigateToProductDetails(item?.recommendable?.id,item?.recommendable?.user_id,item?.recommendable?.title,item?.recommendable?.description)}
                    onClick={() =>
                      handleNavigateToProductDetails(item?.recommendable?.slug)
                    }
                  />

                  {/* <div className={styles.productList}>
                    <p style={{ color: "#4F4F4F" }}>
                      {item?.recommendable?.title &&
                      item?.recommendable?.title?.length > 20
                        ? `${item?.recommendable?.title?.slice(0, 20)}...`
                        : item?.recommendable?.title}
                    </p>
                  </div> */}
                </div>
              ))}
          </section>

          {/* Dot-style pagination */}
          <div className={styles.dotPagination}>
            {Array?.from({ length: totalPages }, (_, index) => (
              <span
                key={index}
                className={`${styles.dot} ${
                  currentPage === index + 1 ? styles.activeDot : ""
                }`}
                onClick={() => handleDotClick(index + 1)}
              ></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecommendedAds;
