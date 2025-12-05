import styles from "./job.module.scss";
import { Image, Modal } from "antd";
import { useState } from "react";
import JobLists from "./cards/cards";
import { useAtomValue } from "jotai";
import PopularJobs from "./popularJob/popularJob";
import { AxiosError } from "axios";
import { useQueries } from "@tanstack/react-query";
import JobForYou from "./jobForYou/forYou";
import CustomSpin from "@/components/ui/spin";
import JobWelcome from "./jobLogin/jobLogin";
import SearchInput from "@/components/ui/searchInput";
import Button from "@/components/ui/button/button";
import ModalContent from "@/components/partials/successModal/modalContent";
import { routes } from "@/lib/routes";
import { userAtom } from "@/lib/utils/store";
import { useRouter, useSearchParams } from "next/navigation";
import { getForYouJobs, getPopularJobs } from "@/services/jobServices";

const Jobs = () => {
    const search = useSearchParams().get("search");
  const router = useRouter();
  const [openAddBusiness, setOpenAddBusiness] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(search || "");
  const user = useAtomValue(userAtom);
  // const currentPath = location.pathname;
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Update the search query state
  };

  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
    console.log("Search Term Sent:", searchTerm);
    search = "";
  };

  const handleNavigateToPopularJob = () => {
    router.push(`/popular-jobs`);
    window.scrollTo(0, 0);
  };
  const handleNavigateToForYouJob = () => {
    router.push(`/jobs-for-you`);
    window.scrollTo(0, 0);
  };

  const [getPopularJobsQuery, getJobForYouQuery] = useQueries({
    queries: [
      {
        queryKey: ["getall-popular-jobs"],
        queryFn: () => getPopularJobs(1),
        retry: 0,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["get-foryou-jobs"],
        queryFn: () => getForYouJobs(1),
        retry: 0,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const popularJobsData = getPopularJobsQuery?.data?.data?.data;

  const popularJobsError = getPopularJobsQuery?.error as AxiosError;
  const popularJobsErrorMessage =
    popularJobsError?.message || "An error occurred. Please try again later.";

  const forYouJobData = getJobForYouQuery?.data?.data?.data;

  const fotYouJobsError = getJobForYouQuery?.error as AxiosError;
  const forYouJobErrorMessage =
    fotYouJobsError?.message || "An error occurred. Please try again later.";

  const handleNavigateRegisterAsAnApplicant = () => {
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
      router.push("/job/register-as-applicant");
      window.scrollTo(0, 0);
    }
 
  };

  const handleNavigateAddBusiness = () => {
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
    }
    if (
      // user?.claim_status === null ||
      // user?.claim_status?.toString() === "2" ||
      // user?.claim_status?.toLowerCase() === "rejected" ||
      user?.claim_status !== "successful" &&
      user?.role === "3"
    ) {
      setOpenAddBusiness(true);
    }
    if (user?.claim_status === "successful" || user?.role === "2") {
      router.push(routes.job.postJob);
      window.scrollTo(0, 0);
    }

   
  };

  const handleCloseBusinessModal = () => {
    setOpenAddBusiness(false);
    router.push(routes.job.AddBusiness);
  };

  const handleNavigateTOSellerSignup = () => {
    setOpenAddBusiness(false);
    router.push(routes.auth.sellerVerification);
  };

  const resetSearchTerm = () => {
    setSearchTerm(""); // Clear the search term
    console.log(searchTerm, "olak");
    setAppliedSearchTerm(""); // Clear applied search term
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
            <p className={styles.picHead}>Jobs</p>
          </div>
          <div>
            <div className={styles.searchWrapper}>
              <SearchInput
                placeholder="Search for a Job..."
                // width="40rem"
                // isBtn={true}
                onChange={handleInputChange}
                value={searchTerm}
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
          </div>
        </div>
        <div className={styles.newCard}>
          <div>
            <h1 className={styles.newCardH1}>
              Find Jobs And Hire Talents On Blinkers
            </h1>
            <p className={styles.newCardP}>
              Discover job opportunities or post vacancies to connect with the
              right candidates
            </p>
            <div className={styles.btnFlex}>
              <Button
                icon={<Image src='/whitecircleadd.svg' alt={'WhiteAdd'} preview={false} />}
                className={styles.buttonStyle}
                text={
                  user && user?.security_token
                    ? "Post a Job"
                    : "Post a Job For Free"
                }
                variant="greenOutline"
                onClick={handleNavigateAddBusiness}
              />

              {((user && !user?.is_applicant) || !user) && (
                <Button
                  icon={
                    <Image
                      src='/whiteaddprofile.svg'
                      alt={'WhiteProfile'}
                      preview={false}
                    />
                  }
                  className={styles.buttonStyle}
                  text="Register as An Applicant"
                  variant="green"
                  onClick={handleNavigateRegisterAsAnApplicant}
                />
              )}
            </div>
          </div>
          <img src='/viewVacancy.svg' alt="ViewVacancy" />
        </div>

        {getPopularJobsQuery?.isLoading ? (
          <CustomSpin />
        ) : getPopularJobsQuery?.isError ? (
          <h1 className="error">{popularJobsErrorMessage}</h1>
        ) : (
          popularJobsData &&
          popularJobsData?.length > 0 && (
            <section>
              <div>
                <div className={styles.review}>
                  <div className={styles.reviewbtn}>
                    <p className={styles.title}>Popular Jobs</p>

                    {popularJobsData && popularJobsData?.length > 4 && (
                      <div
                        onClick={handleNavigateToPopularJob}
                        className={styles.btnWrapper}
                      >
                        <p className={styles.btn}>See All</p>
                        <img src={'/arrow-right-green.svg'} alt="ArrowIcon" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <PopularJobs limit={4} canSeeBtn={false} />
            </section>
          )
        )}

        {getJobForYouQuery?.isLoading ? (
          <CustomSpin />
        ) : getJobForYouQuery?.isError ? (
          <h1 className="error">{forYouJobErrorMessage}</h1>
        ) : (
          forYouJobData &&
          forYouJobData?.length > 0 && (
            <section>
              <div>
                <div className={styles.review}>
                  <div className={styles.reviewbtn}>
                    <p className={styles.title}>Jobs For You</p>

                    {forYouJobData && forYouJobData?.length > 4 && (
                      <div
                        onClick={handleNavigateToForYouJob}
                        className={styles.btnWrapper}
                      >
                        <p className={styles.btn}>See All</p>
                        <img src={'/arrow-right-green.svg'} alt="ArrowIcon" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <JobForYou limit={4} canSeeBtn={false} />
            </section>
          )
        )}

        <div className={styles.newCard}>
          <div>
            <h1 className={styles.newCardH1}>Looking For Job? </h1>
            <p className={styles.newCardP}>
              Find jobs that match your skills and apply today.
            </p>
            <div className={styles.btnFlex}>
              {((user && !user?.is_applicant) || !user) && (
                <Button
                  icon={
                    <Image
                      src='/whiteaddprofile.svg'
                      alt={'WhiteProfile'}
                      preview={false}
                    />
                  }
                  className={styles.buttonStyle}
                  text="Register as An Applicant"
                  variant="green"
                  onClick={handleNavigateRegisterAsAnApplicant}
                />
              )}
            </div>
          </div>
          <img src='/image 39.svg' alt="JobImage" />
        </div>

        <JobLists
          searchTerm={appliedSearchTerm}
          resetSearchTerm={resetSearchTerm}
        />
      </div>

      <ModalContent
        icon={<img src='/warned.svg' alt="warn" />}
        open={openAddBusiness}
        handleCancel={() => setOpenAddBusiness(false)}
        handleClick={handleCloseBusinessModal}
        handleClickBtn2={handleNavigateTOSellerSignup}
        BtnText="Add Business To Directory"
        BtnText2="Become a seller"
        heading="Business Not Added To Directory "
        text={
          "It looks like your business has not been registered in our directory and you are not also a seller, Add your business to the directory now or register as a seller to be able to post jobs."
        }
      />
      {/* <ModalContent
        icon={<img src={warn} alt="warn" />}
        open={loginModal}
        handleCancel={() => setOpenLoginModal(false)}
        handleClick={handleNavigateToLogin}
        BtnText="Login"
        heading="Please Login to continue"
      /> */}

      <Modal
        open={openLoginModal}
        onCancel={() => setOpenLoginModal(false)}
        centered
        footer={null}
      >
        <JobWelcome
          handleCloseModal={() => setOpenLoginModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Jobs;
