import { Form, Formik, FormikValues } from "formik";
import styles from "../styles.module.scss";
import { FC, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { notification } from "antd";
import * as Yup from "yup";
import Button from "@/components/ui/button/button";
import Upload from "@/components/ui/upload/upload";
import { CoverLetterInfoAtom } from "@/lib/utils/store";

interface ComponentProps {
  handleClose: () => void;
  indexData: CoverLetter; // Allow null for new entries
  onUpload: any;
  handleSubmit: (values: FormikValues, resetForm: () => void) => void;

}

const CoverLetterPage: FC<ComponentProps> = ({
  handleClose,
  indexData,
  onUpload,
  handleSubmit
}) => {
  const [upload, setUpload] = useState<File | null>(null);
  
  const [coverLetterData] = useAtom(CoverLetterInfoAtom);
  const setCoverLetterData = useSetAtom(CoverLetterInfoAtom);

  const clearFile = () => {
    setUpload(null);
  };

  console.log(upload, coverLetterData?.UploadCoverLetter, ".mupdjdj");
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: Function
  ) => {
    if (!e.target?.files) return;
    const selectedFile = e.target?.files[0];

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
    ];
    if (!validImageTypes.includes(selectedFile.type)) {
      notification.error({
        message: "Invalid File Type",
        description: "Please upload a valid image (JPEG, PNG, GIF,SVG).",
      });
      return;
    }
    setUpload(selectedFile);
    setFieldValue("UploadCoverLetter", selectedFile); // Set the file in Formik
    onUpload(selectedFile);
  };

  const validationSchema = Yup.object().shape({
    UploadCoverLetter: Yup.mixed().required("Cover letter is required"),
  });

  return (
    <section>
      <Formik
        initialValues={{
          // CoverLetter: coverLetterData?.CoverLetter || "", // Existing cover letter or empty
          UploadCoverLetter: indexData?.UploadCoverLetter || '',
        }}
        enableReinitialize={true}
        onSubmit={async (values,{resetForm}) => {
          const updatedData = {
            ...coverLetterData,
            UploadCoverLetter: values.UploadCoverLetter, // Use base64 or existing data
          };

          setCoverLetterData(updatedData);
          handleSubmit(values, resetForm);
          resetForm();


          handleClose(); 
          resetForm();

        }}
        validationSchema={validationSchema}
      >
        {({ setFieldValue }) => (
          <Form>
            <div className={styles.inputContainer}>
              <div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <img src={'/folder.svg'} alt="Folder" />
                  <p className="label">Upload Cover Letter (Optional)</p>
                </div>
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
                    name="UploadCoverLetter"
                    onChange={(e) => handleFileChange(e, setFieldValue)}
                  />
                )}
              </div>

          

              <div className={styles.buttonGroup}>
                <Button
                  variant="white"
                  type="button"
                  text="Cancel"
                  className={styles.btn}
                  onClick={handleClose}
                />
                <Button
                  variant="green"
                  type="submit"
                  text="Save"
                  className={styles.btn}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default CoverLetterPage;
