import { FC, useState } from "react";
import { App, GetProp, Upload, UploadFile, UploadProps, Image } from "antd";
import { Form, Formik, FormikValues } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./styles.module.scss";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../../../utils/apiClient";
import Button from "../../../../customs/button/button";
import Input from "../../../../customs/input/input";
import { useAtomValue } from "jotai";
import { basicInfoAtom, userAtom } from "../../../../utils/store";
import { errorMessage } from "../../../../utils/errorMessage";
import OpeningHoursForm from "./businessHour";

interface ComponentProps {
  onPrev: () => void;
  handleNext: () => void;
  businessDetailsData?: AllBusinessesDatum;
}

const SocialsCoverPhotoForm: FC<ComponentProps> = ({
  onPrev,
  handleNext,
  businessDetailsData,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const basicInfoData = useAtomValue(basicInfoAtom);
  const { notification } = App.useApp();
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);

  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };




  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const editBusiness = async (payload: FormData) => {
    return (
      await api.post(`/businesses/${user?.business?.id || 0}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    )?.data;
  };

  const createBusinessMutation = useMutation({
    mutationFn: editBusiness,
  });

  const createBusinessHandler = async (values: FormikValues) => {
    const formData = new FormData();
    formData.append("name", basicInfoData?.businessName);
    formData.append("category_id", basicInfoData?.category);
    formData.append("address", basicInfoData?.businessAddress);
    formData.append("phone", basicInfoData?.phoneNumber);
    formData.append("email", basicInfoData?.email);
    formData.append("website", basicInfoData?.website);
    formData.append("about", basicInfoData?.aboutBusiness);
    formData.append("facebook", values?.facebook);
    formData.append("instagram", values?.instagram);
    formData.append("whatsapp", values?.whatsapp);
    formData.append("_method", "patch");

    if (fileList[0]?.originFileObj) {
      formData.append("logo", fileList[0]?.originFileObj);
    }

    try {
      await createBusinessMutation.mutateAsync(formData, {
        onSuccess: (data) => {
          notification.success({
            message: "Success",
            description: data?.message,
          });
          queryClient.refetchQueries({ queryKey: ["get-business-details"] });
          handleNext();
        },
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description:errorMessage(error) || "An error occurred",
      });
      
    }
  };


  const [initialValues] = useState({
   
    facebook: businessDetailsData?.facebook ?? "",
    instagram: businessDetailsData?.instagram ?? "",
    whatsapp: businessDetailsData?.whatsapp ?? "",
  });


 
  // const validationSchema = Yup.object().shape({
  //   instagram: Yup.string()
  //     .required("required")
  //     .url('Please enter a valid URL'),
  //   facebook: Yup.string()
  //     .required("required")
  //     .url('Please enter a valid URL'),
  // });

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          createBusinessHandler(values);
        }}
        // validationSchema={validationSchema}
      >
        {() => {
          return (
            <Form>
              <div className={styles.inputContainer}>
                <div className={styles.head}>
                  {fileList?.length < 1 && (
                    <Image
                      width={100}
                      height={100}
                      src={businessDetailsData?.logo}
                      alt="Creative Icon"
                      preview={false}
                    />
                  )}

                  <Image
                    wrapperStyle={{ display: "none" }}
                    preview={{
                      visible: previewOpen,
                      onVisibleChange: (visible) => setPreviewOpen(visible),
                      afterOpenChange: (visible) =>
                        !visible && setPreviewImage(""),
                    }}
                    src={previewImage}
                  />

                  <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                  >
                    {fileList.length >= 8 ? null : uploadButton}
                  </Upload>

                  {previewImage && (
                    <Image
                      wrapperStyle={{ display: "none" }}
                      preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                          !visible && setPreviewImage(""),
                      }}
                      src={previewImage}
                    />
                  )}
                </div>

            <OpeningHoursForm businessDetailsData={businessDetailsData}/>
                <br />

                <section className={styles.secondRow}>
                  <p>Add Social Media Link</p>
                  <hr />
                  <Input
                    label="Facebook"
                    placeholder="Add Facebook link"
                    name="facebook"
                  />
                  <Input
                    label="Instagram"
                    placeholder="Add Instagram link"
                    name="instagram"
                  />
                  <Input
                    label="Whatsapp"
                    placeholder="Add Whatsapp link"
                    name="whatsapp"
                  />
                </section>
                <br />

                <section className={styles.buttonGroup}>
                  <Button
                    variant="white"
                    type="button"
                    disabled={false}
                    text="Previous"
                    className={styles.buttonStyle}
                    onClick={onPrev}
                  />

                  <Button
                    variant="green"
                    type="submit"
                    disabled={false}
                    text="Continue"
                    className={styles.buttonStyle}
                    isLoading={createBusinessMutation?.isPending}
                    // onClick={handleNext}
                  />
                </section>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default SocialsCoverPhotoForm;
