import styles from "./styles.module.scss";
import Profile from "../../../assets/Avatarprofile.svg";
import CameraIcon from "../../../assets/camera.svg";
import { Form, Formik, FormikValues } from "formik";
import Input from "../../../customs/input/input";
import Button from "../../../customs/button/button";
import { basicInfoApi, getAllState, getLGAbyStateId } from "../../request";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import SearchableSelect from "../../../customs/searchableSelect/searchableSelect";
import { userAtom } from "../../../utils/store";
import { useAtomValue } from "jotai";
import { App } from "antd";
import { errorMessage } from "../../../utils/errorMessage";
import * as Yup from "yup";
interface Props {
  profileData?: UserData;
}

const YourProfile = ({ profileData }: Props) => {
  const [stateId, setStateId] = useState(profileData?.state_id);
  const user = useAtomValue(userAtom);
  const { notification } = App.useApp();
  const [profileImage, setProfileImage] = useState<any>(null);
  const queryClient = useQueryClient();
  const [previewImage, setPreviewImage] = useState<string | null>(null); // For preview

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: Function
  ) => {
    if (!e.target?.files) return;
    const selectedFile = e.target?.files[0];

    // Define valid file types
    const validFileTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
    ];

    // Validate if the file type is valid
    if (!validFileTypes.includes(selectedFile.type)) {
      notification.error({
        message: "Invalid File Type",
        description:
          "The logo field must be a file of type: jpg, jpeg, png, gif, docx, doc, ppt.",
      });
      return;
    }
    setFieldValue("profile_image", selectedFile);
    setProfileImage(selectedFile);
    setPreviewImage(URL.createObjectURL(selectedFile)); // Generate preview URL
  };

  const [getStateQuery, getLGAQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-all-state"],
        queryFn: getAllState,
        retry: 0,
        refetchOnWindowFocus: true,
      },
      {
        queryKey: ["get-all-lga", stateId],
        queryFn: () => getLGAbyStateId(stateId!),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!stateId,
      },
    ],
  });

  const stateData = getStateQuery?.data?.data?.data ?? [];
  const lgaData = getLGAQuery?.data?.data?.data ?? [];

  const stateOptions: { value: number; label: string }[] = [
    { value: 0, label: "Select State" }, // Default option
    ...(stateData && stateData?.length > 0
      ? stateData?.map((item: StateDatum) => ({
          value: item?.id,
          label: item?.state_name,
        }))
      : []),
  ];

  const lgaOptions: { value: number; label: string }[] = [
    { value: 0, label: "Select Lga" }, // Default option
    ...(lgaData && lgaData?.length > 0
      ? lgaData?.map((item: LGADatum) => ({
          value: item?.id,
          label: item?.local_government_area,
        }))
      : []),
  ];

  const handleStateChange = (value: number, setFieldValue: any) => {
    console.log("Selected State ID:", value);
    setStateId(value);
    setFieldValue("local_government_area_id", "");
  };

  const basicInfoMutation = useMutation({
    mutationFn: basicInfoApi,
  });

  const basicInfoHandler = async (values: FormikValues) => {
    const formData = new FormData();

    formData.append("name", values?.name);
    formData.append("store_name", values?.store_name);
    formData.append("address", values?.address);

    formData.append("state_id", values?.state_id);

    formData.append(
      "local_government_area_id",
      values?.local_government_area_id
    );

    formData.append("facebook_address", values?.facebook_address);
    formData.append("instagram_address", values?.instagram_address);
    formData.append("twitter_address", values?.twitter_address);
    formData.append("website_address", values?.website_address);

    if (profileImage) {
      formData.append("profile_image", profileImage);
    }
    formData.append("_method", "patch");

    try {
      await basicInfoMutation.mutateAsync(formData, {
        onSuccess: (data) => {
          notification.success({
            message: "Success",
            description: data?.message,
          });
          setProfileImage(null);
          queryClient.refetchQueries({
            queryKey: ["get-all-jobs"],
          });
          // handleNext();
        },
      });
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: errorMessage(error) || "An error occurred",
      });

      setProfileImage(null);
    }
  };
  const validationSchema = Yup.object().shape({
    // address: Yup.string().required("required").max(55),
  });

  return (
    <div>
      <Formik
        initialValues={{
          name: profileData?.name || "",
          address: profileData?.address || "",
          email: profileData?.email,
          number: profileData?.number || "",
          store_name: profileData?.store_name || "",
          store_bio: "",
          state_id: profileData?.state_id || "",
          local_government_area_id: profileData?.local_government_area_id || "",
          profile_image: profileData?.profile_image || "",
          facebook_address: profileData?.facebook_address || "",
          instagram_address: profileData?.instagram_address || "",
          twitter_address: profileData?.twitter_address || "",
          website_address: profileData?.website_address || "",
        }}
        onSubmit={(values) => {
          basicInfoHandler(values);
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
      >
        {({ setFieldValue }) => {
          return (
            <Form>
              <div>
                <p style={{ fontWeight: "bold" }}>Edit Profile</p>

                <div className={styles.abs}>
                    <img
                      src={
                        previewImage
                          ? previewImage
                          : profileData?.profile_image || Profile
                      }
                      alt="profile"
                      className={styles.profile}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        document.getElementById("fileInput")?.click()
                      }
                    />
                  <img
                    src={CameraIcon}
                    alt="Camera"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }

                  />
                </div>
                <input
                  name="profile_image"
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(e, setFieldValue)}
                />


                {user?.role === "2" ? (
                  <div>
                    <div className={styles.inputContainer}>
                      <Input name="store_name" placeholder="Store name" />
                      <Input name="email" placeholder="Email" disabled={true} />
                    </div>
                    <div className={styles.inputContainer}>
                      <Input name="address" placeholder="Address" />
                      <Input
                        name="number"
                        placeholder="Phone number"
                        disabled={true}
                      />
                    </div>
                    <br />

                    <SearchableSelect
                      label="Select State"
                      name="state_id"
                      options={stateOptions}
                      placeholder="Select State"
                      onChange={(value: any) =>
                        handleStateChange(value, setFieldValue)
                      }
                    />
                    <br />

                    <SearchableSelect
                      label="Select LGA"
                      name="local_government_area_id"
                      options={lgaOptions}
                      placeholder="Select LGA"
                    />

                    <div className={styles.inputContainer}>
                      <Input
                        name="facebook_address"
                        placeholder="facebook address"
                      />
                      <Input
                        name="instagram_address"
                        placeholder="instagram address"
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <Input
                        name="twitter_address"
                        placeholder="twitter address"
                      />
                      <Input
                        name="website_address"
                        placeholder="website address"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className={styles.inputContainer}>
                      <Input name="name" placeholder="name" />
                      <Input
                        name="email"
                        placeholder={profileData?.email}
                        disabled={true}
                      />
                    </div>
                    <div className={styles.inputContainer}>
                      <Input name="address" placeholder="address" />
                      <Input
                        name="number"
                        placeholder="phone"
                        disabled={true}
                      />
                    </div>
                    <br />
                  </div>
                )}
                <br />
                <br />

                <Button
                  variant="green"
                  type="submit"
                  disabled={false}
                  text="Submit"
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
export default YourProfile;
