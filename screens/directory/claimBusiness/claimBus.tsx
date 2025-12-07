import styles from "./claimBus.module.scss";
import { useState } from "react";
import { App, Image } from "antd";
import RelatedBusinesses from "../relatedBusinesses/relatedBusiness";
import { Form, FormikProvider, FormikValues, useFormik } from "formik";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import * as Yup from "yup";
import { AxiosError } from "axios";
import { userAtom } from "@/lib/utils/store";
import { useParams, useRouter } from "next/navigation";
import { ClaimBusinessApi, getBusinessById } from "@/services/businessServices";
import { errorMessage } from "@/lib/utils/errorMessage";
import CustomSpin from "@/components/ui/spin";
import RouteIndicator from "@/components/ui/routeIndicator";
import { countUpTo } from "@/lib/utils";
import Upload from "@/components/ui/upload/upload";
import Input from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";

const ClaimBusiness = () => {
  const [showContent, setShowContent] = useState(true); // Manage review form visibility
  const [showCard, setShowCard] = useState(false); // Manage card visibility
  const [upload, setUpload] = useState<File | null>(null);
  const { notification } = App.useApp();
  const user = useAtomValue(userAtom);

  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  //   const hasReviews = reviewData?.length;
  //   console.log(hasReviews , "hasReviews")

  const handleClaim = () => {
    setShowContent(false); // Hide the review form
    setShowCard(true); // Show the card
    window.scrollTo(0, 0);
  };

  const handleNavigateToRelatedBusiness = () => {
    router.push(`/related-businesses/${id}`);
    window.scrollTo(0, 0);
  };

  const handleNavigateToSubPlan = () => {
    router.push(`/claimed-business`);
    window.scrollTo(0, 0);
  };

  const createBusinessMutation = useMutation({
    mutationFn: ClaimBusinessApi,
  });

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
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
      "application/msword", // doc
      "application/vnd.ms-powerpoint", // ppt
      "application/pdf", // PDF
    ];

    // Validate if the file type is valid
    if (!validFileTypes.includes(selectedFile.type)) {
      notification.error({
        message: "Invalid File Type",
        title: "",
        description:
          "The logo field must be a file of type: jpg, jpeg, png, gif, docx, doc, ppt.",
      });
      return;
    }
    setFieldValue("imageFile", selectedFile);
    setUpload(selectedFile);
  };

  const clearFile = () => {
    setUpload(null);
  };
  const claimBusinessHandler = async (
    values: FormikValues,
    resetForm: () => void
  ) => {
    const formData = new FormData();
    const user_id = user?.id;
    // const business_id = user?.a
    if (user_id) {
      formData.append("user_id", user_id?.toString());
    }
    if (id) {
      formData.append("business_id", id?.toString());
    }
    if (upload) {
      formData.append("doc", upload);
    }
    formData.append("message", values?.message);

    try {
      await createBusinessMutation.mutateAsync(formData, {
        onSuccess: () => {
          // notification.success({
          //   message: 'Success',
          //   description: data?.message,
          // });
          resetForm();
          clearFile();
          handleClaim();
        },
      });
    } catch (error) {
      notification.error({
        message: "Error",
        title: "",
        description: errorMessage(error) || "An error occurred",
      });
    }
  };

  const validationSchema = Yup.object().shape({
    message: Yup.string().required("required"),
  });

  const formik = useFormik({
    initialValues: {
      message: "",
      imageFile: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      claimBusinessHandler(values, resetForm);
    },
  });

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

  return (
    <>
      {getBusinessDetailsQuery?.isLoading ? (
        <CustomSpin />
      ) : getBusinessDetailsQuery?.isError ? (
        <h1 className="error">{businessDetailsErrorMessage}</h1>
      ) : (
        <div className={styles.wrapper}>
          <RouteIndicator showBack />
          {showContent && (
            <div className={styles.claimWrapper}>
              <div className={styles.top}>
                <h1>Claim This Business</h1>
                <p>
                  To claim this business, you have to verify that you are the
                  owner of the business
                </p>
              </div>

              <div className={styles.mainContainer}>
                <div className={styles.leftSection}>
                  <div className={styles.card}>
                    {/* <div> */}
                    <img
                      className={styles.imageSize}
                      src={businessDetailsData?.logo}
                      alt="ProductIcon"
                    />

                    <div className={styles.justifyCenter}>
                      <p className={styles.name}>
                        {" "}
                        {businessDetailsData?.name}
                      </p>
                      <p className={styles.subjectBg}>
                        {" "}
                        {businessDetailsData?.category?.title}{" "}
                      </p>

                      <div className={styles.starWrapper}>
                        {countUpTo(
                          businessDetailsData?.average_rating || 0,
                          <Image
                            width={20}
                            src="/Vector.svg"
                            alt="star"
                            preview={false}
                          />,
                          <Image
                            width={20}
                            src="/Vector.svg"
                            alt="Star"
                            preview={false}
                          />
                        )}{" "}
                      </div>
                      {businessDetailsData?.total_rating === 0 ? (
                        <p style={{ paddingBlockEnd: "1.4rem" }}>
                          No reviews yet
                        </p>
                      ) : (
                        <p style={{ paddingBlockEnd: "1.4rem" }}>
                          {businessDetailsData?.average_rating} (
                          {businessDetailsData?.total_rating}{" "}
                          {businessDetailsData?.total_rating &&
                          businessDetailsData?.total_rating < 2
                            ? "Rating"
                            : "Ratings"}
                          )
                        </p>
                      )}
                      <p style={{ paddingBlockEnd: "0.4rem" }}>
                        {businessDetailsData?.total_followers}

                        {businessDetailsData?.total_followers &&
                        businessDetailsData?.total_followers > 1
                          ? " Followers"
                          : " Follower"}
                      </p>
                    </div>
                    <p style={{ paddingBlock: "0.2rem" }}>
                      Number of Ads Posted:{" "}
                      <span> {businessDetailsData?.total_ads}</span>{" "}
                    </p>
                    {/* </div> */}

                    <div>
                      <div className={styles.info}>
                        <img src="/time42.svg" alt="TimeIcon" />

                        <div className={styles.open}>
                          <p>Opening Hours</p>
                          <p>Monday - Fridays (10am- 11pm)</p>
                        </div>
                      </div>
                      <div className={styles.info}>
                        <img src="/locationnot.svg" alt="LocationIcon" />
                        <p>{businessDetailsData?.address}</p>
                      </div>
                      <div className={styles.info}>
                        <img src="/callclaim.svg" alt="CallIcon" />

                        <p>{businessDetailsData?.phone || "N/A"}</p>
                      </div>
                    </div>

                    <div className={styles.social}>
                      <Image
                        style={{ cursor: "pointer" }}
                        src="/whatsapp.svg"
                        alt="WhatsappLogo"
                        preview={false}
                        onClick={() => {
                          if (businessDetailsData?.whatsapp) {
                            window.open(businessDetailsData.whatsapp, "_blank");
                          }
                        }}
                      />
                      <Image
                        style={{ cursor: "pointer" }}
                        //   width={40}
                        height={35}
                        src="/fbIcon.svg"
                        alt="FaceBookStoreIcon"
                        preview={false}
                        onClick={() => {
                          if (businessDetailsData?.facebook) {
                            window.open(businessDetailsData.facebook, "_blank");
                          }
                        }}
                      />
                      <Image
                        style={{ cursor: "pointer" }}
                        src="/instagram.svg"
                        alt="InstagramIcon"
                        preview={false}
                        onClick={() => {
                          if (businessDetailsData?.instagram) {
                            window.open(
                              businessDetailsData.instagram,
                              "_blank"
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.rightSection}>
                  <FormikProvider value={formik}>
                    <Form onSubmit={formik.handleSubmit}>
                      <div className={styles.info}>
                        <Image src="/Ehead.svg" alt="HeadIcon" preview={false} />

                        <div className={styles.open}>
                          <p>{user?.name}</p>
                          <p>{user?.email}</p>
                        </div>
                      </div>

                      <div className={styles.inputContainer}>
                        <div>
                          <p>
                            Upload a document to prove that you’re the owner of
                            this business (CAC, Business letterhead etc.)
                          </p>
                          <br />

                          {upload ? (
                            <div
                              style={{
                                display: "flex",
                                gap: "2rem",
                                justifyContent: "space-between",
                              }}
                            >
                              <p>{upload.name}</p>

                              <span onClick={clearFile}>X</span>
                            </div>
                          ) : (
                            <Upload
                              name="imageFile"
                              // label="Upload a document to prove that you’re the owner of this business (CAC, Business letterhead etc.)"
                              onChange={(e) =>
                                handleFileChange(e, formik?.setFieldValue)
                              }
                            />
                          )}
                        </div>

                        <div className={styles.inputCon}>
                          <Input
                            name="message"
                            placeholder="Write a message"
                            type="textarea"
                            label="Additional Message (Optional)"
                          />
                        </div>
                      </div>

                      <Button
                        disabled={createBusinessMutation?.isPending}
                        type="submit"
                        text={
                          createBusinessMutation?.isPending
                            ? "Loading..."
                            : "Submit Form"
                        }
                      />
                    </Form>
                  </FormikProvider>
                </div>
              </div>

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
                      src="/arrow-right-green.svg"
                      alt="ArrowIcon"
                      preview={false}
                    />
                  </div>
                </div>

                <RelatedBusinesses showHeading={false} limit={4} />
              </div>
            </div>
          )}

          {showCard && (
            <div className={styles.submittedCard}>
              <div className={styles.cardContent}>
                <Image src="/Done.svg" alt="done" preview={false} />

                <h2>Details Submitted Successfully</h2>
                <p>
                  We’ve received your details and once we verify it, you will be
                  able to edit your business details in your profile. We will
                  contact you via email.
                </p>
                <Button text="Okay" onClick={handleNavigateToSubPlan} />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default ClaimBusiness;
