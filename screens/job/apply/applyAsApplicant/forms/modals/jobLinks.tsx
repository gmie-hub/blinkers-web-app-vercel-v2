import { Form, Formik, FormikValues } from "formik";
import styles from "../styles.module.scss";
import { FC } from "react";
import * as Yup from "yup";
import { useSetAtom } from "jotai";
import Input from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";
import { LinkInfoAtom } from "@/lib/utils/store";

interface ComponentProps {
  handleClose: () => void;
  indexData: LinkData;
  handleSubmit: (values: FormikValues, data: Payload) => void;
  index:number
}

const JobLinks: FC<ComponentProps> = ({
  indexData,
  handleClose,
  handleSubmit,
  index,
}) => {
  const linkAtomdata = useSetAtom(LinkInfoAtom);

  const validationSchema = Yup.object({
    type: Yup.string().required("Title is required"),
    url: Yup.string().required("Link is required").url("Invalid URL format"),
  });

  return (
    <section>
      <Formik
        initialValues={{
          id: indexData?.id || 0,
          type: indexData?.type || "",
          url: indexData?.url || "",
        }}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          const currentLinkInfo = JSON.parse(
            localStorage.getItem("link-data") ?? "[]"
          );
          let updatedLinkInfo: LinkData[];
          if (indexData) {
            updatedLinkInfo = currentLinkInfo?.map((item: LinkData,currIndex: number) =>
              currIndex === index ? { ...item, ...values } : item
            );
            linkAtomdata(updatedLinkInfo);
          } else {
            const newData = {
              ...values,
              id: currentLinkInfo.length + 1,
            };
            updatedLinkInfo = [...currentLinkInfo, newData];
            linkAtomdata(updatedLinkInfo);
          } 

          // handleSubmit(values, resetForm);
          handleSubmit(values, { jobLink: updatedLinkInfo });

          resetForm();

          handleClose();
          resetForm();
        }}
        validationSchema={validationSchema}
      >
        {() => {
          return (
            <Form>
              <div className={styles.inputContainer}>
                <Input
                  name="type"
                  label="Title"
                  placeholder="Title"
                  type="text"
                />
                <Input name="url" label="Link" placeholder="Link" type="text" />

                <section className={styles.buttonGroup}>
                  <Button
                    variant="white"
                    type="button"
                    disabled={false}
                    text="Cancel"
                    className={styles.btn}
                    onClick={handleClose}
                  />
                  <Button
                    variant="green"
                    type="submit"
                    disabled={false}
                    text="Save"
                    className={styles.btn}
                  />
                </section>
              </div>
            </Form>
          );
        }}
      </Formik>
    </section>
  );
};

export default JobLinks;
