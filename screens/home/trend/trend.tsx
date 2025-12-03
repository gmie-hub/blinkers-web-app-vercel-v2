import styles from "../index.module.scss";
import { Image, Modal } from "antd";
import Product2 from "/Image.svg";
import locationIcon from "/location.svg";
import favorite from "/Icon + container.svg";
import axios, { AxiosError } from "axios";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import redFavorite from "/redfav.svg";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import GeneralWelcome from "../market/marketLogin/marketLogin";
import { getCityAndState } from "@/lib/utils/location";
import { useRouter } from "next/navigation";
import { userAtom } from "@/lib/utils/store";
import { AddToFav, getTrendingAds } from "@/services/adsServices";
import CustomSpin from "@/components/ui/spin";
import Button from "@/components/ui/button/button";

const Trends = () => {
  const [location, setLocation] = useState<{ city?: string; state?: string }>(
    {}
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const loc = await getCityAndState();
        setLocation(loc);
      } catch (err: any) {
        setError(err);
      }
    })();
  }, []);

  const router = useRouter();
  const user = useAtomValue(userAtom);
  // const { notification } = App.useApp();
  const queryClient = useQueryClient();
  // const currentPath = location.pathname;
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const favData = {
    user_id: user?.id,
  };

  const getFavapi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
      Pragma: "no-cache",
      Expires: "0",
      Authorization: `Bearer ${user?.security_token}`, // Get token from localStorage
    },
    params: favData,
  });

  const getAllFav = async () => {
    const url = `/ads/fav`;

    return (await getFavapi.get(url))?.data;
  };
  const [getTrendingAdsQuery, getAllFavAds] = useQueries({
    queries: [
      {
        queryKey: ["get-trending-ads", location.city, location.state],
        queryFn: () => getTrendingAds(location.city, location.state),
        retry: 0,
        refetchOnWindowFocus: true,
      },
      {
        queryKey: ["get-al-fav", user?.id],
        queryFn: getAllFav,
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!user?.id,
      },
    ],
  });

  const favAdvList = getAllFavAds?.data?.data;

  const trendData = getTrendingAdsQuery?.data?.data || [];
  const trendError = getTrendingAdsQuery?.error as AxiosError;
  const trendErrorMessage =
    trendError?.message || "An error occurred. Please try again later.";

  const handleNavigateToMarket = () => {
    // navigate(`/market`);
    router.push(`/product-listing`);

    window.scrollTo(0, 0); // Scrolls to the top of the page
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

  const addToFavMutation = useMutation({
    mutationFn: AddToFav,
    mutationKey: ["add-fav"],
  });
  const favIcons = favAdvList?.map((fav: AddToFav) => fav.id) || [];

  const addToFavHandler = async (id?: string) => {
    if (!id) return;
    const isFav = favIcons.includes(parseInt(id));

    const payload: Partial<AddToFav> = {
      add_id: id,
      status: isFav ? 0 : 1,
    };

    try {
      await addToFavMutation.mutateAsync(payload, {
        onSuccess: () => {
          // notification.success({
          //   message: "Success",
          //   description: data?.message,
          // });
          queryClient.refetchQueries({
            queryKey: ["get-al-fav"],
          });
        },
      });
    } catch {
      setOpenLoginModal(true);

      // notification.open({
      //   message: "You need to log in to complete this action.",
      //   description: (
      //     <>
      //       <br />
      //       <Button
      //         type="button"
      //         onClick={() => {
      //           notification.destroy();
      //           navigate(`/login?redirect=${currentPath}`);
      //         }}
      //       >
      //         Click here to Login
      //       </Button>
      //     </>
      //   ),
      //   placement: "top",
      //   duration: 4, // Auto close after 5 seconds
      //   icon: null,
      // });
    }
  };

  return (
    <div className={styles.accessWrapper}>
      <div>
        <p className={styles.TrendsHead}>Trending Now</p>
      </div>
      {getTrendingAdsQuery?.isLoading ? (
        <CustomSpin />
      ) : getTrendingAdsQuery?.isError ? (
        <h1 className="error">{trendErrorMessage}</h1>
      ) : (
        <section className={styles.trendContainer}>
          <div className={styles.leftSectionTrend}>
            {trendData &&
              trendData?.length > 0 &&
              trendData
                ?.slice(0, 2)
                ?.map((item: ProductDatum, index: number) => (
                  <div
                    // onClick={() =>
                    //   handleNavigateToProductDetails(
                    //     item?.id,
                    //     item?.user_id,
                    //     item?.title,
                    //     item?.description,
                    //   )
                    // }

                    onClick={() => handleNavigateToProductDetails(item?.slug)}
                    className={styles.trendImage}
                    key={item?.id || index}
                  >
                    <div
                      className={styles.favoriteIcon}
                      onClick={(event) => {
                        event.stopPropagation(); // Prevents click from bubbling to parent div
                        addToFavHandler(item?.id?.toString());
                      }}
                    >
                      <Image
                        width={30}
                        src={
                          favIcons.includes(item?.id) ? redFavorite : favorite
                        }
                        alt="Favorite"
                        preview={false}
                      />
                    </div>
                    <img
                      // width={"100%"}
                      className={styles.trendingProductImage}
                      src={item?.cover_image_url || Product2}
                      alt={item?.title || "Product Image"}
                      // preview={false}
                    />
                    <div className={styles.productList}>
                      {/* <p style={{color:'#4F4F4F'}}>{item?.title || "No Title"}</p> */}
                      <p style={{ color: "#4F4F4F" }}>
                        {item?.title && item?.title?.length > 30
                          ? `${item?.title?.slice(0, 30)}...`
                          : item?.title}
                      </p>
                      <div className={styles.info}>
                        <img src={locationIcon} alt="locationIcon" />

                        <p>
                          <span>
                            {item?.local_govt?.local_government_area &&
                              item?.local_govt?.local_government_area + ", "}
                          </span>

                          <span>{item?.state?.state_name}</span>
                        </p>
                      </div>

                      <span className={styles.trendingdiscount}>
                        {item?.discount_price && `₦${item?.discount_price}`}
                      </span>

                      <span>
                        {item?.discount_price === "" ? (
                          <span>{`₦${item?.price}`}</span>
                        ) : (
                          <span
                            className={styles.canceledText}
                          >{`₦${item?.price}`}</span>
                        )}
                      </span>

                      {/* <div className={styles.starWrapper}>
                      {countUpTo(
                        item?.rating || 0,
                        <Image
                          width={20}
                          src={StarYellow}
                          alt="StarYellow"
                          preview={false}
                        />,
                        <Image
                          width={20}
                          src={Star}
                          alt="Star"
                          preview={false}
                        />
                      )}
                      <span>(20)</span>
                    </div> */}
                    </div>
                  </div>
                ))}
          </div>

          {/* Middle section with one item centered */}
          <div className={styles.middleSectionTrend}>
            {trendData[3] && (
              <div
                // onClick={() =>
                //   handleNavigateToProductDetails(
                //     trendData[3]?.id,
                //     trendData[3]?.user_id,
                //     trendData[3]?.title,
                //     trendData[3]?.description,

                //   )
                // }
                onClick={() =>
                  handleNavigateToProductDetails(trendData[3]?.slug)
                }
                className={styles.trendImage}
                key={trendData[3].id}
              >
                <div
                  className={styles.favoriteIcon}
                  onClick={(event) => {
                    event.stopPropagation(); // Prevents click from bubbling to parent div
                    addToFavHandler(trendData[3]?.id?.toString());
                  }}
                >
                  <Image
                    width={30}
                    src={
                      favIcons.includes(parseInt(trendData[3]?.id))
                        ? redFavorite
                        : favorite
                    }
                    alt="Favorite"
                    preview={false}
                  />
                </div>
                <img
                  // width={"100%"}
                  className={styles.trendingProductImage}
                  src={trendData[3]?.cover_image_url || Product2}
                  alt={trendData[3]?.title || "Product Image"}
                  // preview={false}
                />
                <div className={styles.productList}>
                  <p style={{ color: "#4F4F4F" }}>
                    {trendData[3]?.title && trendData[3]?.title?.length > 30
                      ? `${trendData[3]?.title?.slice(0, 30)}...`
                      : trendData[3]?.title}
                  </p>{" "}
                  <div className={styles.info}>
                    <img src={locationIcon} alt="locationIcon" />

                    <p>
                      <span>
                        {trendData[3]?.local_govt?.local_government_area &&
                          trendData[3]?.local_govt?.local_government_area +
                            ", "}
                      </span>

                      <span>{trendData[3]?.state?.state_name}</span>
                    </p>
                  </div>
                  <span className={styles.trendingdiscount}>
                    {trendData[3]?.discount_price &&
                      `₦${trendData[3]?.discount_price} (Discounted)`}
                  </span>
                  <span>
                    {trendData[3]?.discount_price === "" ? (
                      <span>{`₦${trendData[3]?.price}`}</span>
                    ) : (
                      <span
                        className={styles.canceledText}
                      >{`₦${trendData[3]?.price}`}</span>
                    )}
                  </span>
                  {/* <div className={styles.starWrapper}>
                    {countUpTo(
                      trendData[3]?.rating || 0,
                      <Image
                        width={20}
                        src={StarYellow}
                        alt="StarYellow"
                        preview={false}
                      />,
                      <Image width={20} src={Star} alt="Star" preview={false} />
                    )}
                    <span>(20)</span>
                  </div> */}
                </div>
              </div>
            )}
            <Button
              type="button"
              variant="green"
              text="Shop Now"
              className={styles.buttonStyleTrend}
              onClick={handleNavigateToMarket}
            />
          </div>

          {/* Right section with two items */}

          <div className={styles.rightSectionTrend}>
            {trendData &&
              trendData?.length > 0 &&
              trendData
                ?.slice(4, 6)
                ?.map((item: ProductDatum, index: number) => (
                  <div
                    // onClick={() =>
                    //   handleNavigateToProductDetails(
                    //     item?.id,
                    //     item?.user_id,
                    //     item?.title,
                    //     item?.description,
                    //   )
                    // }
                    onClick={() => handleNavigateToProductDetails(item?.slug)}
                    className={styles.trendImage}
                    key={item?.id || index}
                  >
                    <div
                      className={styles.favoriteIcon}
                      onClick={(event) => {
                        event.stopPropagation(); // Prevents click from bubbling to parent div
                        addToFavHandler(item?.id?.toString());
                      }}
                    >
                      <Image
                        width={30}
                        src={
                          favIcons.includes(item?.id) ? redFavorite : favorite
                        }
                        alt="Favorite"
                        preview={false}
                      />
                    </div>
                    <img
                      // width={"100%"}
                      className={styles.trendingProductImage}
                      src={item?.cover_image_url || Product2}
                      alt={item?.title || "Product Image"}
                      // preview={false}
                    />
                    <div className={styles.productList}>
                      <p style={{ color: "#4F4F4F" }}>
                        {item?.title && item?.title?.length > 30
                          ? `${item?.title?.slice(0, 30)}...`
                          : item?.title}
                      </p>
                      <div className={styles.info}>
                        <img src={locationIcon} alt="locationIcon" />
                        <p>
                          <span>
                            {item?.local_govt?.local_government_area &&
                              item?.local_govt?.local_government_area + ", "}
                          </span>

                          <span>{item?.state?.state_name}</span>
                        </p>{" "}
                      </div>

                      <span className={styles.trendingdiscount}>
                        {item?.discount_price && `₦${item?.discount_price} `}
                      </span>
                      <span>
                        {item?.discount_price === "" ? (
                          <span>{`₦${item?.price}`}</span>
                        ) : (
                          <span
                            className={styles.canceledText}
                          >{`₦${item?.price}`}</span>
                        )}
                      </span>
                      {/* <div className={styles.starWrapper}>
                      {countUpTo(
                        item?.rating || 0,
                        <Image
                          width={20}
                          src={StarYellow}
                          alt="StarYellow"
                          preview={false}
                        />,
                        <Image
                          width={20}
                          src={Star}
                          alt="Star"
                          preview={false}
                        />
                      )}
                      <span>(20)</span>
                    </div> */}
                    </div>
                  </div>
                ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="button"
              variant="green"
              text="Shop Now"
              className={styles.buttonStyleTrendBigscreen}
              onClick={handleNavigateToMarket}
            />
          </div>
        </section>
      )}

      <Modal
        open={openLoginModal}
        onCancel={() => setOpenLoginModal(false)}
        centered
        footer={null}
      >
        <GeneralWelcome handleCloseModal={() => setOpenLoginModal(false)} />
      </Modal>
    </div>
  );
};

export default Trends;
