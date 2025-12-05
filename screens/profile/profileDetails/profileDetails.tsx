import styles from "./styles.module.scss";
import Avatarprofile from "../../../assets/Avatarprofile.svg";
import { deleteUser, getApplicantsbyId } from "../../request";
import { useMutation, useQueries } from "@tanstack/react-query";
import { userAtom } from "../../../utils/store";
import { useAtomValue } from "jotai";
import { AxiosError } from "axios";
import CustomSpin from "../../../customs/spin";
import ChangePassword from "./changePassword";
import YourProfile from "./yourProfile";
import Button from "../../../customs/button/button";
import { App } from "antd";
import { errorMessage } from "../../../utils/errorMessage";
import { logout } from "../../../utils/logout";
import ReusableModal from "../../../partials/deleteModal/deleteModal";
import { useState } from "react";
import DeleteIcon from "../../../assets/del.svg";

const ProfileDetails = () => {
  const user = useAtomValue(userAtom);
  const { notification } = App.useApp();
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const [getProfileQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-profile"],
        queryFn: () => getApplicantsbyId(user?.id!),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled:!!user?.id

      },
    ],
  });

  const profileData = getProfileQuery?.data?.data;
  const profileDetailsError = getProfileQuery?.error as AxiosError;
  const profileDetailsErrorMessage =
    profileDetailsError?.message ||
    "An error occurred. Please try again later.";

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      notification.success({
        message: "Success",
        description: "Deleted successfully",
      });
      logout();
    },
  });

  const DeleteUserHandler = async () => {
    try {
      // Call mutateAsync without the onSuccess callback, because it's already defined in useMutation
      await deleteUserMutation.mutateAsync();
    } catch (error: any) {
      // Handle error if the mutation fails
      notification.error({
        message: "Error",
        description: errorMessage(error) || "An error occurred",
      });
    }
  };



  return (
    <div>
      {getProfileQuery?.isLoading ? (
        <CustomSpin />
      ) : getProfileQuery?.isError ? (
        <h1 className="error">{profileDetailsErrorMessage}</h1>
      ) : (
        <div className={styles.mainContent}>
          <div className={styles.leftColumn}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p style={{ fontWeight: "bold" }}>Your Profile</p>
              <img
                className={styles.profile}
                src={profileData?.profile_image || Avatarprofile}
                alt="ProfileImg"
               
              />
              <p>
                {user?.role === "2"
                  ? profileData?.store_name
                  : profileData?.name}
              </p>
            </div>

            <br />
            <div className={styles.container}>
              <p className={styles.smalcard}>{profileData?.email || "email"}</p>
              <p className={styles.smalcard}>
                {profileData?.number || "phone number"}
              </p>

              <p className={styles.smalcard}>{profileData?.address}</p>
              {user?.role === "2" && (
                <p className={styles.smalcard}>
                  {profileData?.store_name || "store name"}
                </p>
              )}

              <p className={styles.smalcard}>audience</p>
            </div>
          </div>
          <div className={styles.middleColumn}>
            <YourProfile profileData={profileData} />
          </div>
          <div className={styles.rightColumn}>
            <ChangePassword />
            <Button
              onClick={()=>{setIsDeleteModal(true);}}
              type="button"
              text="Delete Account"
              variant="redOutline"
            />
          </div>
        </div>
      )}

      <ReusableModal
        open={isDeleteModal}
        handleCancel={() => setIsDeleteModal(false)}
        title="Are You Sure You Want to Delete Your Account?"
        confirmText={deleteUserMutation?.isPending ? 'loading...' :  "Yes, Submit"}
        cancelText="No, Go Back"
        handleConfirm={
          DeleteUserHandler
        }
        icon={<img src={DeleteIcon} alt="DeleteIcon" />}
        disabled={deleteUserMutation?.isPending}
      />

     
    </div>
  );
};
export default ProfileDetails;
