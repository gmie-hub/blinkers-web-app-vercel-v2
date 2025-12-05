import styles from "./directory.module.scss";
import { Image, Modal, Pagination } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "/Container.svg";
import SearchInput from "../../customs/searchInput";
import CallIcon from "../../assets/callrelated.svg";
import LocationIcon from "../../assets/locationrelated.svg";
import { useQueries } from "@tanstack/react-query";
import { getAllBusiness, getRecommentationBusiness, getTopBusiness } from "../request";
import { AxiosError } from "axios";
import Button from "../../customs/button/button";
import CustomSpin from "../../customs/spin";
import FaArrowLeft from "../../assets/backArrow.svg";
import usePagination from "../../hooks/usePagnation";
import { userAtom } from "../../utils/store";
import { useAtomValue } from "jotai";
import { sanitizeUrlParam } from "../../utils";
import WhiteAdd from "../../assets/add-circle.svg";
import DirectoryImage from "../../assets/image 33.svg";
import CheckIcon from "../../assets/checkico.svg";
import Arrow from "../../assets/arrow-left.svg";
import ArrowIcon from "../../assets/arrow-right-green.svg";
import TopBusiness from "./topBusiness/topBusiness";
import RecommendedBusinesses from "./recommended/recommendedBusiness";
import BusinessDirectoryWelcome from "./directorLogin/directoryLoginCard";

const Directory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const { currentPage, setCurrentPage, onChange, pageNum } = usePagination();
  // const currentPath = location.pathname;
  const user = useAtomValue(userAtom);
  const [showContent] = useState(true); // Manage review form visibility
  const moreBusinessesRef = useRef<HTMLParagraphElement>(null);

  const [openLoginModal, setOpenLoginModal] =useState(false)

  const handlePageChange = (page: number) => {
    onChange(page); // this triggers the pagination logic from your custom hook
    if (moreBusinessesRef.current) {
      moreBusinessesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  
  useEffect(() => {
    if (currentPage !== pageNum) {
      setCurrentPage(pageNum);
    }
  }, [pageNum, currentPage, setCurrentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Update the search query state
  };
  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
  };
  const handleNavigateTopBusiness = () => {
    navigate(`/top-bussinesses`);
    window.scrollTo(0, 0);
  };
  const handleNavigateToRecommendedBusinesses = () => {
    navigate(`/recommended-businesses`);
    window.scrollTo(0, 0);
  };
  // const handleNavigateDirectory = (id: number, name: string, about:string) => {
  //   navigate(
  //     `/directory-details/${id}/${sanitizeUrlParam(name)}/${sanitizeUrlParam(about)}`
  //   );
  //   window.scroll(0, 0);
  // };

  const handleNavigateDirectory = (id: number, name: string) => {
    navigate(`/directory-details/${id}/${sanitizeUrlParam(name)}`);
    window.scroll(0, 0);
  };

  const [
    getAllDirectoryQuery,
    getAllTopBsinessQuery,
    getAllRecommendBusinessQuery,
  ] = useQueries({
    queries: [
      {
        queryKey: ["get-all-directory", appliedSearchTerm, currentPage],
        queryFn: () => getAllBusiness(appliedSearchTerm, currentPage),
        retry: 0,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["getall-top-business"],
        queryFn: getTopBusiness,
        retry: 0,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["get-all-recommended-bus"],
        queryFn:  getRecommentationBusiness,
        retry: 0,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const topBusiness = getAllTopBsinessQuery?.data?.data?.data;

  const topBusinessError = getAllTopBsinessQuery?.error as AxiosError;
  const topBusinessErrorMessage =
    topBusinessError?.message || "An error occurred. Please try again later.";

  const recommendBusiness = getAllRecommendBusinessQuery?.data?.data?.data;

  const recommendBusinessError =
    getAllRecommendBusinessQuery?.error as AxiosError;
  const recommendBusinessErrorMessage =
    recommendBusinessError?.message ||
    "An error occurred. Please try again later.";

  const directoryData = getAllDirectoryQuery?.data?.data?.data || [];
  const directoryError = getAllDirectoryQuery?.error as AxiosError;
  const directoryErrorMessage =
    directoryError?.message || "An error occurred. Please try again later.";

  const handleBack = () => {
    setAppliedSearchTerm("");
    setSearchTerm("");
    setCurrentPage(1);
    navigate("/directory");
    getAllDirectoryQuery?.refetch();
  };
  const handleAddDirectory = () => {
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
      

 

    } else if (user?.business === null) {
      navigate("/job/add-business");
    } else navigate("/profile/2");
  };

  return (
    <div className="wrapper">
      <div className={styles.container}>
        <div
          className={styles.image}
          style={{
            backgroundImage: `url(${Icon})`, // Ensure you use the correct image reference
          }}
        >
          <div className={styles.home}>
            <p className={styles.picHead}>Directory</p>
            <p className={styles.picPara}>Explore various business listings</p>
          </div>
          <div className={styles.searchWrapper}>
            <SearchInput
              placeholder="Search Businesses..."
              // width="40rem"
              // isBtn={true}

              onChange={handleInputChange}
            >
              <Button
                type="button"
                variant="green"
                text="Search"
                className={styles.searchBtn}
                onClick={handleSearch}
              />
            </SearchInput>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBlockStart: "2.4rem",
              marginInline: "2rem",
            }}
          >
            <Button
              type="button"
              variant="white"
              text={
                !user ||
                user?.claim_status === null ||
                user?.claim_status?.toString() === "2" ||
                user?.claim_status?.toLowerCase() === "rejected"
                  ? "Add your Business to Directory"
                  : user?.claim_status?.toLowerCase() === "pending"
                  ? "Your business is pending review"
                  : user?.business?.name
              }
              className={styles.buttonStyle}
              onClick={handleAddDirectory}
            />
          </div>
        </div>
      </div>

      <div className={styles.newCard}>
        <div>
          <h1 className={styles.newCardH1}>
            Welcome to Blinkers Business Directory{" "}
          </h1>
          <ul
            style={{
              paddingBlockEnd: "1rem",
              listStyle: "disc inside",
            }}
          >
            {[
              "Claim your business",
              "List your business",
              "Explore and connect with other business owners",
            ].map((item, index) => (
              <li
                key={index}
                style={{
                  color: "#707070",
                  paddingBlock: "0.4rem",
                  fontSize: "2.4rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Image src={CheckIcon} alt={CheckIcon} preview={false} />
                {item}
              </li>
            ))}
          </ul>
          <div className={styles.btnFlex}>
            {(user && !user?.is_applicant) || !user ? (
              <Button
                icon={<Image src={WhiteAdd} alt={WhiteAdd} preview={false} />}
                className={styles.buttonStyle}
                text="Add Business To Directory"
                variant="green"
                onClick={handleAddDirectory}
              />
            ) : (
              <Button
                AfterTexticon={
                  <Image src={Arrow} alt={Arrow} preview={false} />
                }
                className={styles.buttonStyle}
                text="Add Business To Directory"
                variant="green"
                onClick={handleAddDirectory}
              />
            )}
          </div>
        </div>
        <img src={DirectoryImage} alt="DirectoryImage" />
      </div>

      {getAllTopBsinessQuery?.isLoading ? (
        <CustomSpin />
      ) : getAllTopBsinessQuery?.isError ? (
        <h1 className="error">{topBusinessErrorMessage}</h1>
      ) : (
        topBusiness &&
        topBusiness?.length > 0 && (
          <div>
            {showContent && (
              <div>
                <div className={styles.reviewbtn}>
                  <p className={styles.title}> Top Businesses</p>
                  {topBusiness && topBusiness?.length > 4 && (
                    <div
                      onClick={handleNavigateTopBusiness}
                      className={styles.btnWrapper}
                    >
                      <p className={styles.btn}>See All</p>
                      <Image
                        width={20}
                        src={ArrowIcon}
                        alt="ArrowIcon"
                        preview={false}
                      />
                    </div>
                  )}
                </div>
                <TopBusiness showHeading={false} limit={4} />
              </div>
            )}
          </div>
        )
      )}

      {getAllRecommendBusinessQuery?.isLoading ? (
        <CustomSpin />
      ) : getAllRecommendBusinessQuery?.isError ? (
        <h1 className="error">{recommendBusinessErrorMessage}</h1>
      ) : (
        recommendBusiness &&
        recommendBusiness?.length > 0 && (
          <div>
            {showContent && (
              <div>
                <div className={styles.reviewbtn}>
                  <p className={styles.title}> Recommended Businesses</p>
                  {recommendBusiness && recommendBusiness?.length > 4 && (
                    <div
                      onClick={handleNavigateToRecommendedBusinesses}
                      className={styles.btnWrapper}
                    >
                      <p className={styles.btn}>See All</p>
                      <Image
                        width={20}
                        src={ArrowIcon}
                        alt="ArrowIcon"
                        preview={false}
                      />
                    </div>
                  )}
                </div>
                <RecommendedBusinesses showHeading={false} limit={4} />
              </div>
            )}
          </div>
        )
      )}

      <div className={styles.newCard}>
        <div>
          <h1 className={styles.newCardH1}>Get Your Business Listed Today? </h1>
          <p className={styles.newCardP}>
            Discover businesses near you and grow your brand with the Directory{" "}
          </p>
          <div className={styles.btnFlex}>
            {((user && !user?.is_applicant) || !user) && (
              <Button
                icon={<Image src={WhiteAdd} alt={WhiteAdd} preview={false} />}
                className={styles.buttonStyle}
                text="Add Business To Directory"
                variant="green"
                // onClick={handleNavigateRegisterAsAnApplicant}
              />
            )}
          </div>
        </div>
        <img src={DirectoryImage} alt="DirectoryImage" />
      </div>
      <div className={styles.whyWrapper}>
        {getAllDirectoryQuery?.isLoading ? (
          <CustomSpin />
        ) : getAllDirectoryQuery?.isError ? (
          <h1 className="error">{directoryErrorMessage}</h1>
        ) : (
          <>
            {appliedSearchTerm?.length > 0 && directoryData?.length > 0 && (
              <div>
                <Button
                  type="button"
                  className="buttonStyle"
                  onClick={handleBack}
                  text="view all"
                  icon={<img src={FaArrowLeft} alt="FaArrowLeft" />}
                />
                <br />
                <br />
              </div>
            )}
            <p  ref={moreBusinessesRef} className={styles.titleHead}>More Businesses</p>

            <section className={styles.promoImageContainer}>
              {directoryData && directoryData?.length > 0 ? (
                directoryData?.map((item: any, index: number) => (
                  <div
                    className={styles.promoImage}
                    key={index}
                    onClick={() =>
                      handleNavigateDirectory(item?.id, item?.name)
                    }

                    // onClick={() =>
                    //   handleNavigateDirectory(item?.id, item?.name,item?.about)
                    // }
                  >
                    <img
                      src={item?.logo}
                      alt="Image2"
                      className={styles.proImage}
                    />
                    <div className={styles.productList}>
                      <p className={styles.title}>
                        {/* {item?.name} */}
                        {item?.name && item?.name?.length > 20
                          ? item?.name?.slice(0, 20) + "..."
                          : item?.name}
                      </p>
                      {item?.address && (
                        <div className={styles.info}>
                          <Image
                            width={20}
                            src={LocationIcon}
                            alt="LocationIcon"
                          />
                          <p>
                            {item?.address && item?.address?.length > 20
                              ? item?.address?.slice(0, 20) + "..."
                              : item?.address}
                          </p>
                        </div>
                      )}
                      {item?.phone && (
                        <div className={styles.info}>
                          <Image width={20} src={CallIcon} alt="CallIcon" />

                          <p>{item?.phone}</p>
                        </div>
                      )}
                      <div className={styles.subjectBg}>
                        {item?.category?.title}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <section style={{ width: "100%" }}>
                  <div className="noDataContainer">
                    <p>No data available</p>
                    <Button
                      type="button"
                      className="buttonStyle"
                      onClick={handleBack}
                      text="view all jobs"
                      icon={<img src={FaArrowLeft} alt="FaArrowLeft" />}
                    />
                  </div>
                </section>
              )}
            </section>

            <Pagination
              current={currentPage}
              total={getAllDirectoryQuery?.data?.data?.total} // Total number of items
              pageSize={20} // Number of items per page
              onChange={handlePageChange} // Handle page change
              showSizeChanger={false} // Hide the option to change the page size
              style={{
                marginTop: "20px",
                textAlign: "center", // Center the pagination
                display: "flex",
                justifyContent: "center", // Ensure the pagination is centered
              }}
            />
          </>
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
    </div>
  );
};

export default Directory;
