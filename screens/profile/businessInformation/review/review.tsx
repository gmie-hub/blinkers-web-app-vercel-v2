import Card from "../../../../customs/card/card";
import styles from "./review.module.scss";
import Star from "../../../../assets/Vector.svg";
import StarYellow from "../../../../assets/staryellow.svg";
import { AxiosError } from "axios";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { getAllReviews, replyReview } from "../../../request";
import { formatDateOnly, getTimeFromDate } from "../../../../utils/formatTime";
import { useAtomValue } from "jotai";
import { userAtom } from "../../../../utils/store";
import Input from "../../../../customs/input/input";
import * as Yup from "yup";
import { Formik, FormikValues } from "formik";
import Button from "../../../../customs/button/button";
import CustomSpin from "../../../../customs/spin";
import { useState } from "react";
import { App } from "antd";
import { countUpTo } from "../../../../utils";

export default function Reviews() {
  const user = useAtomValue(userAtom);
  const { notification } = App.useApp();
  const queryClient = useQueryClient();
  const [activeReview, setActiveReview] = useState<number | null>(null); // Track the active review index

  const handleReviewClick = (index: number) => {
    setActiveReview((prev) => (prev === index ? null : index)); // Toggle the active review
  };


  const [getAllBusinessReviewQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-business-review"],
        // queryFn: () => getAllReviews("14"),
        queryFn: () => getAllReviews(user?.business?.id?.toString()!),

        retry: 0,
        refetchOnWindowFocus: false,
        // enabled: !!user?.business?.id,
      },
    ],
  });

  const businessReviewData =
    // mockReviewsData?.data?.data ||
     getAllBusinessReviewQuery?.data?.data?.data;
  const businessReviewError = getAllBusinessReviewQuery?.error as AxiosError;
  const businessReviewErrorMessage =
    businessReviewError?.message ||
    "An error occurred. Please try again later.";

  const validationSchema = Yup.object().shape({
    reply: Yup.string().required("required"),
  });

  const replyReviewMutation = useMutation({
    mutationFn: ({
      payload,
      id,
    }: {
      payload: ReplyReviewPayload;
      id: number;
    }) => replyReview(payload, id),
    mutationKey: ["reply-review"],
  });

  const replyReviewHandler = async (values: FormikValues, id: number) => {
    const payload: ReplyReviewPayload = {
      owner_comment: values?.reply,
    };

    try {
      await replyReviewMutation.mutateAsync(
        { payload, id },
        {
          onSuccess: (data) => {
            notification.success({
              message: "Success",
              description: data?.message || "ads rejected successfully",
            });
            queryClient.refetchQueries({
              queryKey: ["get-business-review"],
            });
            setActiveReview(null)
            // handleCloseModal()
          },
        }
      );
    } catch (error: any) {
      notification.error({
        message: "Error",
        description:
          error?.message || "An error occurred while rejecting the application",
      });
    }
  };

  return (
    <>
      {getAllBusinessReviewQuery?.isLoading ? (
        <CustomSpin />
      ) : getAllBusinessReviewQuery?.isError ? (
        <h1 className="error">{businessReviewErrorMessage}</h1>
      ) : (
        <div className={styles.wrapper}>
          {businessReviewData && businessReviewData?.length > 0 ? (
            businessReviewData?.map((item: any, index: number) => (
              <Card key={item.id || index} style={styles.card}>
                <div
                  className={styles.dateTimeWrapper}
                  style={{ cursor: "pointer" }}
                >
                  <div>
                    <span>{formatDateOnly(item?.updated_at || "")}</span>
                    <div></div>
                    <span>{getTimeFromDate(item?.updated_at || "")}</span>
                    <p>{item?.user?.name}</p>

                  </div>
                </div>
                <div className={styles.starWrapper}>
                  {countUpTo(
                    item?.rating,
                    <img width={13} src={StarYellow} alt="Star Yellow" />,
                    <img width={13} src={Star} alt="Star" />
                  )}
                </div>
                <div className={styles.flex}>
                  <div>
                  <p>{item?.review}</p>

                  {item?.owner_comment && (
                    <p>My response:  { item?.owner_comment}</p>

                  )}

                  </div>

                
                  {activeReview !== index && ( // Hide the reply button when activeReview is set
                    <Button
                      onClick={() => handleReviewClick(index)}
                      variant="green"
                      type="button"
                      disabled={false}
                      text={item?.owner_comment ? 'Edit Response' : "Reply"}
                      className={styles.buttonStyle}
                    />
                  )}
                </div>

                {activeReview === index && ( // Show input and button only for the active review
                  <Formik
                    initialValues={{
                      reply:item?.owner_comment ||  "",
                    }}
                    onSubmit={(values) =>
                      replyReviewHandler(values, item?.id!)
                    }
                    validationSchema={validationSchema}
                  >
                    {({ handleSubmit }) => (
                      <form onSubmit={handleSubmit}>
                        <Input
                          name="reply"
                          placeholder="Write a reply "
                          type="textarea"
                        />
                        <div className={styles.btnRight}>
                          <Button
                            variant="green"
                            type="submit"
                            disabled={false}
                            text="Send"
                            className="buttonStyle"
                          />
                        </div>
                      </form>
                    )}
                  </Formik>
                )}
              </Card>
            ))
          ) : (
            <p>No reviews available.</p>
          )}
          {businessReviewError && <p>{businessReviewErrorMessage}</p>}
        </div>
      )}
    </>
  );

  // return (
  //   <>    {getAllBusinessReviewQuery?.isLoading ? (
  //       <CustomSpin />
  //     ) : getAllBusinessReviewQuery?.isError ? (
  //       <h1 className="error">{businessReviewErrorMessage}</h1>
  //     ) : (

  //   <div className={styles.wrapper}>
  //     {businessReviewData && businessReviewData?.length > 0 ? (
  //       businessReviewData?.map((item: any, index: number) => (
  //         <Card key={item.id || index} style={styles.card}>
  //           <div className={styles.dateTimeWrapper}>
  //             <div>
  //               <span>{formatDateOnly(item?.updated_at || "")}</span>
  //               <div></div>
  //               <span>{getTimeFromDate(item?.updated_at || "")}</span>
  //             </div>
  //           </div>
  //           <div className={styles.starWrapper}>
  //             {countUpTo(
  //               item?.rating,
  //               <img width={13} src={StarYellow} alt="Star Yellow" />,
  //               <img width={13} src={Star} alt="Star" />
  //             )}{" "}
  //           </div>
  //           <div>{item?.review}</div>
  //           <Formik
  //             initialValues={{
  //               reply: "",
  //             }}
  //             onSubmit={() => {
  //               // createBusinessHandler(values, resetForm);
  //             }}
  //             enableReinitialize={true}
  //             validationSchema={validationSchema}
  //           >
  //               <div>
  //               <Input
  //               name="reply"
  //               placeholder="Write a reply "
  //               type="textarea"
  //             />
  //             <div className={styles.btnRight}>

  //             <Button
  //               variant="green"
  //               type="submit"
  //               disabled={false}
  //               text="Send"
  //               className='buttonStyle'
  //             />
  //             </div>

  //               </div>

  //           </Formik>
  //         </Card>
  //       ))
  //     ) : (
  //       <p>No reviews available.</p> // Display a message when there are no reviews
  //     )}
  //     {businessReviewError && <p>{businessReviewErrorMessage}</p>}{" "}
  //     {/* Display error message if any */}
  //   </div>
  //      )}
  //      </>

  // );
}

