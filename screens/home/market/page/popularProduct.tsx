import styles from "./index.module.scss";
import { Image, Modal, Pagination } from "antd";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import  { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";

import { AddToFav, getAllFav, getAllPopularMarket } from "@/services/adsServices";
import GeneralWelcome from "../marketLogin/marketLogin";
import { userAtom } from "@/lib/utils/store";
import usePagination from "@/hooks/usePagination";
import CustomSpin from "@/components/ui/spin";
import { countUpTo } from "@/lib/utils";
import { useRouter } from "next/navigation";

const PopularProducts = () => {
  const router = useRouter();
  const { currentPage, setCurrentPage, onChange, pageNum } = usePagination();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  useEffect(() => {
    if (currentPage !== pageNum) {
      setCurrentPage(pageNum);
    }
  }, [pageNum, currentPage, setCurrentPage]);

  // === React Query multiple queries ===
  const [getAllPopularMarketQuery, getAllFavAds] = useQueries({
    queries: [
      {
        queryKey: ["get-popular-ads", currentPage],
        queryFn: () => getAllPopularMarket(currentPage, 50),
        retry: 0,
        refetchOnWindowFocus: true,
      },
      {
        queryKey: ["get-all-fav", user?.id],
        queryFn: ()=>getAllFav(user?.id),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!user?.id, // Only fetch favorites if user is logged in
      },
    ],
  });

  const favAdvList = getAllFavAds?.data?.data || [];
  const favIcons = favAdvList.map((fav: AddToFav) => fav.id) || [];

  const marketData = getAllPopularMarketQuery?.data?.data || [];
  const marketError = getAllPopularMarketQuery?.error as AxiosError;
  const marketErrorMessage =
    marketError?.message || "An error occurred. Please try again later.";

    console.log(marketData,'marketData')
  // === Navigation ===
  const handleNavigateToProductDetails = (id: string) => {
    router.push(`/product-details/${id}`);
    window.scrollTo(0, 0);
  };

  // === Add/Remove from Favorites ===
  const addToFavMutation = useMutation({
    mutationFn: AddToFav,
    mutationKey: ["add-fav"],
  });

  const addToFavHandler = async (id?: string) => {
    if (!id) return;

    if (!user?.id) {
      setOpenLoginModal(true);
      return;
    }

    const isFav = favIcons.includes(parseInt(id));

    const payload: Partial<AddToFav> = {
      add_id: id,
      status: isFav ? 0 : 1,
    };

    try {
      await addToFavMutation.mutateAsync(payload, {
        onSuccess: () => {
          queryClient.refetchQueries({ queryKey: ["get-all-fav"] });
        },
      });
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  return (
    <>
      {getAllPopularMarketQuery?.isLoading ? (
        <CustomSpin />
      ) : getAllPopularMarketQuery?.isError ? (
        <h1 className="error">{marketErrorMessage}</h1>
      ) : (
        <div>
          <section className={styles.promoImageContainer}>
            {marketData && marketData?.length > 0 &&
              marketData?.map((item: any, index: number) => (
                <div
                  className={styles.promoImage}
                  key={index}
                  onClick={() => handleNavigateToProductDetails(item?.slug)}
                >
                  <div
                    className={styles.favoriteIcon}
                    onClick={(event) => {
                      event.stopPropagation();
                      addToFavHandler(item?.id?.toString());
                    }}
                  >
                    <img
                      width={30}
                      src={favIcons.includes(item?.id) ? "/redfav.svg" : "/Icon + container.svg"}
                      alt="Favorite"
                    />
                  </div>

                  <img
                    className={styles.proImage}
                    src={item?.cover_image_url || "/Image (1).svg"}
                    alt="Product"
                  />

                  <div className={styles.productList}>
                    <p style={{ color: "#4F4F4F" }}>
                      {item?.title?.length > 20
                        ? `${item?.title.slice(0, 20)}...`
                        : item?.title}
                    </p>

                    <div className={styles.info}>
                      <Image src="/locationrelated.svg" alt="LocationIcon" preview={false} />
                      <p>
                        <span>
                          {item?.local_govt?.local_government_area &&
                            item?.local_govt?.local_government_area + ", "}
                        </span>
                        <span>{item?.state?.state_name}</span>
                      </p>
                    </div>

                    <span style={{ color: "#222222", fontWeight: "600" }}>
                      {item?.discount_price === "" ? (
                        <span>{`₦${item?.price}`}</span>
                      ) : (
                        <>
                          <span className={styles.canceledText}>
                            ₦{item?.price}
                          </span>{" "}
                          <span>₦{item?.discount_price}</span>
                        </>
                      )}
                    </span>

                    <div className={styles.starWrapper}>
                      {countUpTo(
                        parseInt(item?.average_rating),
                        <Image
                          width={20}
                          src="/staryellow.svg"
                          alt="StarYellow"
                          preview={false}
                        />,
                        <Image width={20} src="/Vector.svg" alt="Star" preview={false} />
                      )}
                      <span>({item?.total_rating})</span>
                    </div>
                  </div>
                </div>
              ))}
          </section>

          <Pagination
            current={currentPage}
            total={getAllPopularMarketQuery?.data?.data?.total || 0}
            pageSize={50}
            onChange={onChange}
            showSizeChanger={false}
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          />
        </div>
      )}

      <Modal
        open={openLoginModal}
        onCancel={() => setOpenLoginModal(false)}
        centered
        footer={null}
      >
        <GeneralWelcome handleCloseModal={() => setOpenLoginModal(false)} />
      </Modal>
    </>
  );
};

export default PopularProducts;
