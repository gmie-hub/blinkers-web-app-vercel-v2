import { Form, Formik } from "formik";
import styles from "./styles.module.scss";
import { FC, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import Button from "../../../../customs/button/button";
import { errorMessage } from "../../../../utils/errorMessage";
import { deleteGalarybyId, uploadGallery } from "../../../request";
import ModalContent from "../../../../partials/successModal/modalContent";
// import linkIcon from "../../../../assets/link-2.svg";
import fileIcon from "../../../../assets/filegreen.svg";
import removeGreen from "../../../../assets/removegreen.svg";

import { userAtom } from "../../../../utils/store";
import { useAtomValue } from "jotai/react";

interface ComponentProps {
  onPrev: () => void;
  businessDetailsData?: AllBusinessesDatum;
}

const AddGallery: FC<ComponentProps> = ({ onPrev, businessDetailsData }) => {
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openEditBusinessSuccess, setOpenEditBusinessSuccess] = useState(false);
  const user = useAtomValue(userAtom);
  const { notification } = App.useApp();
  const [upload, setUpload] = useState<File | null>(null);

  const [uploadType, setUploadType] = useState("");
  const queryClient = useQueryClient();

  const deleteGalaryMutation = useMutation({ mutationFn: deleteGalarybyId });

  const DeleteGalaryHandler = async (imageIds: number[]) => {
    try {
      await deleteGalaryMutation.mutateAsync(
        {
          business_id: user?.business?.id!, // Ensure id is available
          ids: imageIds,
        },
        {
          onSuccess: (data) => {
            notification.success({
              message: "Success",
              description: data?.message,
            });
            queryClient.refetchQueries({
              queryKey: ["get-business-details"],
            });
          },
        }
      );
    } catch (error: any) {
      notification.error({
        message: "Error",
        description:errorMessage(error) || "An error occurred",
      });
    }
  };

  const UploadGalleryMutation = useMutation({
    mutationFn: uploadGallery,
    mutationKey: ["upload-business-gallery"],
  });

  const UploadGalleryHandler = async () => {
    const formData = new FormData();
const busId =user?.business?.id
    if (busId) {
      formData.append("business_id", busId?.toString()); // Correctly append the file
    }
    if (upload) {
      formData.append("files[]", upload); // Correctly append the file
    }
    formData.append("type", uploadType); // Correctly append the file

    try {
      await UploadGalleryMutation.mutateAsync(formData, {
        onSuccess: () => {
          // notification.success({
          //   message: 'Success',
          //   description: data?.message,
          // });
          setOpenSuccess(true);

          queryClient.refetchQueries({
            queryKey: ["get-business-details"],
          });
          setUpload(null);
        },
      });
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: errorMessage(error) || "An error occurred",
      });

      setUpload(null);
    }
  };

  const handleUploadClick = () => {
    const fileInput = document.getElementById(
      "uploadInput"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); // Trigger file input click
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const uploadType = isImage ? "image" : isVideo ? "video" : "";
      setUploadType(uploadType);

      const isValidType =
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel" ||
        file.type.startsWith("image/") ||
        file.type.startsWith("video/");

      if (!isValidType) {
        notification.error({
          message: "Invalid File Type",
          description:
            "Please upload an Excel file (.xls or .xlsx), an image, or a video.",
        });
        return;
      }

      setUpload(file);
      event.target.value = "";
    }
  };
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (upload) {
      UploadGalleryHandler();
    }
  }, [upload]);

  const isImage = (url: string) => {
    return /\.(jpg|jpeg|png|svg|gif)$/i.test(url);
  };

  // Function to check if the file is a video (you can modify based on your file structure)
  const isVideo = (url: string) => {
    return /\.(mp4|avi|mov|wmv|webm)$/i.test(url);
  };

  return (
    <section>
      <Formik
        initialValues={{
          businessName: "",
          category: "",
          businessAddress: "",
          phoneNumber: "",
          email: "",
          website: "",
          aboutBusiness: "",
        }}
        onSubmit={() => {
          // handleNext();
          // createBusinessHandler(values);
        }}
        // validationSchema={validationSchema}
      >
        {() => (
          <Form>
            <div className={styles.inputContainer}>
              <section className={styles.section}>
                <section className="space-between">
                  <p className={styles.addPhoto}>Add Photos</p>
                  <Button
                    variant="white"
                    type="button"
                    text="Upload Photos"
                    className={styles.buttonStyle}
                    icon={<img src={fileIcon} alt="fileIcon" />}
                    onClick={handleUploadClick}
                    isLoading={UploadGalleryMutation?.isPending}
                  />
                  <input
                    id="uploadInput"
                    type="file"
                    accept="image/*" // Allow images and videos
                    style={{ display: "none" }} // Hide the file input
                    onChange={handleFileChange} // Handle file selection
                  />
                </section>
                <br />
                {/* Filter and display only images */}
                <div className={styles.imageRow}>
                  {businessDetailsData?.gallery
                    ?.filter((item: gallery) => isImage(item?.url)) // Filter only images
                    ?.map((item: gallery, index: number) => (
                      <div key={index} className={styles.imageContainer}>
                        <img
                          className={styles.image}
                          src={item?.url}
                          alt={`myimg ${index + 1}`}
                        />
                        {/* <RemoveIcon className={styles.removeIcon} onClick={() => DeleteGalaryHandler(item?.id)}/> */}
                        <button
                          type="button"
                          disabled={deleteGalaryMutation.isPending}
                        >
                          <img
                            src={removeGreen}
                            alt="removeGreen"
                            className={styles.removeIcon}
                            onClick={() => DeleteGalaryHandler([item.id])}
                          />
                        </button>
                      </div>
                    ))}
                </div>

                <br />
              </section>

              <section className={styles.section}>
                <section className="space-between">
                  <p className={styles.addPhoto}>Add Videos</p>
                  <Button
                    variant="white"
                    type="button"
                    text="Upload Videos"
                    className={styles.buttonStyle}
                    icon={<img src={fileIcon} alt="fileIcon" />}
                    onClick={handleUploadClick}
                    isLoading={UploadGalleryMutation?.isPending}
                  />
                  <input
                    id="uploadInput"
                    type="file"
                    accept="video/*" // Allow images and videos
                    style={{ display: "none" }} // Hide the file input
                    onChange={handleFileChange} // Handle file selection
                  />
                </section>
                <br />
                {/* Filter and display only videos */}
                <div className={styles.imageRow}>
                  {businessDetailsData?.gallery
                    ?.filter((item: gallery) => isVideo(item?.url)) // Filter only videos
                    ?.map((item: gallery, index: number) => (
                      <div key={index} className={styles.imageContainer}>
                        <video
                          className={styles.image}
                          src={item?.url}
                          controls
                        />
                        <button
                          type="button"
                          disabled={deleteGalaryMutation.isPending}
                        >
                          {
                            <img
                              src={removeGreen}
                              alt="removeGreen"
                              className={styles.removeIcon}
                              onClick={() => DeleteGalaryHandler(item.id)}
                            />
                          }
                        </button>
                      </div>
                    ))}
                </div>
                <br />
              </section>

              <section className={styles.buttonGroup}>
                <Button
                  variant="white"
                  type="button"
                  text=" Previous"
                  // className={styles.buttonStyle}
                  onClick={onPrev}
                />
                <Button
                  variant="green"
                  type="button"
                  text="Save Changes"
                  onClick={() => {
                    setOpenEditBusinessSuccess(true);
                  }}
                  // className={styles.buttonStyle}
                />
              </section>
            </div>
          </Form>
        )}
      </Formik>

      <ModalContent
        open={openEditBusinessSuccess}
        handleCancel={() => setOpenEditBusinessSuccess(false)}
        handleClick={() => {
            setOpenEditBusinessSuccess(false);
        }}
        heading={"Business Added Successfully."}
        text="We’ve received your details and once we verify it, you will be able to edit your business details. We will contact you via email."
      />

      <ModalContent
        open={openSuccess}
        handleCancel={() => setOpenSuccess(false)}
        handleClick={() => {
          setOpenSuccess(false);
        }}
        heading={"Your photos and videos have been uploaded successfully."}
      />
    </section>
  );
};

export default AddGallery;
