import { Form, Formik, FormikValues } from "formik";
import styles from "./flagJob.module.scss";
import * as Yup from "yup";
import { useState } from "react";
import { App } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import ReusableModal from "@/components/partials/deleteModal/deleteModal";
import Input from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";
import ModalContent from "@/components/partials/successModal/modalContent";
import { FlagJobApi } from "@/services/jobServices";
import { errorMessage } from "@/lib/utils/errorMessage";
import { useSearchParams } from "next/navigation";
import { userAtom } from "@/lib/utils/store";

interface Props {
  handleCloseModal: () => void;
}

const FlagJobs = ({ handleCloseModal }: Props) => {
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isDeleteSuccessful, setIsDeleteSuccessful] = useState(false);
  const { notification } = App.useApp();
  const user = useAtomValue(userAtom);
  const queryClient = useQueryClient();
  const id = useSearchParams().get("id");

  const validationSchema = Yup.object().shape({
    reasonForFlag: Yup.string().required("Required"),
  });

  const flagJobMutation = useMutation({
    mutationFn: FlagJobApi,
    mutationKey: ["flag-job"],
  });

  const flagJobHandler = async (values: FormikValues) => {
    const payload: Partial<FlagJob> = {
      job_id: id!,
      applicant_id: user?.applicant?.id || user?.applicantId ,
      action: "flag",
      reason: values.reasonForFlag,
    };

    try {
      await flagJobMutation.mutateAsync(payload, {
        onSuccess: () => {
          // notification.success({
          //   message: "Success",
          //   description: data?.message,
          // });
          queryClient.refetchQueries({
            queryKey: ["get-flagged-job-by-userId"],
          });
          setIsDeleteSuccessful(true);
        },
      });
    } catch (error: any) {
      notification.error({
        title: "Error",
        description: errorMessage(error) || "An error occurred",
      });
      
    }
    handleCloseModal();
  };

  const handleFlag = () => {
    setIsDeleteModal(true);
  };

  const handleDelete = () => {
    setIsDeleteModal(false);
  };


  return (
    <div>
      <section>
        <Formik
          initialValues={{
            reasonForFlag: "",
          }}
          onSubmit={() => {
            handleFlag(); // Pass values to handleFlag
          }}
          validationSchema={validationSchema}
        >
          {({ values }) => (
            <Form>
              <div className={styles.inputContainer}>
                <Input
                  name="reasonForFlag"
                  placeholder="Add Reason For Flag"
                  label="Reason For Flag"
                  type="textarea"
                />
                <section className={styles.buttonGroup}>
                  <Button
                    onClick={handleCloseModal}
                    variant="white"
                    type="button"
                    disabled={false}
                    text="Cancel"
                    className={styles.btn}
                  />
                  <Button
                    variant="red"
                    type="submit"
                    text={"submit"}
                    className={styles.btn}
                    // onClick={handleCloseModal}
                  />
                </section>
              </div>

              <ReusableModal
                open={isDeleteModal}
                handleCancel={() => setIsDeleteModal(false)}
                title="Are You Sure You Want To Flag This Job?"
                confirmText={
                  flagJobMutation?.isPending ? "loading..." : "Yes, Submit"
                }
                cancelText="No, Go Back"
                handleConfirm={async () => {
                  await flagJobHandler(values); // Pass current form values directly
                  handleDelete();
                }}
                icon={<img src='/del.svg' alt="DeleteIcon" />}
                disabled={flagJobMutation?.isPending}
              />
            </Form>
          )}
        </Formik>
      </section>

      <ModalContent
        open={isDeleteSuccessful}
        handleCancel={() => setIsDeleteSuccessful(false)}
        handleClick={() => {
          setIsDeleteSuccessful(false);
        }}
        heading="Job Flagged Successfully"
      />
    </div>
  );
};

export default FlagJobs;
