import styles from "./styles.module.scss";
import Card from "../../../../customs/card/card";
import RouteIndicator from "../../../../customs/routeIndicator";
import { Form, Formik, FormikValues } from "formik";
import Button from "../../../../customs/button/button";
import Input from "../../../../customs/input/input";
import { useState } from "react";
import Upload from "../../../../customs/upload/upload";
import ModalContent from "../../../../partials/successModal/modalContent";
import { createBusiness, getAllCategory } from "../../../request";
import { useMutation, useQuery } from "@tanstack/react-query";
import { App } from "antd";
import SearchableSelect from "../../../../customs/searchableSelect/searchableSelect";
import * as Yup from "yup";
import { errorMessage } from "../../../../utils/errorMessage";
import CameraIcon from "../../../../assets/camera.svg";
import Profile from "../../../../assets/Avatarprofile.svg";
import { useAtom } from "jotai";
import { userAtom } from "../../../../utils/store";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../../routes";

const AddBusiness = () => {
  const [upload, setUpload] = useState<File | null>(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const { notification } = App.useApp();
  const [searchValue, setSearchValue] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null); // For preview
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [user] = useAtom(userAtom);
  const navigate = useNavigate()

  
  const handleFileBusinessChange = (
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
    ];

    // Validate if the file type is valid
    if (!validFileTypes.includes(selectedFile.type)) {
      notification.error({
        message: "Invalid File Type",
        description:
          "The logo field must be a file of type: jpg, jpeg, png, gif, docx, doc, ppt.",
      });
      return;
    }
    setFieldValue("profile_image", selectedFile);
    setProfileImage(selectedFile);
    setPreviewImage(URL.createObjectURL(selectedFile)); // Generate preview URL
  };

  const handleSearchChange = (value: string) => {
    console.log("Search Query:", value); // Access the search query value here
    setSearchValue(value);
  };

  const clearFile = () => {
    setUpload(null);
  };
  const handleNavigateToDir = ()=>{
    setOpenSuccess(false)
    navigate(routes.directory.directory)
    
  }

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
      "application/pdf" // pdf
    ];

    // Validate if the file type is valid
    if (!validFileTypes.includes(selectedFile.type)) {
      notification.error({
        message: "Invalid File Type",
        description:
          "The logo field must be a file of type: jpg, jpeg, png, gif, docx, doc, ppt.",
      });
      return;
    }
    setFieldValue("imageLogo", selectedFile);
    setUpload(selectedFile);
  };

  const createBusinessMutation = useMutation({
    mutationFn: createBusiness,
  });

  const createBusinessHandler = async (
    values: FormikValues,
    resetForm: () => void
  ) => {

    const formData = new FormData();

    formData.append("user_id", user?.id?.toString() || '');

    formData.append("name", values?.BusinessName);
    formData.append("address", values?.BusinessAddress);
    if (upload) {
      formData.append("doc", upload);
    }
    if (profileImage) {
      formData.append("logo", profileImage);
    }
    formData.append("email", values?.email);
    formData.append("category_id", values?.category);
    formData.append("about", values?.aboutBusiness);

    // formData.append("phone", basicInfoData?.phoneNumber);
    // formData.append("website", basicInfoData?.website);
    // formData.append("about", basicInfoData?.aboutBusiness);
    // formData.append("facebook", values.facebook);
    // formData.append("instagram", values.instagram);

    try {
      await createBusinessMutation.mutateAsync(formData, {
        onSuccess: () => {
          // notification.success({
          //   message: 'Success',
          //   description: data?.message,
          // });
          resetForm();
          clearFile();
          setOpenSuccess(true);

        },
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: errorMessage(error) || "An error occurred",
      });
    }
  };

  const { data } = useQuery({
    queryKey: ["get-all-category", searchValue],
    queryFn: () => getAllCategory(searchValue),
  });

  const categoryData = data?.data?.data ?? [];

  const categoryOptions: { value: number; label: string }[] = [
    { value: 0, label: "Select Business" }, // Default option
    ...(categoryData && categoryData?.length > 0
      ? categoryData?.map((item: CategoryDatum) => ({
          value: item?.id,
          label: item?.title,
        }))
      : []),
  ];

  const validationSchema = Yup.object().shape({
    BusinessName: Yup.string().required("required"),
    BusinessAddress: Yup.string().required("required"),
    email: Yup.string().required("required"),
    imageLogo: Yup.string().required("required"),
    category: Yup.string().required("required"),
  });

  return (
    <div className="wrapper">
      <RouteIndicator showBack={true} />

      <div className={styles.wrapper}>
        <Card style={styles.card}>
          <section className={styles.textContainer}>
            <div>
              <p>Add Business To Directory</p>
              <p>
                Fill in the details to add your business to the directory. After
                verification, you can now edit, post jobs and update your
                business information.
              </p>
            </div>
          </section>

          <section>
            <Formik
              initialValues={{
                BusinessName: "",
                BusinessAddress: "",
                aboutBusiness: "",
                email: "",
                imageLogo: "",
                category: "",
              }}
              onSubmit={(values, { resetForm }) => {
                createBusinessHandler(values, resetForm);
              }}
              enableReinitialize={true}
              validationSchema={validationSchema}
            >
              {({ setFieldValue }) => {
                return (
                  <Form>
                    <div className={styles.abs}>

                      <img
                        src={
                          previewImage
                            ? previewImage
                            :  Profile
                        }
                        alt="profile"
                        className={styles.profile}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          document.getElementById("fileInput")?.click()
                        }
                      />
                      <img
                        src={CameraIcon}
                        alt="Camera"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          document.getElementById("fileInput")?.click()
                        }
                      />
                    </div>
                    <input
                      name="profile_image"
                      type="file"
                      id="fileInput"
                      style={{ display: "none" }}
                      onChange={(e) => handleFileBusinessChange(e, setFieldValue)}
                    />

                    <div className={styles.inputContainer}>
                      <Input
                        name="BusinessName"
                        label="Business Name"
                        placeholder="Business Name"
                        type="text"
                      />

                      <SearchableSelect
                        name="category"
                        label="Category"
                        options={categoryOptions}
                        placeholder="Select Company Name"
                        onSearchChange={handleSearchChange}
                      />

                      <Input
                        name="BusinessAddress"
                        label="Business Address"
                        placeholder="Business Address"
                        type="text"
                      />
                      <Input
                        name="email"
                        label="Business Email Address"
                        placeholder="Business Email Address"
                        type="text"
                      />
                      <Input
                        name="aboutBusiness"
                        label="About Business"
                        placeholder="About Business"
                        type="textarea"
                      />
                      <div>
                        <p>
                          Upload a document to prove that you’re the owner of
                          this business (CAC)
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
                            name="imageLogo"
                            // label="Upload CV"
                            onChange={(e) => handleFileChange(e, setFieldValue)}
                          />
                        )}
                      </div>

                      <div className={styles.buttonGroup}>
                        <Button
                          variant="green"
                          type="submit"
                          disabled={false}
                          text={createBusinessMutation?.isPending ? 'loading...' : "Submit Form" }
                          className={styles.btn}
                        />
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </section>
        </Card>

        <ModalContent
          open={openSuccess}
          handleCancel={() => setOpenSuccess(false)}
          handleClick={handleNavigateToDir}
          heading={"Business Added Successfully"}
          text="We’ve received your details and once we verify it, you will be able to post jobs. We will contact you via email."
        />
      </div>
    </div>
  );
};

export default AddBusiness;
