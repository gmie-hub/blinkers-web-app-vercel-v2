import { Form, Formik, FormikValues } from "formik";
import styles from "./index.module.scss";
import { App, Image, Modal } from "antd";
import { useState } from "react";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import GeneralWelcome from "../marketLogin/marketLogin";
import { userAtom } from "@/lib/utils/store";
import { WriteSellerReviewApi } from "@/services/reviewServices";
import { errorMessage } from "@/lib/utils/errorMessage";
import Input from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";

interface Props{
  id?:number
}
const WriteReviewAds = ({id}:Props) => {
  // const [currentRating, setCurrentRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(true);
  const [showCard, setShowCard] = useState(false);
  const { notification } = App.useApp();
  const user = useAtomValue(userAtom);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  const handleSubmit = () => {
    setShowReviewForm(false);
    setShowCard(true);
  };


  const WriteReviewMutation = useMutation({
    mutationFn: WriteSellerReviewApi,
    mutationKey: ["write-review"],
  });

  const WriteReviewHandler = async (
    values: FormikValues,
    resetForm: () => void
  ) => {
    const payload = {
      to_user_id: id,
      from_user_id: user?.id,
      rating: values.rating, // Use Formik's value
      review: values.review,
    };

    try {
      await WriteReviewMutation.mutateAsync(payload, {
        onSuccess: () => {
          resetForm();
          handleSubmit();
        },
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: errorMessage(error) || "An error occurred",
      });
    }
  };

  const validationSchema = Yup.object().shape({
    review: Yup.string().required("Review is required"),
    rating: Yup.number()
      .min(1, "Rating is required")
      .required("Rating is required"),
  });

  return (
    <div >
      <div className={styles.RewiwvWrapper}>
        <div>
          {/* <div onClick={() => navigate(-1)} className={styles.back}>
            <Image width={9} src="/back.svg" alt="BackIcon" preview={false} />
            <p>Back</p>
          </div> */}

          {showReviewForm && (
            <Formik
              initialValues={{ review: "", rating: 0 }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                if (!user) {
                  setOpenLoginModal(true)
                }else{
                WriteReviewHandler(values, resetForm);}
              }}
            >
              {({ errors, touched, setFieldValue, values }) => (
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
                            setFieldValue("rating", star); // Update Formik field value
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      ))}
                    </div>
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
                  onClick={()=>setShowCard(false)}
                  text="Okay"
                  className="buttonStyle"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={openLoginModal}
        onCancel={() => setOpenLoginModal(false)}
        centered
        footer={null}
      >
        <GeneralWelcome
          handleCloseModal={() => setOpenLoginModal(false)}
        />
      </Modal>
    </div>
  );
};

export default WriteReviewAds;
