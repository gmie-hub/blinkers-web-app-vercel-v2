import styles from "./styles.module.scss";
import { Image, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import LocationIcon from "../../../assets/locationrelated.svg";
import CallIcon from "../../../assets/callrelated.svg";
import { useQueries } from "@tanstack/react-query";
import { getTopBusiness } from "../../request";
import { AxiosError } from "axios";
import RouteIndicator from "../../../customs/routeIndicator";
import { sanitizeUrlParam } from "../../../utils";
import CustomSpin from "../../../customs/spin";
import usePagination from "../../../hooks/usePagnation";
import { useEffect } from "react";

interface Props {
  limit?: number;
  showHeading?: boolean;
}
const TopBusiness = ({ showHeading = true, limit }: Props) => {
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

  const handleNavigateDirectory = (id: number, name: string) => {
    // navigate(`/directory-details/${id}`);
    navigate(`/directory-details/${id}/${sanitizeUrlParam(name)}`);

    window.scroll(0, 0);
  };

  const [getTopBusinessQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-top-business"],
        queryFn: getTopBusiness,
        retry: 0,
        refetchOnWindowFocus: false,
      },
    ],
  });

  const topBusiness = getTopBusinessQuery?.data?.data?.data;

  const businessDetailsError = getTopBusinessQuery?.error as AxiosError;
  const businessDetailsErrorMessage =
    businessDetailsError?.message ||
    "An error occurred. Please try again later.";

  const topBusinessData =
    topBusiness && topBusiness?.length > 0
      ? topBusiness?.slice(0, limit)
      : topBusiness;

  return (
    <>
      <div className={showHeading ? "wrapper" : ""}>
        {showHeading && <RouteIndicator showBack />}

        <div>
          {showHeading && (
            <div className={styles.promoHead}>
              <p>Top Businesses</p>
            </div>
          )}
          {getTopBusinessQuery?.isLoading ? (
            <CustomSpin />
          ) : getTopBusinessQuery?.isError ? (
            <h1 className="error">{businessDetailsErrorMessage}</h1>
          ) : (
            <section className={styles.promoImageContainer}>
              {topBusinessData &&
                topBusinessData?.length > 0 &&
                topBusinessData?.map((item: any, index: number) => (
                  <div
                    onClick={() =>
                      handleNavigateDirectory(item?.id, item?.name)
                    }
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
                        </div>
                      )}
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
          total={getTopBusinessQuery?.data?.data?.total} // Total number of items
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

export default TopBusiness;
