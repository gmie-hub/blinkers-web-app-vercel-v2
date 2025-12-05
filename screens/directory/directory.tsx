import styles from "./directory.module.scss";
import { Image, Modal, Pagination } from "antd";
import { useEffect, useRef, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useAtomValue } from "jotai";
import TopBusiness from "./topBusiness/topBusiness";
import RecommendedBusinesses from "./recommended/recommendedBusiness";
import BusinessDirectoryWelcome from "./directorLogin/directoryLoginCard";
import { useRouter } from "next/navigation";
import { sanitizeUrlParam } from "@/lib/utils";
import SearchInput from "@/components/ui/searchInput";
import Button from "@/components/ui/button/button";
import CustomSpin from "@/components/ui/spin";
import { userAtom } from "@/lib/utils/store";
import usePagination from "@/hooks/usePagination";
import {
  getAllBusiness,
  getRecommentationBusiness,
  getTopBusiness,
} from "@/services/businessServices";

const Directory = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const { currentPage, setCurrentPage, onChange, pageNum } = usePagination();
  // const currentPath = location.pathname;
  const user = useAtomValue(userAtom);
  const [showContent] = useState(true); // Manage review form visibility
  const moreBusinessesRef = useRef<HTMLParagraphElement>(null);

  const [openLoginModal, setOpenLoginModal] = useState(false);

  const handlePageChange = (page: number) => {
    onChange(page); // this triggers the pagination logic from your custom hook
    if (moreBusinessesRef.current) {
      moreBusinessesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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
    router.push(`/top-bussinesses`);
    window.scrollTo(0, 0);
  };
  const handleNavigateToRecommendedBusinesses = () => {
    router.push(`/recommended-businesses`);
    window.scrollTo(0, 0);
  };
  // const handleNavigateDirectory = (id: number, name: string, about:string) => {
  //   navigate(
  //     `/directory-details/${id}/${sanitizeUrlParam(name)}/${sanitizeUrlParam(about)}`
  //   );
  //   window.scroll(0, 0);
  // };

  const handleNavigateDirectory = (id: number, name: string) => {
    router.push(`/directory/directory-details/${id}/${sanitizeUrlParam(name)}`);
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
        queryFn: getRecommentationBusiness,
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
    router.push("/directory");
    getAllDirectoryQuery?.refetch();
  };

  const handleAddDirectory = () => {
    if (!user) {
      setOpenLoginModal(true);
    } else if (user?.business === null) {
      router.push("/jobs/add-business");
    } else router.push("/profile/2");
  };

  return (
    <div className="wrapper">
      <div className={styles.container}>
        <div
          className={styles.image}
          style={{
            backgroundImage: "url(/Container.svg)", // Ensure you use the correct image reference
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
                <Image src="/checkico.svg" alt="check" preview={false} />
                {item}
              </li>
            ))}
          </ul>
          <div className={styles.btnFlex}>
            {(user && !user?.is_applicant) || !user ? (
              <Button
                icon={<Image src="/add-circle.svg" alt="add" preview={false} />}
                className={styles.buttonStyle}
                text="Add Business To Directory"
                variant="green"
                onClick={handleAddDirectory}
              />
            ) : (
              <Button
                AfterTexticon={
                  <Image
                    src="/arrow-right-green.svg"
                    alt="arrow"
                    preview={false}
                  />
                }
                className={styles.buttonStyle}
                text="Add Business To Directory"
                variant="green"
                onClick={handleAddDirectory}
              />
            )}
          </div>
        </div>
        <img src="/image-33.svg" alt="DirectoryImage" />
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
                        src="/arrow-right-green.svg"
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
                        src="/arrow-right-green.svg"
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
                icon={<Image src="/add-circle.svg" alt="add" preview={false} />}
                className={styles.buttonStyle}
                text="Add Business To Directory"
                variant="green"
                // onClick={handleNavigateRegisterAsAnApplicant}
              />
            )}
          </div>
        </div>
        <img src="/image-33.svg" alt="DirectoryImage" />
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
                  icon={<img src="/backArrow.svg" alt="FaArrowLeft" />}
                />
                <br />
                <br />
              </div>
            )}
            <p ref={moreBusinessesRef} className={styles.titleHead}>
              More Businesses
            </p>

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
                            src="/locationrelated.svg"
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
                          <Image
                            width={20}
                            src="/callrelated.svg"
                            alt="CallIcon"
                          />

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
                      icon={<img src="/backArrow.svg" alt="FaArrowLeft" />}
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
        <BusinessDirectoryWelcome
          handleCloseModal={() => setOpenLoginModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Directory;
