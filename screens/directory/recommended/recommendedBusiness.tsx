import styles from "./styles.module.scss";
import { Image, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import LocationIcon from "../../../assets/locationrelated.svg";
import CallIcon from "../../../assets/callrelated.svg";
import { useQueries } from "@tanstack/react-query";
import { getAllBusiness } from "../../request";
import { AxiosError } from "axios";
import RouteIndicator from "../../../customs/routeIndicator";
import { sanitizeUrlParam } from "../../../utils";
import usePagination from "../../../hooks/usePagnation";
import { useEffect } from "react";


interface Props {
  limit?: number;
  showHeading?: boolean;
}
const RecommendedBusinesses = ({
  showHeading = true,
  limit,
}: Props) => {
  const navigate = useNavigate();
  const { currentPage, setCurrentPage, onChange, pageNum } = usePagination();
  useEffect(() => {
    if (currentPage !== pageNum) {
      setCurrentPage(pageNum);
    }
  }, [pageNum, currentPage, setCurrentPage]);
  // const handleNavigateDirectory = (id: number, name:string,about:string) => {
  //   // navigate(`/directory-details/${id}`);
  //   navigate(`/directory-details/${id}/${sanitizeUrlParam(name)}/${sanitizeUrlParam(about)}`);

  //   window.scroll(0, 0);
  // };

  const handleNavigateDirectory = (id: number, name:string) => {
    // navigate(`/directory-details/${id}`);
    navigate(`/directory-details/${id}/${sanitizeUrlParam(name)}`);

    window.scroll(0, 0);
  };

  

  const [getAllRecommendedBusinessQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-all-recommended",],
        queryFn: () => getAllBusiness(),
        retry: 0,
        refetchOnWindowFocus: false,
      },
    ],
  });


  const recommendedBusiness = getAllRecommendedBusinessQuery?.data?.data?.data;



  const recommendedBusinessError = getAllRecommendedBusinessQuery?.error as AxiosError;
  const recommendedBusinessErrorMessage =
  recommendedBusinessError?.message ||
    "An error occurred. Please try again later.";



  const recommendedBusinessData =
  recommendedBusiness && recommendedBusiness?.length > 0
      ? recommendedBusiness?.slice(0, limit)
      : recommendedBusiness;


  
  return (
    <>
      <div className={showHeading ? "wrapper" : ""}>
        {showHeading && <RouteIndicator showBack />}

       

        <div>
          {showHeading && (
            <div className={styles.promoHead}>
              <p>Recommended Businesses</p>
            </div>
          )}
          {recommendedBusiness?.isError ? (
            <h1 className="error">{recommendedBusinessErrorMessage}</h1>
          ) : (
            <section className={styles.promoImageContainer}>
              {recommendedBusinessData &&
                recommendedBusinessData?.length > 0 &&
                recommendedBusinessData?.map((item: any, index: number) => (
                  <div
                  onClick={() => handleNavigateDirectory(item?.id, item?.name)}
                    // onClick={() => handleNavigateDirectory(item?.id, item?.name,item?.about)}
                    className={styles.promoImage}
                    key={index}
                  >
                    <img className={styles.proImage} src={item?.logo} alt="" />
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
                          src={LocationIcon}
                          alt="LocationIcon"
                          preview={false}
                        />

                        <p>
                          {item?.address && item?.address?.length > 20
                            ? `${item?.address?.slice(0, 20)}...`
                            : item?.address}
                        </p>
                      </div>
                      )}
                      {item?.phone && (
                      <div className={styles.info}>
                        <Image
                          width={20}
                          height={20}
                          src={CallIcon}
                          alt="CallIcon"
                          preview={false}
                        />

                        <p>{item.phone}</p>
                      </div>)}
                      {/* <p className={styles.subjectBg}>Fashion Accessories</p> */}
                    </div>
                  </div>
                ))}
            </section>
          )}
        </div>
      </div>

            {showHeading && (
        <Pagination
          current={currentPage}
          total={getAllRecommendedBusinessQuery?.data?.data?.total} // Total number of items
          pageSize={20} // Number of items per page
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
    </>
  );
};

export default RecommendedBusinesses;
