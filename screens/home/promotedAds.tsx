import styles from "./index.module.scss";
import { Image } from "antd";
import { useState } from "react";
import { AxiosError } from "axios";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { getPromotedAds, getPromotedAdsById } from "@/services/adsServices";
import CustomSpin from "@/components/ui/spin";

const PromotedAds = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;
  const [selectedAdId, setSelectedAdId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const [getPromotedAdsQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-promoted-ads"],
        queryFn: getPromotedAds,
        retry: 0,
        refetchOnWindowFocus: true,
      },
      {
        queryKey: ["get-promoted-ads-id", selectedAdId],
        queryFn: () => getPromotedAdsById(selectedAdId!),
        retry: 0,
        refetchOnWindowFocus: true,
        // enabled: !!selectedAdId,
        enabled: false,
      },
    ],
  });

  const promotedData = getPromotedAdsQuery?.data?.data?.data || [];
  const promotedError = getPromotedAdsQuery?.error as AxiosError;
  const promotedErrorMessage =
    promotedError?.message || "An error occurred. Please try again later.";

  const totalPages = Math.ceil(promotedData.length / pageSize);

  // Calculate the slice of data to display based on the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData =
    promotedData &&
    promotedData?.length > 0 &&
    promotedData?.slice(startIndex, endIndex);

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

  const handleAdClick = async (id: number, brandUrl: string) => {
    setSelectedAdId(id);

    await queryClient.fetchQuery({
      queryKey: ["get-promoted-ads-id", id],
      queryFn: () => getPromotedAdsById(id),
    });

    if (brandUrl) {
      window.open(brandUrl, "_blank");
    }
  };

  return (
    <div className={styles.promoWrapper}>
      <div className={styles.promoHead}>
        <p>Promoted Ads</p>

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
              currentPage === totalPages ? { backgroundColor: "#009900" } : {}
            }
          >
            <Image src="/arrow-right.svg" alt="Right Arrow" preview={false} />
          </div>
        </div>
      </div>
      
      {getPromotedAdsQuery?.isLoading ? (
        <CustomSpin />
      ) : getPromotedAdsQuery?.isError ? (
        <h1 className="error">{promotedErrorMessage}</h1>
      ) : (
        <>
          {/* Display the promo images */}
          <section className={styles.promoImageContainer}>
            {currentData &&
              currentData?.length > 0 &&
              currentData?.map((item: any, index: number) => (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => handleAdClick(item?.id, item?.brand_url)}
                  // onClick={() => {
                  //   // window.open(item?.brand_url, "_blank");
                  //   setSelectedAdId(item?.id);
                  // }}
                  className={styles.promoImage}
                  key={index}
                >
                  <img
                    // src={item?.image}
                    src={item?.cover_image_url}
                    alt={item?.title}
                    className={styles.proImage}
                  />
                </div>
              ))}
          </section>

          {/* Dot-style pagination */}
          <div className={styles.dotPagination}>
            {Array.from({ length: totalPages }, (_, index) => (
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

export default PromotedAds;
