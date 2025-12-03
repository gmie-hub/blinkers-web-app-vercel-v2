import { useEffect, useState } from "react";
import SmallScreen from "./smallScreenSellerDetails";
import BigScreen from "./productDetails";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { App, Modal } from "antd";
import { useAtomValue } from "jotai";
import GeneralWelcome from "../marketLogin/marketLogin";
import { useRouter, useSearchParams } from "next/navigation";
import { userAtom } from "@/lib/utils/store";
import Button from "@/components/ui/button/button";
import { errorMessage } from "@/lib/utils/errorMessage";
import RouteIndicator from "@/components/ui/routeIndicator";
import CustomSpin from "@/components/ui/spin";
import { AddToFav, getProductDetails, getProductDetailsByslug } from "@/services/adsServices";
import { FollowSeller, getBusinessById, getFollowersByBusiness_id, getFollowersByUser_id } from "@/services/businessServices";
import { getApplicantsbyId } from "@/services/applicantServices";
import { getFlaggedSellerBySeller_idUser_id } from "@/services/sellerServices";

const Main = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Track window width
  const user = useAtomValue(userAtom);
  const queryClient = useQueryClient();
  const { notification } = App.useApp();
  const currentPath = location.pathname;
  const [businessId, setBusinessId] = useState<null | number>();
  const [sellerId, setSellerId] = useState<null | number>();
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const router = useRouter();
  const id = useSearchParams().get("id");

  const idOrSlug = id!;

  const isId = /^\d+$/.test(idOrSlug);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty dependency array ensures it only runs once on mount

  const [
    getProductDetailsQuery,
    getSellersFollowersQuery,
    getBusinessDetailsQuery,
    getBusinessFollowersQuery,
    getUserDetailsQuery,
    getFlaggedSellerQuery,
  ] = useQueries({
    queries: [
      {
        queryKey: ["get-product-details", id],
        // queryFn: () => getProductDetails(parseInt(id!)),
        queryFn: () =>
          isId
            ? getProductDetails(parseInt(idOrSlug))
            : getProductDetailsByslug(idOrSlug),

        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!id,
      },

      {
        queryKey: ["get-sellers-followers", sellerId],
        queryFn: () => getFollowersByUser_id(user?.id ?? 0, sellerId!),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!user?.id,
      },
      {
        queryKey: ["get-business-details"],
        queryFn: () => getBusinessById(businessId!),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!businessId,
      },
      {
        queryKey: ["get-business-followers", businessId],
        queryFn: () => getFollowersByBusiness_id(user?.id ?? 0, businessId!),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!user?.id,
      },
      {
        queryKey: ["get-sellers-details", sellerId],
        queryFn: () => getApplicantsbyId(sellerId!),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!sellerId,
      },
      {
        queryKey: ["get-flagged-sellers"],
        queryFn: () =>
          getFlaggedSellerBySeller_idUser_id(user?.id ?? 0, sellerId!),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!sellerId,
      },
    ],
  });

  const addToFavMutation = useMutation({
    mutationFn: AddToFav,
    mutationKey: ["add-fav"],
  });

  const addToFavHandler = async () => {
    if (!id) return;

    const payload: Partial<AddToFav> = {
      add_id: id,
      status: productDetailsData?.isFavourite ? 0 : 1,
    };

    try {
      await addToFavMutation.mutateAsync(payload, {
        onSuccess: () => {
          // notification.success({
          //   message: "Success",
          //   description: data?.message,
          // });
          queryClient.refetchQueries({
            queryKey: ["get-product-details"],
          });
        },
      });
    } catch {
      notification.open({
        message: "You need to logged in to save an item",
        description: (
          <>
            <br />
            <Button
              type="button"
              onClick={() => {
                notification.destroy();
                router.push(`/login?redirect=${currentPath}`);
              }}
            >
              Click here to Login
            </Button>
          </>
        ),
        placement: "top",
        duration: 4, // Auto close after 5 seconds
        icon: null,
      });
    }
  };

  const hasUserFlaggedSeller = getFlaggedSellerQuery?.data?.data?.data?.some(
    (item) => item?.user_id === user?.id
  );

  const isUserFollowingBusiness =
    getBusinessFollowersQuery?.data?.data?.data?.some(
      (item) => item?.follower_id === user?.id
    );

  const isUserFollowingSeller =
    getSellersFollowersQuery?.data?.data?.data?.some(
      (item) => item?.follower_id === user?.id
    );
  console.log(getProductDetailsQuery?.data?.data, "isUserFollowingBusiness");

  const productDetailsData = getProductDetailsQuery?.data?.data;

  // const productDetailsData = isId ?  getProductDetailsQuery?.data?.data : getProductDetailsQuery?.data?.data?.data[0];
  const productDetailsError = getProductDetailsQuery?.error as AxiosError;
  const productDetailsErrorMessage =
    productDetailsError?.message ||
    "An error occurred. Please try again later.";

  const businessDetailsData = getBusinessDetailsQuery?.data?.data;
  const profileDetailsData = getUserDetailsQuery?.data?.data;

  useEffect(() => {
    if (getProductDetailsQuery) {
      setBusinessId(productDetailsData?.business_id ?? 0);
      setSellerId(productDetailsData?.user_id ?? 0);
    }
  }, [
    getProductDetailsQuery,
    getProductDetailsQuery?.refetch,
    getProductDetailsQuery?.isSuccess,
    productDetailsData,
  ]);

  // const followBusinessMutation = useMutation({
  //   mutationFn: FollowBusiness,
  //   mutationKey: ["follow-business"],
  // });

  // const followBusinessHandler = async () => {
  //   const payload: Partial<FollowBusiness> = {
  //     business_id: productDetailsData?.business_id || 0,
  //     user_id: user?.id,
  //     action: isUserFollowingBusiness ? "unfollow" : "follow",
  //   };

  //   try {
  //     await followBusinessMutation.mutateAsync(payload, {
  //       onSuccess: (data) => {
  //         notification.success({
  //           message: "Success",
  //           description: data?.message,
  //         });
  //         queryClient.refetchQueries({
  //           queryKey: ["get-business-followers"],
  //         });
  //       },
  //     });
  //   } catch (error) {
  //     notification.error({
  //       message: "Error",
  //       description: errorMessage(error) || "An error occur",
  //     });
  //   }
  // };
  // const handleFollowBusiness = () => {
  //   if (!user) {
  //     notification.open({
  //       message: "You need to log in to complete this action.",
  //       description: (
  //         <>
  //           <br />
  //           <Button
  //             type="button"
  //             onClick={() => {
  //               notification.destroy();
  //               navigate(`/login?redirect=${currentPath}`);
  //             }}
  //           >
  //             Click here to Login
  //           </Button>
  //         </>
  //       ),
  //       placement: "top",
  //       duration: 4, // Auto close after 5 seconds
  //       icon: null,
  //     });
  //   } else {
  //     followBusinessHandler();
  //   }
  // };

  const followSellersMutation = useMutation({
    mutationFn: FollowSeller,
    mutationKey: ["follow-seller"],
  });

  const followSellerHandler = async () => {
    const payload: Partial<FollowBusiness> = {
      user_id: sellerId!,
      action: isUserFollowingSeller ? "unfollow" : "follow",
    };

    try {
      await followSellersMutation.mutateAsync(payload, {
        onSuccess: (data) => {
          notification.success({
            title: "Success",
            description: data?.message,
          });
          queryClient.refetchQueries({
            queryKey: ["get-sellers-followers"],
          });
        },
      });
    } catch (error) {
      notification.error({
        title: "Error",
        description: errorMessage(error) || "An error occur",
      });
    }
  };

  const handleFollowSeller = () => {
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
      followSellerHandler();
    }
  };

  return (
    <>
      <div className="wrapper">
        <RouteIndicator showBack />
      </div>

      {getProductDetailsQuery?.isLoading ? (
        <CustomSpin />
      ) : getProductDetailsQuery?.isError ? (
        <h1 style={{ textAlign: "center" }} className="error">
          {productDetailsErrorMessage}
        </h1>
      ) : (
        <div>
          {windowWidth < 1024 ? (
            <SmallScreen
              handleFollowBusiness={handleFollowSeller}
              handleFollowSeller={handleFollowSeller}
              productDetailsData={productDetailsData}
              followBusinessMutation={followSellersMutation?.isPending}
              followSellersMutation={followSellersMutation?.isPending}
              isUserFollowingBusiness={isUserFollowingBusiness}
              isUserFollowingSeller={isUserFollowingSeller}
              businessDetailsData={businessDetailsData}
              profileDetailsData={profileDetailsData}
              hasUserFlaggedSeller={hasUserFlaggedSeller}
              addToFavHandler={addToFavHandler}
            /> // Render SmallScreen on small screens
          ) : (
            <BigScreen
              handleFollowSeller={handleFollowSeller}
              handleFollowBusiness={handleFollowSeller}
              // handleFollowBusiness={handleFollowBusiness}
              productDetailsData={productDetailsData}
              followSellersMutation={followSellersMutation?.isPending}
              followBusinessMutation={followSellersMutation?.isPending}
              isUserFollowingBusiness={isUserFollowingBusiness}
              isUserFollowingSeller={isUserFollowingSeller}
              businessDetailsData={businessDetailsData}
              profileDetailsData={profileDetailsData}
              hasUserFlaggedSeller={hasUserFlaggedSeller}
              addToFavHandler={addToFavHandler}
            /> // Render BigScreen on larger screens
          )}
        </div>
      )}

      <Modal
        open={openLoginModal}
        onCancel={() => setOpenLoginModal(false)}
        centered
        footer={null}
      >
        <GeneralWelcome handleCloseModal={() => setOpenLoginModal(false)} />
      </Modal>
    </>
  );
};

export default Main;
