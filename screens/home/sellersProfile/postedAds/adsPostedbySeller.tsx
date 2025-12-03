import styles from "./index.module.scss";
import { Image, Pagination } from "antd";
import { useQueries } from "@tanstack/react-query";
import { useEffect } from "react";
import usePagination from "@/hooks/usePagination";
import { useRouter, useSearchParams } from "next/navigation";
import RouteIndicator from "@/components/ui/routeIndicator";
import { countUpTo } from "@/lib/utils";
import { getAdsByUserId } from "@/services/adsServices";

const SellersAds = ({
  limit,
  showHeading = true,
}: {
  limit?: number;
  showHeading?: boolean;
}) => {
  const { currentPage, setCurrentPage, onChange, pageNum } = usePagination();
  const router = useRouter();
  const id = useSearchParams().get("id");

  useEffect(() => {
    if (currentPage !== pageNum) {
      setCurrentPage(pageNum);
    }
  }, [pageNum, currentPage, setCurrentPage]);

  const [getAllAdsBySellersQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-sellers-details", id, currentPage],
        queryFn: () => getAdsByUserId(parseInt(id!), currentPage),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!id,
      },
    ],
  });

  const adsPosted = getAllAdsBySellersQuery?.data?.data?.data || [];

  // const handleNavigateToProductDetails = (
  //   id: number,
  //   user_id: number,
  //   title: string,
  //   description: string
  // ) => {
  //   navigate(
  //     `/product-details/${id}/${user_id}/${sanitizeUrlParam(
  //       title
  //     )}/${sanitizeUrlParam(description)}}`
  //   );
  //   window.scrollTo(0, 0);
  // };

  const handleNavigateToProductDetails = (id: string) => {
    router.push(`/product-details/${id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="wrapper" style={{ marginBlock: "2rem" }}>
      {showHeading && <RouteIndicator showBack />}

      <div>
        {showHeading && (
          <div className={styles.promoHead}>
            <p style={{ paddingBlockEnd: "2.4rem" }}>
              Ads Posted By {adsPosted[0]?.user?.name}
            </p>
          </div>
        )}

        {/* Display the promo images with the limit applied */}
        <section className={styles.promoImageContainer}>
          {adsPosted &&
            adsPosted?.length > 0 &&
            adsPosted
              ?.slice(0, limit || adsPosted?.length)
              ?.map((item: ProductDatum, index: number) => (
                <div
                  className={styles.promoImage}
                  key={index}
                  // onClick={() =>
                  //   handleNavigateToProductDetails(
                  //     item?.id,
                  //     item?.user_id,
                  //     item?.title,
                  //     item?.description
                  //   )
                  // }
                  onClick={() => handleNavigateToProductDetails(item?.slug)}
                >
                  <img
                    src={item?.add_images[0]?.add_image || "/Image (1).svg"}
                    alt={item?.title || "Ad"}
                    className={styles.proImage}
                  />
                  <div className={styles.productList}>
                    <p style={{ color: "#4F4F4F" }}>
                      {item?.title && item?.title?.length > 20
                        ? `${item?.title?.slice(0, 20)}...`
                        : item?.title}
                    </p>
                    <div className={styles.info}>
                      <Image width={30} src="/locationrelated.svg" alt="LocationIcon" />
                      <p>
                        <span>
                          {item?.local_govt?.local_government_area &&
                            item?.local_govt?.local_government_area + ", "}
                        </span>
                        <span>{item?.state?.state_name}</span>
                      </p>
                    </div>
                    {/* <span className={styles.trendingdiscount}>
                      {item?.discount_price &&
                        `₦${item?.discount_price} `}
                    </span> */}
                    <span style={{ color: "#222222", fontWeight: "600" }}>
                      {/* ₦{item?.price} */}
                      {item?.discount_price === "" ? (
                        <span>{`₦${item?.price}`}</span>
                      ) : (
                        <span className={styles.canceledText}>
                          {`₦${item?.price}`}{" "}
                        </span>
                      )}
                      <span>
                        {" "}
                        {item?.discount_price && `₦${item?.discount_price} `}
                      </span>
                    </span>

                    <div className={styles.starWrapper}>
                      {countUpTo(
                        parseInt(item?.averageRating),

                        <Image
                          width={30}
                          src="/staryellow.svg"
                          alt="StarYellow"
                          preview={false}
                        />,
                        <Image
                          width={30}
                          src="/Vector.svg"
                          alt="Star"
                          preview={false}
                        />
                      )}
                      <span>({item?.averageRating})</span>
                    </div>
                  </div>
                </div>
              ))}
        </section>
      </div>

      {showHeading && (
        <Pagination
          current={currentPage}
          total={getAllAdsBySellersQuery?.data?.data?.total} // Total number of items
          pageSize={50} // Number of items per page
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

export default SellersAds;
