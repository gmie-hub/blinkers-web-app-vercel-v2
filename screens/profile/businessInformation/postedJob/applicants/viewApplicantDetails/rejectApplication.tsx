import styles from './viewApplicant.module.scss';
import { App } from 'antd';
import { useState } from 'react';
import { Form, Formik, FormikValues } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../../../../../../customs/input/input';
import Button from '../../../../../../customs/button/button';
import { updateApplicationStatus } from '../../../../../request';
import ModalContent from '../../../../../../partials/successModal/modalContent';
import DeleteIcon from "../../../../../../assets/remove_11695444 2.svg";

interface Props {
  handleCloseModal: () => void;
}

const RejectApplication = ({ handleCloseModal }: Props) => {
  const [openSuccess, setOpenSuccess] = useState(false);
  const { id } = useParams();

  const { notification } = App.useApp();
  const queryClient = useQueryClient();
  const navigate =useNavigate()

  



  const rejectApplicationMutation = useMutation({
    mutationFn: ({ payload, id }: { payload: ApplicationStatusPayload; id: number }) =>
      updateApplicationStatus(payload, id),
    mutationKey: ["reject-status"],
  });
  
  const rejectApplicationHandler = async (values: FormikValues,id:number) => {

  
    const payload: ApplicationStatusPayload = {
      status: '3', 
      message:values?.reason,
    };
  
    try {
      await rejectApplicationMutation.mutateAsync(
        { payload, id },
        {
          onSuccess: (data) => {
            notification.success({
              message: "Success",
              description: data?.message || "Application rejected successfully",
            });
            queryClient.refetchQueries({
              queryKey: ["get-all-job-applicants"],
            });
            handleCloseModal()
            navigate(-1); // Go back to the previous page
          },
        }
      );
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error?.message || "An error occurred while rejecting the application",
      });
    }
  };    
  return (
    <main>
      <Formik
        initialValues={{
          reason: '',
        }}
        onSubmit={(values) => rejectApplicationHandler(values,parseInt(id!))}
      >
        <Form style={{ marginInline: '0' }}>
          <section className={styles.RejectModalWrapper}>
            {/* <Reject /> */}
            <img src={DeleteIcon} alt="" />

            <div>
              <p className={styles.RejectModalPara}> Are You Sure You Want to Reject This Application? </p>
              <p>This user would be notified. Add an additional message for the user </p>
            </div>
          </section>

          <Input name="reason" label="Message" placeholder="Type in your message" type="textarea" />

          <br />

          <div className="space-between">
            <Button
              onClick={handleCloseModal}
              type="button"
              variant="white"
              text={'No, Go Back'}
              className='buttonStyle'

            />
            <Button
              className='buttonStyle'
              variant="red"
              type="submit"
                text={
                  rejectApplicationMutation?.isPending
                    ? "loading..."
                    : "Reject Application"
                }
              isLoading={rejectApplicationMutation?.isPending}
            />
          </div>
        </Form>
      </Formik>

    
         <ModalContent
        open={openSuccess}
        handleCancel={()=>setOpenSuccess(false)}
        handleClick={()=>setOpenSuccess(false)}
        heading={"Verification Rejected Successfully"}
      />
    </main> 
  );
};
export default RejectApplication;
