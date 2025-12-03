import styles from "./style.module.scss";
import { App, Image, Modal } from "antd";
import axios from "axios";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import GeneralWelcome from "../market/marketLogin/marketLogin";
import { getCityAndState } from "@/lib/utils/location";
import { userAtom } from "@/lib/utils/store";
import { useRouter } from "next/navigation";
import CustomSpin from "@/components/ui/spin";
import Button from "@/components/ui/button/button";
import { AddToFav, getTrendingAds } from "@/services/adsServices";

const Trends = () => {
  const [location, setLocation] = useState<{ city?: string; state?: string }>(
    {}
  );
  const { notification } = App.useApp();

  useEffect(() => {
    (async () => {
      try {
        const loc = await getCityAndState();
        setLocation(loc);
      } catch (err: any) {
        notification.error({
          title: "Error",
          description: err || "Failed to access location. Please enable GPS.",
        });
      }
    })();
  }, []);

  const router = useRouter();
  const user = useAtomValue(userAtom);
  const queryClient = useQueryClient();
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const favData = { user_id: user?.id };

  const getFavapi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
      Pragma: "no-cache",
      Expires: "0",
      Authorization: `Bearer ${user?.security_token}`,
    },
    params: favData,
  });

  const getAllFav = async () => {
    return (await getFavapi.get(`/ads/fav`))?.data;
  };

  const [getTrendingAdsQuery, getAllFavAds] = useQueries({
    queries: [
      {
        queryKey: ["get-trending-ads", location.city, location.state],
        queryFn: () => getTrendingAds(location.city, location.state),
      },
      {
        queryKey: ["get-all-fav", user?.id],
        queryFn: getAllFav,
        enabled: !!user?.id,
      },
    ],
  });

  const favIcons =
    getAllFavAds?.data?.data?.map((item: AddToFav) => item.id) || [];

  const trendData = getTrendingAdsQuery?.data?.data || [];

  const addToFavMutation = useMutation({
    mutationFn: AddToFav,
    mutationKey: ["add-fav"],
  });

  const addToFavHandler = async (id?: string) => {
    if (!id) return;

    const isFav = favIcons.includes(parseInt(id));

    const payload = {
      add_id: id,
      status: isFav ? 0 : 1,
    };

    try {
      await addToFavMutation.mutateAsync(payload, {
        onSuccess: () => {
          queryClient.refetchQueries({ queryKey: ["get-all-fav"] });
        },
      });
    } catch {
      setOpenLoginModal(true);
    }
  };

  const handleNavigateToProductDetails = (slug: string) => {
    router.push(`/product-details/${slug}`);
    window.scrollTo(0, 0);
  };

  const handleNavigateToMarket = () => {
    router.push(`/product-listing`);
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.accessWrapper}>
      <p className={styles.TrendsHead}>Trending Now</p>

      {getTrendingAdsQuery.isLoading ? (
        <CustomSpin />
      ) : getTrendingAdsQuery.isError ? (
        <h1>Error loading items</h1>
      ) : (
        <div className={styles.gridContainer}>
          {trendData.map((item: any, index: number) => (
            <div
              className={styles.card}
              key={index}
              onClick={() => handleNavigateToProductDetails(item?.slug)}
            >
              <div
                className={styles.favoriteIcon}
                onClick={(e) => {
                  e.stopPropagation();
                  addToFavHandler(item.id?.toString());
                }}
              >
                <Image
                  width={25}
                  src={
                    favIcons.includes(item.id)
                      ? "/redfav.svg"
                      : "/Icon + container.svg"
                  }
                  preview={false}
                />
              </div>

              <img
                className={styles.cardImage}
                src={item?.cover_image_url || "/Image.svg"}
                alt={item?.title}
              />

              <div className={styles.cardInfo}>
                <p className={styles.title}>
                  {item?.title?.length > 30
                    ? item?.title.slice(0, 30) + "..."
                    : item?.title}
                </p>

                <div className={styles.location}>
                  <img src="/location.svg" />
                  <span>
                    {(item?.local_govt?.local_government_area || "") +
                      ", " +
                      (item?.state?.state_name || "")}
                  </span>
                </div>

                <p className={styles.price}>
                  ₦{item?.discount_price || item.price}
                </p>

                {item.discount_price && (
                  <p className={styles.oldPrice}>₦{item.price}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.shopBtnContainer}>
        <Button
          type="button"
          variant="green"
          text="Shop Now"
          onClick={handleNavigateToMarket}
          className="buttonStyle"
        />
      </div>

      <Modal
        open={openLoginModal}
        onCancel={() => setOpenLoginModal(false)}
        centered
        footer={null}
      >
        <GeneralWelcome handleCloseModal={() => setOpenLoginModal(false)} />
      </Modal>
    </div>
  );
};

export default Trends;
