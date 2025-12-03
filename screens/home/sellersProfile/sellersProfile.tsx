import styles from "./sellersProfile.module.scss";
import { App, Image, Modal } from "antd";
import SellersAds from "./postedAds/adsPostedbySeller";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtomValue } from "jotai";
import { useState } from "react";
import FlagSeller from "../market/flagSeller/flagSeller";
import ProductReviews from "../market/productDetails/tabs/productReview";
import GeneralWelcome from "../market/marketLogin/marketLogin";
import { useRouter, useSearchParams } from "next/navigation";
import CustomSpin from "@/components/ui/spin";
import RouteIndicator from "@/components/ui/routeIndicator";
import { formatDateToMonthYear } from "@/lib/utils/formatTime";
import Button from "@/components/ui/button/button";
import { errorMessage } from "@/lib/utils/errorMessage";
import { userAtom } from "@/lib/utils/store";
import { getApplicantsbyId } from "@/services/applicantServices";
import { FollowSeller, getFollowersByUser_id } from "@/services/businessServices";

const SellerProfile = () => {
  const router = useRouter();
  const id = useSearchParams().get("id");

  // const currentPath = location.pathname;
  const { notification } = App.useApp();
  const user = useAtomValue(userAtom);
  const queryClient = useQueryClient();
  const [flagSeller, setFlagSeller] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  // const hasReviews = reviewData?.length;
  // console.log(hasReviews, "hasReviews");

  // const handleNavigateToReview = () => {
  //   navigate(`/review`);
  //   window.scrollTo(0, 0);
  // };

  const handleNavigateToSellersAds = () => {
    router.push(`/seller-ads/${id}`);
    window.scrollTo(0, 0);
  };

  const handleNavigateToWriteReview = () => {
    if (!user) {
      setOpenLoginModal(true);
    } else {
      router.push(`/review-seller/${id}`);
      window.scrollTo(0, 0);
    }
  };

  const handlFlagSeller = () => {
    if (!user) {
      setOpenLoginModal(true);
    } else {
      setFlagSeller(true);
    }
  };
  const [getSellersDetailsQuery, getSellersFollowersQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-sellers-details", id],
        queryFn: () => getApplicantsbyId(parseInt(id!)),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!id,
      },
      {
        queryKey: ["get-sellers-followers"],
        queryFn: () => getFollowersByUser_id(user?.id ?? 0, parseInt(id!)),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: Boolean(user?.id) && Boolean(parseInt(id!)),
      },
    ],
  });

  const hasUserFlaggedSeller = getSellersFollowersQuery?.data?.data?.data?.some(
    (item) => item?.follower_id === user?.id
  );

  const sellersDetailsData = getSellersDetailsQuery?.data?.data;
  const sellersDetailsError = getSellersDetailsQuery?.error as AxiosError;
  const sellersDetailsErrorMessage =
    sellersDetailsError?.message ||
    "An error occurred. Please try again later.";

  const followSellersMutation = useMutation({
    mutationFn: FollowSeller,
    mutationKey: ["follow-seller"],
  });

  const followSellerHandler = async () => {
    const payload: Partial<FollowBusiness> = {
      user_id: parseInt(id!),
      action: hasUserFlaggedSeller ? "unfollow" : "follow",
    };

    try {
      await followSellersMutation.mutateAsync(payload, {
        onSuccess: (data) => {
          notification.success({
            title: "Success",
            description: data?.message,
          });
          queryClient.refetchQueries({
            queryKey: ["get-sellers-followers"],
          });
        },
      });
    } catch (error) {
      notification.error({
        title: "Error",
        description: errorMessage(error) || "An error occur",
      });
    }
  };

  const handleFollowSeller = () => {
    if (!user) {
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
    } else {
      followSellerHandler();
    }
  };

  return (
    <>
      {getSellersDetailsQuery?.isLoading ? (
        <CustomSpin />
      ) : getSellersDetailsQuery?.isError ? (
        <h1 className="error">{sellersDetailsErrorMessage}</h1>
      ) : (
        <div className="wrapper">
          <div className={styles.container}>
            <div
              className={styles.image}
              style={{
                backgroundImage: `url(/Icon_container.svg)`, // Ensure you use the correct image reference
              }}
            >
              <div className={styles.home}>
                <p className={styles.picHead}>Seller’s Profile</p>
              </div>
            </div>

            <RouteIndicator showBack />

            <div className={styles.mainContainer}>
              <div className={styles.leftSection}>
                <div className={styles.card}>
                  <div>
                    <div className={styles.passport}>
                      <img
                        src={sellersDetailsData?.profile_image || "/Avatarprofile.svg"}
                        alt="ProductIcon"
                        className={styles.sellerLogo}
                      />

                      <div className={styles.detailsflex}>
                        <p className={styles.name}>
                          {sellersDetailsData?.name}
                        </p>
                        <div className={styles.starWrapper}>
                          <span className={styles.star}>
                            <Image
                              width={20}
                              src="/staryellow.svg"
                              alt="StarYellow"
                              preview={false}
                            />
                            ({sellersDetailsData?.total_rating}
                            {sellersDetailsData &&
                            sellersDetailsData?.total_rating < 2
                              ? " rating"
                              : " ratings"}
                            )<span className={styles.dot}></span>{" "}
                            <span>
                              {sellersDetailsData?.total_followers}{" "}
                              {sellersDetailsData &&
                              sellersDetailsData?.total_followers < 2
                                ? "Follower"
                                : "Followers"}
                            </span>
                          </span>
                        </div>
                      </div>

                      <p>
                        Member Since{" "}
                        {formatDateToMonthYear(
                          sellersDetailsData?.created_at || ""
                        )}
                      </p>
                      <p style={{ paddingBlock: "0.2rem" }}>
                        Number of Ads Posted:{" "}
                        <span> {sellersDetailsData?.total_ads}</span>{" "}
                      </p>
                    </div>
                  </div>
                  <div className={styles.followBtn}>
                    {user?.id !== sellersDetailsData?.id && (
                      <Button
                        disabled={followSellersMutation?.isPending}
                        onClick={handleFollowSeller}
                        text={
                          hasUserFlaggedSeller
                            ? followSellersMutation?.isPending
                              ? "Unfollowing"
                              : "Unfollow"
                            : followSellersMutation?.isPending
                            ? "Following"
                            : "Follow"
                        }
                        variant="green"
                      />
                    )}
                    {user?.id !== sellersDetailsData?.id && (
                      <Button
                        variant="white"
                        text="Write A Review"
                        icon={<Image src="/starger.svg" alt="star" preview={false} />}
                        onClick={() => {
                          handleNavigateToWriteReview();
                        }}
                      />
                    )}
                  </div>
                  <div></div>
                  <div className={styles.info}>
                    <div className={styles.infos}>
                      <Image src="/mailicon.svg" alt="MailIcon" preview={false} />

                      <p>{sellersDetailsData?.email}</p>
                    </div>
                    <div className={styles.infos}>
                      <Image src="/callclaim.svg" alt="CallIcon" preview={false} />

                      <p>{sellersDetailsData?.number || "NA"}</p>
                    </div>
                    <div className={styles.infos}>
                      <Image
                        src="/locationnot.svg"
                        alt="LocationIcon"
                        preview={false}
                      />
                      {sellersDetailsData?.address}
                    </div>{" "}
                    <div className={styles.infos}>
                      <Image src="/webicon.svg" alt="WebICon" preview={false} />

                      <p>{sellersDetailsData?.website_address || "Na"}</p>
                    </div>{" "}
                  </div>

                  {/* <div className={styles.chatBtn}>
                    <Button
                      variant="white"
                      icon={
                        <Image src={ChatIcon} alt="CallLogo" preview={false} />
                      }
                      text="  Chat With Seller"
                    />
                  </div> */}

                  {/* <div className={styles.flag}> */}
                  <Button
                    icon={
                      <Image src="/flag.svg" alt="FlagLogo" preview={false} />
                    }
                    text={
                      hasUserFlaggedSeller ? "Unflag Seller" : "Flag Seller"
                    }
                    variant="redOutline"
                    onClick={handlFlagSeller}
                  />
                  {/* </div> */}

                  <div className={styles.social}>
                    {sellersDetailsData?.whatsapp_address && (
                      <Image
                        src="/whatsapp.svg"
                        alt="WhatsappLogo"
                        preview={false}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    {sellersDetailsData?.instagram_address && (
                      <Image
                        src="/instagram.svg"
                        alt="InstagramIcon"
                        preview={false}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (sellersDetailsData?.instagram_address) {
                            window.open(
                              sellersDetailsData?.instagram_address,
                              "_blank"
                            );
                          }
                        }}
                      />
                    )}
                    {sellersDetailsData?.facebook_address && (
                      <Image
                        src="/fbIcon.svg"
                        alt="FaceBookStoreIcon"
                        preview={false}
                        // width={32}
                        height={32}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (sellersDetailsData?.facebook_address) {
                            window.open(
                              sellersDetailsData.facebook_address,
                              "_blank"
                            );
                          }
                        }}
                      />
                    )}
                    {sellersDetailsData?.website_address && (
                      <Image
                        src="/Icon (4).svg"
                        alt="BrowseLogo"
                        preview={false}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (sellersDetailsData?.website_address) {
                            window.open(
                              sellersDetailsData.website_address,
                              "_blank"
                            );
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.rightSection}>
                {/* {hasReviews !== 0 && ( */}
                <div className={styles.reviewbtn}>
                  <p className={styles.title}> Review</p>

                  {/* <div
                  // onClick={handleNavigateToReview}
                  className={styles.btnWrapper}
                >
                  <p className={styles.btn}>See All</p>
                  <Image
                    width={20}
                    src="/arrow-right-green.svg"
                    alt="ArrowIcon"
                    preview={false}
                  />
                </div> */}
                </div>
                {/* )} */}
                <ProductReviews limit={4} />
              </div>
            </div>
            <div>
              <div>
                <div className={styles.reviewbtn}>
                  <p className={styles.title}> Ads Posted By This Seller</p>

                  <div
                    onClick={handleNavigateToSellersAds}
                    className={styles.btnWrapper}
                  >
                    <p className={styles.btn}>See All</p>
                    <Image
                      width={20}
                      src="/arrow-right-green.svg"
                      alt="ArrowIcon"
                      preview={false}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <SellersAds showHeading={false} limit={4} />

      <Modal
        open={flagSeller}
        onCancel={() => setFlagSeller(false)}
        centered
        title={hasUserFlaggedSeller ? "Unflag Seller" : "Flag Seller"}
        footer={null}
      >
        <FlagSeller
          hasUserFlaggedSeller={hasUserFlaggedSeller}
          sellerId={sellersDetailsData?.id}
          handleCloseModal={() => setFlagSeller(false)}
        />
      </Modal>

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
export default SellerProfile;
