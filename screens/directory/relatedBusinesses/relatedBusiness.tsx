import styles from "./relatedBusiness.module.scss";
import { Image } from "antd";
import { useQueries } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { getBusinessById } from "@/services/businessServices";
import { sanitizeUrlParam } from "@/lib/utils";
import RouteIndicator from "@/components/ui/routeIndicator";

interface Props {
  limit?: number;
  showHeading?: boolean;
}
const RelatedBusinesses = ({ showHeading = true, limit }: Props) => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // const handleNavigateDirectory = (id: number, name:string,about:string) => {
  //   // navigate(`/directory-details/${id}`);
  //   navigate(`/directory-details/${id}/${sanitizeUrlParam(name)}/${sanitizeUrlParam(about)}`);

  //   window.scroll(0, 0);
  // };

  const handleNavigateDirectory = (id: number, name: string) => {
    // navigate(`/directory-details/${id}`);
    router.push(`/directory-details/${id}/${sanitizeUrlParam(name)}`);

    window.scroll(0, 0);
  };

  const [getBusinessDetailsQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-business-details", id],
        queryFn: () => getBusinessById(parseInt(id!)),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!id,
      },
    ],
  });

  const businessDetailsData = getBusinessDetailsQuery?.data?.data;
  const businessDetailsError = getBusinessDetailsQuery?.error as AxiosError;
  const businessDetailsErrorMessage =
    businessDetailsError?.message ||
    "An error occurred. Please try again later.";

  const relatedBusiness = businessDetailsData?.related_businesses;

  const relatedBusinessData =
    relatedBusiness && relatedBusiness?.length > 0
      ? relatedBusiness?.slice(0, limit)
      : relatedBusiness;

  return (
    <>
      <div className={showHeading ? "wrapper" : ""}>
        {showHeading && <RouteIndicator showBack />}

        {/* {showSeeAll && relatedBusinessLength > 0 && (
          <div>
            <div className={styles.reviewbtn}>
              <p className={styles.title}> Related Businesses</p>

              <div
                onClick={handleNavigateToRelatedBusiness}
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
            </div>
          </div>
        )} */}

        <div>
          {showHeading && (
            <div className={styles.promoHead}>
              <p>Related Businesses</p>
            </div>
          )}
          {getBusinessDetailsQuery?.isError ? (
            <h1 className="error">{businessDetailsErrorMessage}</h1>
          ) : (
            <section className={styles.promoImageContainer}>
              {relatedBusinessData &&
                relatedBusinessData?.length > 0 &&
                relatedBusinessData?.map((item: any, index: number) => (
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
                            src="/locationrelated.svg"
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
                            src="/callrelated.svg"
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
    </>
  );
};

export default RelatedBusinesses;
