import styles from "./styles.module.scss";
import { Image } from "antd";
import { useQueries } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { getBusinessById } from "@/services/businessServices";
import CustomSpin from "@/components/ui/spin";

// Main component with `limit` prop to control how many data to display
const ImagePage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const handleNavigateToPrevious = () => {
    router.back();
    window.scrollTo(0, 0);
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

  const images =
    businessDetailsData?.gallery &&
    businessDetailsData?.gallery?.filter((item) => item?.type?.toLowerCase() === "image");

  return (
    <>
     {getBusinessDetailsQuery?.isLoading ? (
        <CustomSpin />
      ) : getBusinessDetailsQuery?.isError ? (
        <h1 className="error">{businessDetailsErrorMessage}</h1>
      ) : (

<div className="wrapper">
      <div onClick={() => handleNavigateToPrevious()} className={styles.back}>
        <Image width={9} src="/back.svg" alt="BackIncon" preview={false} />
        <p>Back</p>
      </div>

      <div className={styles.imageWrapper}>
        <div className={styles.InnerWrapper}>
          <div className={styles.promoHead}>
            <p>Photos</p>
          </div>

          {/* Display the promo images with the limit applied */}
          <section className={styles.promoImageContainer}>
            {images?.map((card) => (
              <div className={styles.imageContainer} key={card.id}>
                <Image
                  key={card?.url}
                  src={card.url}
                  alt={card?.id}
                  className={styles.image}
                />
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
      )}
    </>
  
  );
};

export default ImagePage;
