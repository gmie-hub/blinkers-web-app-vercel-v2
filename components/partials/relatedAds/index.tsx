"use client"

import styles from "./index.module.scss";
import { Image } from "antd";
import { useQueries } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { countUpTo, sanitizeUrlParam } from "@/lib/utils";
import { getProductDetailsByslug } from "@/services/adsServices";
import RouteIndicator from "@/components/ui/routeIndicator";
import CustomSpin from "@/components/ui/spin";

interface Props {
  limit?: number;
  canSeeBtn?: boolean;
}

const RelatedAds = ({ canSeeBtn = true, limit }: Props) => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [getProductDetailsQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-product-details", id],
        queryFn: () => getProductDetailsByslug(id!),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: false,
      },
    ],
  });

  const handleNavigateToProductDetails = (id: number, user_id: number) => {
    router.push(
      `/product-details/${id}/${user_id}/${sanitizeUrlParam(
        productDetailsData?.title ?? ""
      )}/${sanitizeUrlParam(productDetailsData?.description ?? "")}}`
    );
    window.scrollTo(0, 0);
  };

  // const handleNavigateToProductDetails = (slug: string) => {
  //   navigate(`/product-details/${slug}}`);
  //   window.scrollTo(0, 0);
  // };

  const productDetailsData = getProductDetailsQuery?.data?.data;
  const productDetailsError = getProductDetailsQuery?.error as AxiosError;
  const productDetailsErrorMessage =
    productDetailsError?.message ||
    "An error occurred. Please try again later.";

  const reletedJob = productDetailsData?.related_ads;
  console.log(reletedJob, "reletedJobreletedJob");

  const relatedAdssData =
    reletedJob && reletedJob?.length > 0
      ? reletedJob.slice(0, limit)
      : reletedJob;

  return (
    <main className="wrapper">
      <div className={styles.relatedWrapper}>
        {canSeeBtn && <RouteIndicator showBack />}

        {getProductDetailsQuery?.isLoading ? (
          <CustomSpin />
        ) : getProductDetailsQuery?.isError ? (
          <h1 className="error">{productDetailsErrorMessage}</h1>
        ) : (
          <section className={styles.promoImageContainer}>
            {relatedAdssData &&
              relatedAdssData?.length > 0 &&
              relatedAdssData?.map((item, index) => (
                <div
                  onClick={() =>
                    handleNavigateToProductDetails(item?.id, item?.user_id)
                  }
                  // onClick={() => handleNavigateToProductDetails(item?.slug)}

                  className={styles.promoImage}
                  key={index}
                >
                  <div className={styles.favoriteIcon}>
                    <img width={30} src="/Icon + container.svg" alt="Favorite" />
                  </div>
                  <img
                    className={styles.proImage}
                    src={
                      item?.add_images[0]?.image_url ||
                      item?.add_images[0]?.add_image
                    }
                    alt={item.title}
                  />
                  <div className={styles.productList}>
                    <p style={{ color: "#4F4F4F" }}>
                      {item?.title && item?.title?.length > 20
                        ? `${item?.title?.slice(0, 20)}...`
                        : item?.title}
                    </p>
                    {item?.state?.state_name !== null && (
                      <div className={styles.info}>
                        <Image src="/locationrelated.svg" alt="Location" />
                        <p>
                          <span>
                            {item?.local_govt?.local_government_area}{" "}
                          </span>
                          <span>{item?.state?.state_name}</span>
                        </p>
                      </div>
                    )}
                    <p style={{ color: "#222222", fontWeight: "600" }}>
                      ₦{item.price}
                    </p>
                    <div className={styles.starWrapper}>
                      {countUpTo(
                        0,
                        <Image
                          width={13}
                          src="/staryellow.svg"
                          alt="Star Yellow"
                          preview={false}
                        />,
                        <Image
                          width={13}
                          src="/Vector.svg"
                          alt="Star"
                          preview={false}
                        />
                      )}
                      <span className={styles.starNum}>(20)</span>
                    </div>
                  </div>
                </div>
              ))}
          </section>
        )}
      </div>
    </main>
  );
};

export default RelatedAds;
