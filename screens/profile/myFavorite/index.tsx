import styles from "./myFavorite.module.scss";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { formatDateOnly, getTimeFromDate } from "../../../utils/formatTime";
import CustomSpin from "../../../customs/spin";
import { useAtomValue } from "jotai";
import { userAtom } from "../../../utils/store";
import favorite from "../../../assets/Icon + container.svg";
import { AddToFav } from "../../request";
import { App } from "antd";
import { errorMessage } from "../../../utils/errorMessage";

const MyFavorites = () => {
  const user = useAtomValue(userAtom);
  const { notification } = App.useApp();
  const queryClient = useQueryClient();

  const favData = {
    user_id: user?.id,
  };

  const getFavapi = axios.create({
    baseURL: import.meta.env.VITE_GATEWAY_URL,
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
      Pragma: "no-cache",
      Expires: "0",
      Authorization: `Bearer ${user?.security_token}`, // Get token from localStorage
    },
    params: favData,
  });

  const getAllFav = async () => {
    const url = `/ads/fav`;

    return (await getFavapi.get(url))?.data;
  };

  const [getAllFavAds] = useQueries({
    queries: [
      {
        queryKey: ["get-al-fav", user?.id],
        queryFn: getAllFav,
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!user?.id,
      },
    ],
  });

  const favDataList = getAllFavAds?.data?.data || [];

  const addToFavMutation = useMutation({
    mutationFn: AddToFav,
    mutationKey: ["add-fav"],
  });

  const addToFavHandler = async (id?: string) => {
    if (!id) return;

    const payload: Partial<AddToFav> = {
      add_id: id,
      status: 0,
    };
    try {
      await addToFavMutation.mutateAsync(payload, {
        onSuccess: () => {
          // notification.success({
          //   message: "Success",
          //   description: data?.message,
          // });
          queryClient.refetchQueries({
            queryKey: ["get-al-fav"],
          });
        },
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: errorMessage(error) || "An error occurred",
      });
    }
  };

  const favError = getAllFavAds?.error as AxiosError;
  const favErrorMessage =
    favError?.message || "An error occurred. Please try again later.";

  return (
    <div className={styles.whyWrapper}>
      {getAllFavAds?.isLoading ? (
        <CustomSpin />
      ) : getAllFavAds?.isError ? (
        <h1 className="error">{favErrorMessage}</h1>
      ) : (
        <>
          <div className={styles.cardContainer}>
            {favDataList &&
              favDataList?.length > 0 &&
              favDataList?.map((item: ProductDatum, index: number) => {
                return (
                  <div
                    className={`${styles.chooseCard}                   }`}
                    key={index}
                  >
                    <img
                      className={styles.proImage}
                      src={item?.add_images[0]?.add_image}
                      alt="Product"
                      width={150}
                      height={150}
                    />

                    <div className={styles.textContent}>
                      <div style={{ marginBottom: "50px" }}>
                        <h3 style={{ color: "#4F4F4F" }}>
                          {item?.title && item?.title?.length > 20
                            ? `${item?.title?.slice(0, 20)}...`
                            : item?.title}
                        </h3>{" "}
                        <p className={styles.para}>
                          {formatDateOnly(item?.favCreatedAt) || ""}

                          <span>
                            {" "}
                            {getTimeFromDate(item?.favCreatedAt) || ""}
                          </span>
                        </p>
                        <p className={styles.para}>
                          {item.local_govt?.local_government_area || ""},{" "}
                          {item?.state?.state_name}
                        </p>
                      </div>

                      <div className={styles.favorite}>
                        <span style={{ color: "#222222", fontWeight: "600" }}>
                          {/* ₦{item?.price} */}
                          {item?.discount_price === "" ? (
                            <span>{`₦${item?.price}`}</span>
                          ) : (
                            <span className={styles.canceledText}>
                              {`₦${item?.price}`}{" "}
                            </span>
                          )}
                          <span>
                            {" "}
                            {item?.discount_price &&
                              `₦${item?.discount_price} `}
                          </span>
                        </span>
                        <div
                          onClick={(event) => {
                            event.stopPropagation(); // Prevents click from bubbling to parent div
                            addToFavHandler(item?.id?.toString());
                          }}
                        >
                          <img src={favorite} alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};

export default MyFavorites;
