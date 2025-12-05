import styles from "./directoryDetails.module.scss";
import { useState } from "react";
import { App, Image, Modal } from "antd";
import RelatedBusinesses from "../relatedBusinesses/relatedBusiness";
import {  useQueries } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import Reviews from "../../home/market/productDetails/tabs/businessReview";
import StarYellow from "../../../assets/staryellow.svg";
import { groupBusinessHours } from "./displayBusinessHour";
import BusinessDirectoryWelcome from "../directorLogin/directoryLoginCard";
import { getBusinessById } from "@/services/businessServices";
import { AxiosError } from "axios";
import Button from "@/components/ui/button/button";
import CustomSpin from "@/components/ui/spin";
import RouteIndicator from "@/components/ui/routeIndicator";
import { countUpTo, handleCopyLink } from "@/lib/utils";
import { useParams, usePathname, useRouter } from "next/navigation";
import { userAtom } from "@/lib/utils/store";

const NotClaim = () => {
  const [showContent] = useState(true); // Manage review form visibility
  const [showCard] = useState(false); // Manage card visibility
  const [openShare, setOpenShare] = useState(false);
  const user = useAtomValue(userAtom);
  const { notification } = App.useApp();
  const currentPath = usePathname();
  const currentHref = location.href;
  const [openLoginModal, setOpenLoginModal] =useState(false)

  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // let  type: 'images' | 'videos';

  //   const hasReviews = reviewData?.length;
  //   console.log(hasReviews , "hasReviews")

  const handleClaim = () => {
    if (!user) {
      setOpenLoginModal(true)

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
      router.push(`/claim-business/${id}`);
      window.scrollTo(0, 0);
    }
  };

  //   navigate(`/related-businesses/${id}`);
  //   window.scrollTo(0, 0);
  // };

  const handleNavigateToSubPlan = () => {
    router.push(`/subscription-pricing/${id}`);
    window.scrollTo(0, 0);
  };

  const handleNavigateToVideo = () => {
    router.push(`/videos/${id}`);
    window.scrollTo(0, 0);
  };
  const handleNavigateToImages = () => {
    router.push(`/images/${id}`);
    window.scrollTo(0, 0);
  };

  const [getBusinessDetailsQuery, ] = useQueries({
    queries: [
      {
        queryKey: ["get-business-details", id],
        queryFn: () => getBusinessById(parseInt(id!)),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!id,
      },
      // {
      //   queryKey: ["get-business-followers", id],
      //   queryFn: () => getFollowersByBusiness_id(user?.id ?? 0, parseInt(id!)),
      //   retry: 0,
      //   refetchOnWindowFocus: true,
      //   enabled: !!id,
      // },
    ],
  });
  // const userExists = getBusinessFollowersQuery?.data?.data?.data?.some(
  //   (item) => item?.user_id === user?.id
  // );

  const businessDetailsData = getBusinessDetailsQuery?.data?.data;
  const businessDetailsError = getBusinessDetailsQuery?.error as AxiosError;
  const businessDetailsErrorMessage =
    businessDetailsError?.message ||
    "An error occurred. Please try again later.";
  console.log(businessDetailsData?.gallery[0]?.url, "businessDetailsData");

  // const followBusinessMutation = useMutation({
  //   mutationFn: FollowBusiness,
  //   mutationKey: ["follow-business"],
  // });

  // const followBusinessHandler = async () => {
  //   const payload: Partial<FollowBusiness> = {
  //     business_id: businessDetailsData?.id,
  //     user_id: user?.id,
  //     action: userExists ? "unfollow" : "follow",
  //   };

  //   try {
  //     await followBusinessMutation.mutateAsync(payload, {
  //       onSuccess: (data) => {
  //         notification.success({
  //           message: "Success",
  //           description: data?.message,
  //         });
  //         queryClient.refetchQueries({
  //           queryKey: ["get-business-followers"],
  //         });
  //       },
  //     });
  //   } catch (error) {
  //     notification.error({
  //       message: "Error",
  //       description: errorMessage(error),
  //     });
  //   }
  // };
  // const handleFollowBusiness = () => {
  //   if (!user) {
  //     notification.open({
  //       message: "You need to log in to complete this action.",
  //       description: (
  //         <>
  //           <br />
  //           <Button
  //             type="button"
  //             onClick={() => {
  //               notification.destroy();
  //               navigate(`/login?redirect=${currentPath}`);
  //             }}
  //           >
  //             Click here to Login
  //           </Button>
  //         </>
  //       ),
  //       placement: "top",
  //       duration: 4, // Auto close after 5 seconds
  //       icon: null,
  //     });
  //   } else {
  //     followBusinessHandler();
  //   }
  // };

  const handleNavigateToWriteReview = () => {
    if (!user) {
      notification.open({
        message: "You need to log in to complete this action.",
        description: (
          <>
            <br />
            <Button
              type="button"
              onClick={() => {
                notification.destroy();
                router.push(`/login?redirect=${currentPath}`);
              }}
            >
              Click here to Login
            </Button>
          </>
        ),
        placement: "top",
        duration: 4, // Auto close after 5 seconds
        icon: null,
      });
    } else if (businessDetailsData?.business_status?.toString() !== "2") {
      notification.error({
        message: "Error",
        description: "This business is under approval",
      });
    } else {
      router.push(`/write-review/${id}`);
    }
    window.scrollTo(0, 0);
  };

  const handleNavigateToRelatedBusiness = () => {
    router.push(`/related-businesses/${id}`);
    window.scrollTo(0, 0);
  };

  const images =
    businessDetailsData?.gallery &&
    businessDetailsData?.gallery?.filter((item) => item.type === "image");

  const videos =
    businessDetailsData?.gallery &&
    businessDetailsData?.gallery?.filter((item) => item.type === "video");
  return (
    <>
      {getBusinessDetailsQuery?.isLoading ? (
        <CustomSpin />
      ) : getBusinessDetailsQuery?.isError ? (
        <h1 className="error">{businessDetailsErrorMessage}</h1>
      ) : (
        <div className="wrapper">
          <RouteIndicator showBack />
          {showContent && (
            <>
              <div className={styles.mainContainer}>
                <div className={styles.leftSection}>
                  <div className={styles.card}>
                    <div className={styles.justifyCenter}>
                      <img
                        className={styles.imageSize}
                        src={businessDetailsData?.logo}
                        alt="ProductIcon"
                      />

                      <div className={styles.detailsflex}>
                        <p className={styles.name}>
                          {businessDetailsData?.name}
                        </p>
                        <p className={styles.subjectBg}>
                          {businessDetailsData?.category?.title}
                        </p>

                        <div className={styles.starWrapper}>
                          {countUpTo(
                            businessDetailsData?.average_rating || 0,
                            <Image
                              width={20}
                              src={StarYellow}
                              alt="StarYellow"
                              preview={false}
                            />,
                            <Image
                              width={20}
                              src="/Vector.svg"
                              alt="Star"
                              preview={false}
                            />
                          )}{" "}
                        </div>
                        {businessDetailsData?.total_rating === 0 ? (
                          <p style={{ paddingBlockEnd: "1.4rem" }}>
                            No reviews yet
                          </p>
                        ) : (
                          <p style={{ paddingBlockEnd: "1.4rem" }}>
                            {businessDetailsData?.average_rating} (
                            {businessDetailsData?.total_rating}{" "}
                            {businessDetailsData?.total_rating &&
                            businessDetailsData?.total_rating < 2
                              ? "Rating"
                              : "Ratings"}
                            )
                          </p>
                        )}
                        {/* <p style={{ paddingBlockEnd: "0.4rem" }}>
                          {businessDetailsData?.total_followers}

                          {businessDetailsData?.total_followers &&
                          businessDetailsData?.total_followers > 1
                            ? " Followers"
                            : " Follower"}
                        </p> */}
                      </div>
                      <p style={{ paddingBlock: "0.2rem" }}>
                        Number of Ads Posted:{" "}
                        <span> {businessDetailsData?.total_ads}</span>{" "}
                      </p>

                      <div className={styles.starWrapper2}>
                        {user?.id !== businessDetailsData?.user_id && (
                          //  (user?.claim_status?.toLowerCase() !== 'successful') &&
                          <div
                            onClick={handleNavigateToWriteReview}
                            className={styles.message}
                          >
                            <Image src="/Vector.svg" alt="Star" preview={false} />

                            <p>Write a review</p>
                          </div>
                        )}
                        <div
                          onClick={() => {
                            setOpenShare(true);
                          }}
                          className={styles.message}
                        >
                          <Image
                            src="/share-2.svg"
                            alt="shareIcon"
                            preview={false}
                          />

                          <p>Share</p>
                        </div>

                        {/* {user?.id !== businessDetailsData?.user_id && (
                          <Button
                            icon={
                              <Image
                                src={linkIcon}
                                alt="linkIcon"
                                preview={false}
                              />
                            }
                            disabled={followBusinessMutation?.isPending}
                            onClick={handleFollowBusiness}
                            text={
                              userExists
                                ? followBusinessMutation?.isPending
                                  ? "Unfollowing"
                                  : "Unfollow"
                                : followBusinessMutation?.isPending
                                ? "Following"
                                : "Follow"
                            }
                            variant="transparent"
                          />
                        )} */}
                      </div>
                    </div>

                    <div>
                    {businessDetailsData?.business_hours && businessDetailsData?.business_hours?.length > 0 && <div className={styles.open}>

                      <div className={styles.info}>
                        <img src="/time42.svg" alt="TimeIcon" />

                          <p>Opening Hours</p>
                          {/* <p>Monday - Fridays (10am- 11pm)</p> */}
                          {groupBusinessHours(
                            businessDetailsData?.business_hours || []
                          )}
                        </div>
                      </div>}
                      <div className={styles.info}>
                        <img src="/revielocation.svg" alt="LocationIcon" />
                        <p>{businessDetailsData?.address}</p>
                      </div>
                      <div className={styles.info}>
                        <img src="/callclaim.svg" alt="CallIcon" />

                        <p>{businessDetailsData?.phone || "N/A"}</p>
                      </div>
                    </div>
                    {businessDetailsData?.business_status === "2" && (
                      <>
                        <div className={styles.info}>
                          <Image
                            src="/mailicon.svg"
                            alt="MailIcon"
                            preview={false}
                          />

                          <p>{businessDetailsData?.email || "N/A"}</p>
                        </div>

                        <div className={styles.info}>
                          <Image src="/webicon.svg" alt="WebICon" preview={false} />

                          <p>{businessDetailsData?.website || "N/A"}</p>
                        </div>
                      </>
                    )}

                    {businessDetailsData?.business_status !== "2" &&
                      user?.claim_status?.toLowerCase() !== "successful" && (
                        <div className={styles.chatBtn}>
                          <Button
                            onClick={() => handleClaim()}
                            text={
                              user?.claim_status?.toLowerCase() === "pending"
                                ? "Claim Business Status: 'PENDING'"
                                : "Claim This Business"
                            }
                            disabled={
                              user?.claim_status?.toLowerCase() === "pending"
                            }
                          />
                        </div>
                      )}

                    {/* <div className={styles.social}>
                      <Image
                        style={{ cursor: "pointer" }}
                        src={WhatsappLogo}
                        alt="WhatsappLogo"
                        preview={false}
                        onClick={() => {
                          if (businessDetailsData?.whatsapp) {
                            window.open(businessDetailsData.whatsapp, "_blank");
                          }
                        }}
                      />
                      <Image
                        style={{ cursor: "pointer" }}
                        //   width={40}
                        height={35}
                        src={FaceBookStoreIcon}
                        alt="FaceBookStoreIcon"
                        preview={false}
                        onClick={() => {
                          if (businessDetailsData?.facebook) {
                            window.open(businessDetailsData.facebook, "_blank");
                          }
                        }}
                      />
                      <Image
                        style={{ cursor: "pointer" }}
                        src={InstagramIcon}
                        alt="InstagramIcon"
                        preview={false}
                        onClick={() => {
                          if (businessDetailsData?.instagram) {
                            window.open(
                              businessDetailsData.instagram,
                              "_blank"
                            );
                          }
                        }}
                      />
                    </div> */}
                  </div>
                </div>
                <div className={styles.rightSection}>
                  <h1>About {businessDetailsData?.name}</h1>
                  <p>{businessDetailsData?.about}</p>
                  <>
                    <div className={styles.photo}>
                      <div className={styles.reviewbtn}>
                        <h1>Photos</h1>
                        {images && images?.length > 4 && (
                          <div
                            onClick={handleNavigateToImages}
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
                        )}
                      </div>

                      {images && images.length > 0 ? (
                        <div className={styles.imageWrapper}>
                          {images.slice(0, 4).map((image, index) => (
                            <div key={index} className={styles.imageContainer}>
                              <Image
                                key={index}
                                src={image.url}
                                alt={`Image ${image.id}`}
                                className={styles.image}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No images available yet</p>
                      )}
                    </div>
                    <div className={styles.photo}>
                      <div className={styles.reviewbtn}>
                        <h1>Videos</h1>
                        {videos && videos?.length > 4 && (
                          <div
                            onClick={handleNavigateToVideo}
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
                        )}
                      </div>{" "}
                      {videos && videos.length > 0 ? (
                        <div className={styles.imageWrapper}>
                          {videos?.slice(0, 4)?.map((image, index) => (
                            <div key={index} className={styles.imageContainer}>
                              <video
                                key={index}
                                controls
                                playsInline
                                poster={image?.url}
                                className={styles.image}
                              >
                                <source src={image?.url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No images available yet</p>
                      )}
                    </div>

                    <div className={styles.review}>
                      <Reviews limit={3} canSeeAllBtn={false} />,
                    </div>
                  </>
                </div>
              </div>
            </>
          )}

          {showCard && (
            <div className={styles.submittedCard}>
              <div className={styles.cardContent}>
                <Image src="/House-Lock.svg" alt="lock" preview={false} />

                <h2>Subscribe to Claim This Business</h2>
                <p>
                  Choose a subscription plan to be able to claim and manage your
                  business.
                </p>
                <Button
                  onClick={() => {
                    handleNavigateToSubPlan();
                  }} // Show review form when "Okay" is clicked
                  text="Check Out Subscription plan"
                />
              </div>
            </div>
          )}
          <Modal
            open={openShare}
            onCancel={() => setOpenShare(false)}
            centered
            title="Share Link"
            footer={null}
          >
            <div className={styles.share}>
              <p>{currentHref}</p>

              <Button
                onClick={() => handleCopyLink(currentHref)}
                icon={<Image src="/copywhite.svg" alt="copy" preview={false} />}
                className={styles.buttonStyle}
                text="Copy Link"
              />
            </div>
          </Modal>
        </div>
      )}
      <div>
        {showContent && (
          <div className="wrapper">
            <div className={styles.reviewbtn}>
              <p className={styles.title}> Related Businesses</p>

              <div
                onClick={handleNavigateToRelatedBusiness}
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
            <RelatedBusinesses showHeading={false} limit={4} />
          </div>
        )}
      </div>
      <Modal
      open={openLoginModal}
      onCancel={() => setOpenLoginModal(false)}
      centered
      footer={null}
    >
      <BusinessDirectoryWelcome handleCloseModal={() => setOpenLoginModal(false)}/>
    </Modal>
    </>
  );
};
export default NotClaim;
