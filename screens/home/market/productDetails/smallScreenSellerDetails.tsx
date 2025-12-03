import styles from "./smallscreen.module.scss";
import { Image, Modal, Tabs, TabsProps } from "antd";
import { Form, Formik } from "formik";
import Details from "./tabs/details";
import Reviews from "./tabs/productReview";
import { useState } from "react";
import FlagSeller from "../flagSeller/flagSeller";
import { useAtomValue } from "jotai";
import WriteReviewAds from "../writeReview/reviewAds";
import GeneralWelcome from "../marketLogin/marketLogin";
import { userAtom } from "@/lib/utils/store";
import { useRouter, useSearchParams } from "next/navigation";
import { handleCopyLink } from "@/lib/utils";
import { formatDateToMonthYear, getTimeAgo } from "@/lib/utils/formatTime";
import Button from "@/components/ui/button/button";
import RelatedAds from "@/components/partials/relatedAds";
import ModalContent from "@/components/partials/successModal/modalContent";

const safetyTips = [
  { key: 1, text: "Do not pay in advance, even for the delivery." },
  { key: 2, text: "Try to meet at a safe, public location." },
  { key: 3, text: "Check the item BEFORE you buy it." },
  { key: 4, text: "Pay only after collecting the item." },
  {
    key: 5,
    text: "If you run into any problems with a seller, please report to us to help others. Blinkers Team will check the seller immediately and take appropriate action.",
  },
];

interface Props {
  productDetailsData?: ProductDatum;
  handleFollowBusiness?: () => void;
  handleFollowSeller?: () => void;
  followBusinessMutation?: boolean;
  followSellersMutation?: boolean;
  isUserFollowingBusiness?: boolean;
  isUserFollowingSeller?: boolean;
  businessDetailsData?: AllBusinessesDatum;
  profileDetailsData?: UserData;
  hasUserFlaggedSeller?: boolean;
  addToFavHandler?: () => void;
}

const SmallScreen = ({
  productDetailsData,
  handleFollowBusiness,
  handleFollowSeller,
  followSellersMutation,
  followBusinessMutation,
  businessDetailsData,
  isUserFollowingBusiness,
  isUserFollowingSeller,
  profileDetailsData,
  hasUserFlaggedSeller,
  addToFavHandler,
}: Props) => {
  const [activeKey, setActiveKey] = useState("1");
  const [openSuccess, setOpenSuccess] = useState(false);
  const [flagSeller, setFlagSeller] = useState(false);
  const [isNumberVisible, setIsNumberVisible] = useState(false);
  const user = useAtomValue(userAtom);
  // const currenthref = location.href;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const router = useRouter();
  const id = useSearchParams().get("id");

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Product Details",
      children: <Details productDetailsData={productDetailsData} />,
    },
    {
      key: "2",
      label: "Reviews",
      children: <Reviews id={productDetailsData?.user_id} limit={3} />,
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };

  const handleNavigateToSellersProfile = () => {
    router.push(`/seller-profile/${profileDetailsData?.id}`);
    window.scrollTo(0, 0);
  };

  const relatedAdsData = productDetailsData?.related_ads;

  const handleNavigateToRelatedAds = () => {
    router.push(`/related-ads/${id}`);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  const handleShowNumber = (textToCopy: string) => {
    setIsNumberVisible(true);
    if (isNumberVisible) {
      handleCopyLink(textToCopy);
    }
  };

  const maxVisibleImages = 3;

  const images = productDetailsData?.add_images || [];

  const handleNext = () => {
    if (currentIndex + maxVisibleImages < images.length) {
      setCurrentIndex(currentIndex + maxVisibleImages);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - maxVisibleImages);
    }
  };

  const visibleImages =
    images &&
    images?.length > 0 &&
    images?.slice(currentIndex, currentIndex + maxVisibleImages);

  const handlFlagSeller = () => {
    if (!user) {
      setOpenLoginModal(true);
    } else {
      setFlagSeller(true);
    }
  };

  return (
    <main>
      <div className="wrapper">
        <div className={styles.container}>
          <div className={styles.leftSide}>
            <div style={{ marginInlineStart: "1rem" }}>
              <h2 style={{ display: "flex" }}>{productDetailsData?.title}</h2>
              <p className={styles.fashion}>
                {productDetailsData?.category?.title}
              </p>{" "}
              <div className={styles.accessories}>
                <h2 className={styles.payment}>
                  ₦
                  {productDetailsData?.discount_price ||
                    productDetailsData?.price}
                </h2>
                <div className={styles.eye}>
                  <Image src="/location-pin-svgrepo-com 2.svg" alt="TimeIcon" preview={false} />
                  <p>
                    {" "}
                    Posted {getTimeAgo(productDetailsData?.created_at || "")}
                  </p>
                </div>
                <div className={styles.eye}>
                  <Image src="/eye.svg" alt="EyeIcon" preview={false} />
                  <p>
                    {productDetailsData?.views}{" "}
                    {productDetailsData?.views && productDetailsData?.views < 2
                      ? "View"
                      : "Views"}
                  </p>
                </div>
                <p className={styles.payment}>
                  <span className={styles.title}>State:</span>{" "}
                  {productDetailsData?.state?.state_name}
                </p>
                <p>
                  <span className={styles.title}>Local Government Area:</span>{" "}
                  {productDetailsData?.local_govt?.local_government_area}
                </p>
              </div>
            </div>

            <div className={styles.leftContainer}>
              {/* <div className={styles.firstSideLeft}>
                {productDetailsData?.add_images?.map((dress) => (
                  <div key={dress.id} className={styles.dressCard}>
                    <div>
                      <Image
                        width={"2.3rem"}
                        height={"4.4rem"}
                        src={dress.add_image}
                        alt={dress.add_image}
                        preview={true}
                      />
                    </div>
                  </div>
                ))}
              </div> */}

              <div className={styles.firstSideLeft}>
                {currentIndex > 0 && (
                  <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={styles.arrowButton}
                  >
                    &lt; {/* Left arrow */}
                  </button>
                )}
                {visibleImages &&
                  visibleImages?.map((dress) => (
                    <div key={dress.id} className={styles.dressCard}>
                      <div>
                        <Image
                          width={"6.3rem"}
                          height={"5.4rem"}
                          src={dress?.image_url || dress?.add_image}
                          alt={dress?.image_url || dress?.add_image}
                          preview={true}
                        />
                      </div>
                    </div>
                  ))}
                {currentIndex + maxVisibleImages < images.length && (
                  <button
                    onClick={handleNext}
                    disabled={currentIndex + maxVisibleImages >= images.length}
                    className={styles.arrowButton}
                  >
                    &gt; {/* Right arrow */}
                  </button>
                )}
              </div>

              <div className={styles.secondSideLeft}>
                <div className={styles.promoImage}>
                  <div
                    className={styles.favoriteIcon}
                    onClick={addToFavHandler}
                    // onClick={() => {
                    //   if (addToFavHandler) {
                    //     addToFavHandler(id);
                    //   }
                    // }}
                  >
                    <img
                      width={30}
                      src={
                        productDetailsData?.isFavourite ? "/redfav.svg" : "/Icon + container.svg"
                      }
                      alt="Favorite"
                    />
                  </div>

                  {/* <Image
                  width={"58.6rem"}
                  // height={'58.6rem'}
                  src={Product2}
                  alt="Product2"
                  preview={false}
                  className={styles.productImage}
                /> */}

                  <Image
                    width={"100%"}
                    //   maxWidth={10}
                    src={
                      productDetailsData?.add_images[0]?.image_url ||
                      productDetailsData?.add_images[0]?.add_image
                    }
                    alt="Product2"
                    preview={false}
                    // alt={"my-product"}
                    className={styles.productImage}
                  />
                </div>
              </div>
            </div>

            <div className={styles.tabs}>
              {/* <Tabs defaultActiveKey="1" items={items} /> */}
              <Tabs
                defaultActiveKey="1"
                onChange={handleTabChange}
                items={items}
              />
            </div>
          </div>

          <div className={styles.rightSide}>
            <Formik
              initialValues={{ message: "", selectedItems: [] }}
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              <Form>
                <div className={styles.card}>
                  <p className={styles.seller}>Safety Tips</p>
                  <ul>
                    {safetyTips?.map((tip) => (
                      <li
                        key={tip.key}
                        style={{
                          listStyleType: "disc",
                          marginLeft: "20px",
                          paddingBlock: "0.2rem",
                          fontSize: "1.4rem",
                        }}
                      >
                        {tip.text}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* //BusinessProfile */}
                {businessDetailsData && businessDetailsData ? (
                  <div className={styles.card}>
                    <p className={styles.seller}>Seller’s Information </p>
                    <div className={styles.flexSeller}>
                      <img
                        src={businessDetailsData?.logo || "/Avatarprofile.svg"}
                        width={"2rem"}
                        alt="ProductIcon"
                        className={styles.sellerLogo}
                      />
                      <div>
                        <p className={styles.name}>
                          {businessDetailsData?.name}
                        </p>
                        <div className={styles.starWrapper}>
                          <span className={styles.star}>
                            <Image
                              width={20}
                              src="/staryellow.svg"
                              alt="StarYellow"
                              preview={false}
                            />
                            ( {businessDetailsData?.total_rating}{" "}
                            {businessDetailsData &&
                            businessDetailsData?.total_rating > 1
                              ? "ratings"
                              : "rating"}
                            )
                          </span>
                          <span className={styles.dot}>.</span>{" "}
                          <span>
                            {businessDetailsData?.total_followers}
                            {businessDetailsData &&
                            businessDetailsData?.total_followers > 1
                              ? " Followers"
                              : " Follower"}
                          </span>
                        </div>
                      </div>
                      <p>
                        Member Since{" "}
                        {formatDateToMonthYear(
                          businessDetailsData?.created_at || ""
                        )}
                      </p>
                    </div>

                    <div className={styles.social}>
                      {businessDetailsData.whatsapp && (
                        <Image
                          src="/whatsapp.svg"
                          alt="WhatsappLogo"
                          preview={false}
                          onClick={() => {
                            if (businessDetailsData?.whatsapp) {
                              window.open(
                                businessDetailsData.whatsapp,
                                "_blank"
                              );
                            }
                          }}
                        />
                      )}
                      {businessDetailsData?.instagram && (
                        <Image
                          src="/instagram.svg"
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
                      )}
                      {businessDetailsData?.facebook && (
                        <Image
                          src="/fbIcon.svg"
                          alt="FaceBookStoreIcon"
                          preview={false}
                          // width={40}
                          height={32}
                          onClick={() => {
                            if (businessDetailsData?.facebook) {
                              window.open(
                                businessDetailsData.facebook,
                                "_blank"
                              );
                            }
                          }}
                        />
                      )}
                      {businessDetailsData?.website && (
                        <Image
                          src="/Icon (4).svg"
                          alt="BrowseLogo"
                          preview={false}
                          onClick={() => {
                            if (businessDetailsData?.website) {
                              window.open(
                                businessDetailsData.website,
                                "_blank"
                              );
                            }
                          }}
                        />
                      )}
                    </div>

                    <div className={styles.flexViewProfile}>
                      <Button
                        onClick={() => handleNavigateToSellersProfile()}
                        text="View Profile"
                      />
                      <br />
                      {user?.id !== businessDetailsData?.user_id && (
                        <Button
                          variant="white"
                          onClick={handleFollowBusiness}
                          disabled={followBusinessMutation}
                          text={
                            isUserFollowingBusiness
                              ? followBusinessMutation
                                ? "Unfollowing"
                                : "Unfollow"
                              : followBusinessMutation
                              ? "Following"
                              : "Follow"
                          }
                        />
                      )}
                    </div>

                    <Button
                      icon={
                        <Image src="/click.svg" alt="CallLogo" preview={false} />
                      }
                      text={
                        isNumberVisible
                          ? productDetailsData?.user?.number ||
                            "No phone number"
                          : "Click To Show Number"
                      }
                      onClick={() =>
                        handleShowNumber(productDetailsData?.user?.number || "")
                      }
                    />

                    <div className={styles.flag}>
                      <Button
                        icon={
                          <Image
                            src="/flag.svg"
                            alt="FlagLogo"
                            preview={false}
                          />
                        }
                        text="Flag Seller"
                        variant="redOutline"
                        onClick={handlFlagSeller}
                      />
                    </div>

                    <div></div>
                    <Button
                      className={styles.green}
                      icon={
                        <Image src="/copy.svg" alt="CopyIcon" preview={false} />
                      }
                      text="Copy URL"
                      variant="noBg"
                      onClick={() => {
                        // handleCopyLink(currenthref || "");
                        handleCopyLink(
                          `https://api-v2.blinkersnigeria.com/share/ads/${productDetailsData?.id}`
                        );
                      }}
                    />
                  </div>
                ) : (
                  // sellersprofile
                  <div className={styles.card}>
                    <p className={styles.seller}>Seller’s Information </p>
                    <div className={styles.flexSeller}>
                      <img
                        src={profileDetailsData?.profile_image || "/Avatarprofile.svg"}
                        width={"2rem"}
                        alt="sellerslogo"
                        className={styles.sellerLogo}
                      />
                      <div>
                        <p className={styles.name}>
                          {profileDetailsData?.name || ""}
                        </p>
                        <div className={styles.starWrapper}>
                          {/* <span className={styles.star}>
                            <Image
                              width={20}
                              src="/staryellow.svg"
                              alt="StarYellow"
                              preview={false}
                            />
                            ( {profileDetailsData?.total_rating}{" "}
                        {profileDetailsData &&
                        profileDetailsData?.total_rating > 1
                          ? "ratings"
                          : "rating"}
                        )
                          </span> */}
                          {/* <span className={styles.dot}>.</span>{" "} */}
                          <span>
                            {/* {profileDetailsData?.total_followers}
                        {profileDetailsData &&
                        profileDetailsData?.total_followers > 1
                          ? " Followers"
                          : " Follower"} */}
                          </span>
                        </div>
                      </div>
                      <p>
                        Member Since{" "}
                        {formatDateToMonthYear(
                          profileDetailsData?.created_at || ""
                        )}
                      </p>
                    </div>

                    <div className={styles.social}>
                      {profileDetailsData?.whatsapp_address && (
                        <Image
                          src="/whatsapp.svg"
                          alt="WhatsappLogo"
                          preview={false}
                          onClick={() => {
                            if (profileDetailsData?.whatsapp_address) {
                              window.open(
                                profileDetailsData.whatsapp_address,
                                "_blank"
                              );
                            }
                          }}
                        />
                      )}
                      {profileDetailsData?.instagram_address && (
                        <Image
                          src="/instagram.svg"
                          alt="InstagramIcon"
                          preview={false}
                          onClick={() => {
                            if (profileDetailsData?.instagram_address) {
                              window.open(
                                profileDetailsData?.instagram_address,
                                "_blank"
                              );
                            }
                          }}
                        />
                      )}
                      {profileDetailsData?.facebook_address && (
                        <Image
                          src="/fbIcon.svg"
                          alt="FaceBookStoreIcon"
                          preview={false}
                          // width={40}
                          height={32}
                          onClick={() => {
                            if (profileDetailsData?.facebook_address) {
                              window.open(
                                profileDetailsData.facebook_address,
                                "_blank"
                              );
                            }
                          }}
                        />
                      )}
                      {profileDetailsData?.website_address && (
                        <Image
                          src="/Icon (4).svg"
                          alt="BrowseLogo"
                          preview={false}
                          onClick={() => {
                            if (profileDetailsData?.website_address) {
                              window.open(
                                profileDetailsData?.website_address,
                                "_blank"
                              );
                            }
                          }}
                        />
                      )}
                    </div>

                    <div className={styles.flexViewProfile}>
                      <Button
                        onClick={() => handleNavigateToSellersProfile()}
                        text="View Profile"
                      />
                      <br />
                      {user?.id !== profileDetailsData?.id && (
                        <Button
                          variant="white"
                          onClick={handleFollowSeller}
                          disabled={followSellersMutation}
                          text={
                            isUserFollowingSeller
                              ? followSellersMutation
                                ? "Unfollowing"
                                : "Unfollow"
                              : followSellersMutation
                              ? "Following"
                              : "Follow"
                          }
                        />
                      )}
                    </div>

                    <Button
                      icon={
                        <Image src="/click.svg" alt="CallLogo" preview={false} />
                      }
                      text={
                        isNumberVisible
                          ? productDetailsData?.user?.number ||
                            "No phone number"
                          : "Click To Show Number"
                      }
                      onClick={() =>
                        handleShowNumber(productDetailsData?.user?.number || "")
                      }
                    />

                    <div className={styles.flag}>
                      <Button
                        icon={
                          <Image
                            src="/flag.svg"
                            alt="FlagLogo"
                            preview={false}
                          />
                        }
                        text={
                          hasUserFlaggedSeller ? "Unflag Seller" : "Flag Seller"
                        }
                        variant="redOutline"
                        onClick={() => {
                          setFlagSeller(true);
                        }}
                      />
                    </div>

                    <div></div>
                    <Button
                      className={styles.green}
                      icon={
                        <Image src="/copy.svg" alt="CopyIcon" preview={false} />
                      }
                      text="Copy URL"
                      variant="noBg"
                      onClick={() => {
                        // handleCopyLink(currenthref || "");
                        handleCopyLink(
                          `https://api-v2.blinkersnigeria.com/share/ads/${productDetailsData?.id}`
                        );
                      }}
                    />
                  </div>
                )}
                {/* <div className={styles.chatCart}>
                  <p className={styles.seller}>Chat with seller</p>

                  <div className={styles.starWrapper}>
                    <p className={styles.message}>Is this available</p>
                    <p className={styles.message}> Where is your location</p>
                    <p className={styles.message}> More Enquiry</p>
                  </div>

                  <Input
                    name="location"
                    placeholder="Write your message here"
                    type="textarea"
                  />
                  <div className={styles.startChat}>
                    <Button text="Start Chat" />
                  </div>
                </div> */}
              </Form>
            </Formik>
          </div>
        </div>
        {activeKey === "2" && (
          <WriteReviewAds id={productDetailsData?.user_id} />

          // <div>
          //   <Formik
          //     initialValues={{ message: "", selectedItems: [] }}
          //     onSubmit={(values) => {
          //       console.log(values);
          //     }}
          //   >
          //     <Form>
          //       <div className={styles.cardreview}>
          //         <h2 className={styles.write}>Write A Review</h2>

          //         <p className={styles.adding}>
          //           Add a rating. Tap on the icons to rate this product
          //         </p>

          //         <div className={styles.starWrapper}>
          //           {countUpTo(
          //             0,
          //             <Image
          //               width={20}
          //               src="/staryellow.svg"
          //               alt="StarYellow"
          //               preview={false}
          //             />,
          //             <Image
          //               width={20}
          //               src={StarIcon}
          //               alt="StarIcon"
          //               preview={false}
          //             />
          //           )}
          //         </div>
          //         <div className={styles.reviewInput}>
          //           <Input
          //             name="review"
          //             placeholder="Write  review"
          //             type="textarea"
          //           />
          //         </div>
          //         <div className={styles.seeBtn}>
          //           <Button
          //             onClick={() => {
          //               setOpenSuccess(true);
          //             }}
          //             text="Submit"
          //             className="buttonStyle"
          //           />
          //         </div>
          //       </div>
          //     </Form>
          //   </Formik>
          // </div>
        )}
      </div>

      {relatedAdsData && relatedAdsData?.length > 0 && (
        <section>
          <div className="wrapper">
            <div className={styles.review}>
              <div className={styles.reviewbtn}>
                <p className={styles.title}>Related Ads</p>

                {relatedAdsData && (
                  <div
                    onClick={handleNavigateToRelatedAds}
                    className={styles.btnWrapper}
                  >
                    <p className={styles.btn}>See All</p>
                    <img src="/arrow-right-green.svg" alt="ArrowIcon" />
                  </div>
                )}
              </div>
              {/* <p>No Reviews available yet</p> */}
            </div>
          </div>
          <RelatedAds limit={4} canSeeBtn={false} />
        </section>
      )}

      <ModalContent
        open={openSuccess}
        handleCancel={() => setOpenSuccess(false)}
        handleClick={() => {
          setOpenSuccess(false);
        }}
        heading={"Your Rating and Review Has Been Submitted Successfully"}
      />

      <Modal
        open={flagSeller}
        onCancel={() => setFlagSeller(false)}
        centered
        title="Flag Seller"
        footer={null}
      >
        <FlagSeller
          hasUserFlaggedSeller={hasUserFlaggedSeller}
          sellerId={productDetailsData?.user_id}
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
    </main>
  );
};
export default SmallScreen;
