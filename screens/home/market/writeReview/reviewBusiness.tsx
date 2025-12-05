import { Form, Formik, FormikValues } from "formik";
import styles from "./index.module.scss";
import { App, Image } from "antd";
import { useState } from "react";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useParams, useRouter } from "next/navigation";
import { WriteReviewApi } from "@/services/reviewServices";
import Input from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";
import { userAtom } from "@/lib/utils/store";

const WriteReviewBusinessOrDirectory = () => {
  // const [currentRating, setCurrentRating] = useState(0); // Track current rating
  const [showReviewForm, setShowReviewForm] = useState(true); // Manage review form visibility
  const [showCard, setShowCard] = useState(false); // Manage card visibility
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { notification } = App.useApp();
  const user = useAtomValue(userAtom);

  const handleSubmit = () => {
    setShowReviewForm(false); // Hide the review form
    setShowCard(true); // Show the card
  };

  const handleModalOkay = () => {
    router.back();
    window.scrollTo(0, 0);
  };

  const WriteReviewMutation = useMutation({
    mutationFn: WriteReviewApi,
    mutationKey: ["write-review"],
  });

  const WriteReviewHandler = async (
    values: FormikValues,
    resetForm: () => void
  ) => {
    const payload = {
      review: values?.review,
      rating: values.rating, // Use Formik rating
      user_id: user?.id,
      business_id: id,
    };

    try {
      await WriteReviewMutation.mutateAsync(payload, {
        onSuccess: () => {
          resetForm();
          handleSubmit();
        },
      });
    } catch (error: any) {
      notification.error({
        title: "Error",
        description: "An error occurred",
      });
    }
  };

  const validationSchema = Yup.object().shape({
    review: Yup.string().required("Review is required"),
    rating: Yup.number()
      .min(1, "Please select at least one star")
      .required("Rating is required"),
  });

  return (
    <div className="wrapper">
      <div className={styles.RewiwvWrapper}>
        <div>
          {/* Back button */}
          <div onClick={() => router.back()} className={styles.back}>
            <Image width={9} src="/back.svg" alt="BackIcon" preview={false} />
            <p>Back</p>
          </div>

          {showReviewForm && (
            <Formik
              initialValues={{ review: "", rating: 0 }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                WriteReviewHandler(values, resetForm);
              }}
            >
              {({ errors,values, touched, setFieldValue }) => (
                <Form>
                  <div className={styles.cardreview}>
                    <h2 className={styles.write}>Write A Review</h2>

                    <p className={styles.adding}>
                      Add a rating. Tap on the icons to rate this seller
                    </p>

                    {/* Render stars */}
                    <div className={styles.starWrapper}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Image
                          key={star}
                          width={20}
                          src={star <= values.rating ? "/staryellow.svg" : "/Vector.svg"}
                          alt="Star"
                          preview={false}
                          onClick={() => {
                            // setCurrentRating(star);
                            setFieldValue("rating", star); // Update Formik rating field
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      ))}
                    </div>

                    {/* Display error message for rating */}
                    {errors.rating && touched.rating && (
                      <div  className='error'>{errors.rating}</div>
                    )}

                    <div className={styles.reviewInput}>
                      <Input
                        name="review"
                        placeholder="Write a review"
                        type="textarea"
                      />
                    </div>

                    <div className={styles.seeBtn}>
                      <Button
                        type="submit"
                        text={
                          WriteReviewMutation?.isPending ? "Loading..." : "Submit"
                        }
                        className="buttonStyle"
                        disabled={WriteReviewMutation?.isPending}
                      />
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          {/* Card display after form submission */}
          {showCard && (
            <div className={styles.submittedCard}>
              <div className={styles.cardContent}>
                <Image src="/Done.svg" alt="DoneIcon" preview={false} />

                <h2>Review Submitted</h2>
                <p>Your Rating and Review Has Been Submitted Successfully</p>
                <Button
                  onClick={handleModalOkay} // Show review form when "Okay" is clicked
                  text="Okay"
                  className="buttonStyle"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteReviewBusinessOrDirectory;
