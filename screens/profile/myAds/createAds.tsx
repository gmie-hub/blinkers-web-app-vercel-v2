import { Field, Form, Formik, FormikValues } from "formik";
import styles from "./editAds.module.scss";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import Input from "../../../customs/input/input";
import SearchableSelect from "../../../customs/searchableSelect/searchableSelect";
import Button from "../../../customs/button/button";
import { useNavigate } from "react-router-dom";
import {
  createAds,
  //   deleteAdsGalarybyId,
  getAllCategory,
  getAllState,
  getAllSubscriptionbyId,
  getApplicantsbyId,
  getLGAbyStateId,
  getSpecSubCategory,
  getSubCategory,
  //   uploadAdsGallery,
  //   uploadAdsVideo,
} from "../../request";
import { useRef, useState } from "react";
import Checkbox from "../../../customs/checkBox/checkbox";
import Upload from "../../../customs/upload/upload";
import { App } from "antd";
import { errorMessage } from "../../../utils/errorMessage";

import * as Yup from "yup";
import { useAtomValue } from "jotai";
import { userAtom } from "../../../utils/store";
import { LimitNotification } from "../../../utils/limitNotification";
import SpecificationSelect from "../../../customs/select/speSelect";

const CreateAdz = () => {
  const [stateId, setStateId] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const { notification } = App.useApp();
  const [uploadFeature, setUploadFeature] = useState<File | null>(null);
  const [uploads, setUploads] = useState<File[]>([]);
  const [uploadVideos, setUploadVideos] = useState<File[]>([]);
  const [subCategoryId, setSubCategoryId] = useState(0);
  const user = useAtomValue(userAtom);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();

  const handleStateChange = (value: number, setFieldValue: any) => {
    setStateId(value);
    setFieldValue("local_government_area_id", "");
  };

  const handleCategoryChange = (value: number, setFieldValue: any) => {
    setCategoryId(value);
    setFieldValue("sub_category_id", "");
  };
  const handleSubCategoryChange = (value: number) => {
    setSubCategoryId(value);
  };

  const [
    getStateQuery,
    getLGAQuery,
    getAllCategoryQuery,
    getSubCategoryQuery,
    getSpecificationQuery,
    getProfileQuery,
  ] = useQueries({
    queries: [
      {
        queryKey: ["get-all-state"],
        queryFn: getAllState,
        retry: 0,
        refetchOnWindowFocus: true,
      },
      {
        queryKey: ["get-all-lga", stateId],
        queryFn: () => getLGAbyStateId(stateId!),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!stateId,
      },
      {
        queryKey: ["get-all-category"],
        queryFn: () => getAllCategory(),
        retry: 0,
        refetchOnWindowFocus: true,
      },
      {
        queryKey: ["get-sub-category", categoryId],
        queryFn: () => getSubCategory(categoryId),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!categoryId,
      },
      {
        queryKey: ["get-sub-category", subCategoryId],
        queryFn: () => getSpecSubCategory(subCategoryId),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!subCategoryId,
      },

      {
        queryKey: ["get-profile"],
        queryFn: () => getApplicantsbyId(user?.id!),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!user?.id,
      },
    ],
  });

  const planId = getProfileQuery?.data?.data?.subscription?.pricing?.plan?.id;

  const { data: subPlanData } = useQuery({
    queryKey: ["get-all-sub", planId],
    queryFn: () => getAllSubscriptionbyId(planId),
    retry: 0,
    enabled: !!planId, // only runs when planId is available
    refetchOnWindowFocus: false,
  });

  const features = subPlanData?.data?.features;

  const adsFeatures = features?.filter(
    (feature: any) => feature?.category === "ads"
  );

  const findFeatureBySlug = (slug: string) => {
    const match = adsFeatures?.find((feature: any) => feature?.slug === slug);
    return match || null;
  };

  const stateData = getStateQuery?.data?.data?.data ?? [];
  const lgaData = getLGAQuery?.data?.data?.data ?? [];
  const subCategory = getSubCategoryQuery?.data?.data?.data ?? [];

  const stateOptions: { value: number; label: string }[] = [
    { value: 0, label: "Select State" }, // Default option
    ...(stateData && stateData?.length > 0
      ? stateData?.map((item: StateDatum) => ({
          value: item?.id,
          label: item?.state_name,
        }))
      : []),
  ];

  const lgaOptions: { value: number; label: string }[] = [
    { value: 0, label: "Select Lga" }, // Default option
    ...(lgaData && lgaData?.length > 0
      ? lgaData?.map((item: LGADatum) => ({
          value: item?.id,
          label: item?.local_government_area,
        }))
      : []),
  ];

  const categoryData = getAllCategoryQuery?.data?.data?.data ?? [];

  const categoryOptions: { value: number; label: string }[] = [
    { value: 0, label: "Select category" }, // Default option
    ...(categoryData && categoryData?.length > 0
      ? categoryData?.map((item: CategoryDatum) => ({
          value: item?.id,
          label: item?.title,
        }))
      : []),
  ];
  const subCategoryOptions: { value: number; label: string }[] = [
    { value: 0, label: "Select sub category" }, // Default option
    ...(subCategory && subCategory?.length > 0
      ? subCategory?.map((item: CategoryDatum) => ({
          value: item?.id,
          label: item?.title,
        }))
      : []),
  ];
  const specifications =
    getSpecificationQuery?.data?.data?.data[0]?.specifications;

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: Function
  ) => {
    const files = e.target.files;
    if (!files) return;

  
    const imageLimit = findFeatureBySlug("total-ads-images")?.pivot?.limit;
    const uploadedCount = uploads?.length ?? 0;

    if (imageLimit === undefined || (uploadedCount  >=  imageLimit)) {
      LimitNotification({
        message: "Limit Reached",
        description: imageLimit === undefined
        ? "You can't upload Image on your current plan."
        : `You can't upload more than ${imageLimit} image${imageLimit === 1 ? '' : 's'}.`,
        // description: `You can't upload more than ${
        //   findFeatureBySlug("total-ads-images")?.pivot?.limit
        // } images.`,
        onClick: () => {
          navigate("/pricing");
          window.scroll(0, 0);
        },
      });
      return;
    }

    const validFiles = Array.from(files).filter((file) =>
      ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(file.type)
    );

    if (validFiles.length > 0) {
      setUploads([...uploads, ...validFiles]);
      setFieldValue("imageFiles", [...uploads, ...validFiles]);
    } else {
      notification.error({
        message: "Invalid File Type",
        description: "Only image files (jpg, jpeg, png) are allowed.",
      });
    }
  };

  const handleVideoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: Function
  ) => {
    const files = e.target.files;
    if (!files) return;
   
    const videoLimit = findFeatureBySlug("total-ads-videos")?.pivot?.limit;
   
    console.log(videoLimit,'videoLimit')


    if (videoLimit === undefined || (uploadVideos?.length  >=  videoLimit)) {
      
      LimitNotification({
        message: "Limit Reached",
        description: videoLimit === undefined
      ? "You can't upload video on your current plan."
      : `You can't upload more than ${videoLimit} video${videoLimit === 1 ? '' : 's'}.`,
        // description: `You can't upload more than ${
        //   findFeatureBySlug("total-ads-videos")?.pivot?.limit === undefined
        //     ? 0
        //     : findFeatureBySlug("total-ads-videos")?.pivot?.limit
        // } Video.`,
        onClick: () => {
          navigate("/pricing");
          window.scroll(0, 0);
        },
      });
      return;
    }

    // const validVideos = Array.from(files).filter((file) =>
    //   ["video/mp4", "video/x-matroska", "video/webm"].includes(file.type)
    // );
    const validVideos = Array.from(files).filter((file) =>
      [
        "video/mp4",
        "video/quicktime",
        "video/3gpp",
        "image/jpeg",
        "image/png",
      ].includes(file.type)
    );

    if (validVideos.length > 0) {
      setUploadVideos([...uploadVideos, ...validVideos]);
      setFieldValue("videoFiles", [...uploadVideos, ...validVideos]);
    } else {
      notification.error({
        message: "Invalid File Type",
        description: "Only video files (mp4, mkv, webm) are allowed.",
      });
    }
  };

  const handleFileChangeFeature = (
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
    setFieldValue("featureImage", selectedFile);
    setUploadFeature(selectedFile);
  };

  const clearFile = () => {
    setUploads([]);
    setUploadVideos([]);
    setUploadFeature(null);
  };

  const handleNavigateToProfile = () => {
    localStorage.setItem("activeTabKeyProfile", "7");

    navigate("/profile");
    window.scrollTo(0, 0);
  };
  const createAdsMutation = useMutation({
    mutationFn: createAds,
  });

  const createAdsHandler = async (
    values: FormikValues,
    resetForm: () => void
  ) => {
    const formData = new FormData();
    const descriptionTags = [];

    if (values.Used) {
      descriptionTags.push("USED");
    }
    if (values.New) {
      descriptionTags.push("NEW");
    }
    if (values.PayOnDelivery) {
      descriptionTags.push("PAY ON DELIVERY");
    }
    formData.append("category_id", values?.category_id);
    formData.append("sub_category_id", values?.sub_category_id);
    formData.append("title", values?.title);
    formData.append("price", values?.price);
    formData.append("discount_price", values?.discount_price);
    // formData.append("description_tags[0]", checkedBox);
    descriptionTags.forEach((tag, index) => {
      formData.append(`description_tags[${index}]`, tag);
    });
    formData.append("description", values?.description);
    formData.append("state_id", values?.state_id);
    formData.append("technical_details", values?.technical_details);

    formData.append(
      "local_government_area_id",
      values?.local_government_area_id
    );
    formData.append("pickup_address", values.pickup_address);
    formData.append("pickup_lat", values.pickup_address);
    formData.append("pickup_lng", values.pickup_address);
    if (uploadFeature) {
      formData.append("add_featured_image", uploadFeature);
    }

    uploads.forEach((file, index: number) => {
      formData.append(`add_image[${index}]`, file);
    });

    uploadVideos.forEach((file, index: number) => {
      formData.append(`add_video[${index}]`, file);
    });

    if (
      getSpecificationQuery?.data?.data?.data &&
      getSpecificationQuery?.data?.data?.data?.length > 0
    ) {
      const specs = getSpecificationQuery.data.data.data[0].specifications;

      specs.forEach((spec: any, index: number) => {
        const specValue = values?.[`specifications`]?.[index]?.value;

        if (specValue !== undefined && specValue !== null && specValue !== "") {
          formData.append(`specifications[${index}][id]`, String(spec.id));
          formData.append(`specifications[${index}][value]`, String(specValue));
        }
      });
    }

    try {
      await createAdsMutation.mutateAsync(formData, {
        onSuccess: (data) => {
          notification.success({
            message: "Success",
            description: data?.message,
          });
          resetForm();
          clearFile();
          handleNavigateToProfile();
        },
      });
    } catch (error) {
      notification.error({
        message: "Error",
        description: errorMessage(error) || "An error occurred",
      });
      clearFile();
    }
  };

  const validationSchema = Yup.object().shape({
    category_id: Yup.string().required("required"),
    sub_category_id: Yup.string().required("required"),
    title: Yup.string().required("required"),
    price: Yup.string().required("required"),
    // discount_price: Yup.string().required("required"),
    description: Yup.string().required("required"),
    state_id: Yup.string().required("required"),
    local_government_area_id: Yup.string().required("required"),
    pickup_address: Yup.string().required("required"),
    // state_id: Yup.string().required("required"),
    // state_id: Yup.string().required("required"),
  });
  const handleRemoveFeature = () => {
    setUploadFeature(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
  };

  const handleRemoveUpload = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveVideo = (index: number) => {
    setUploadVideos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="wrapper">
      <Formik
        initialValues={{
          title: "",
          Used: false,
          New: false,
          PayOnDelivery: false,
          price: "",
          discount_price: "",
          category_id: "",
          sub_category_id: "",
          pickup_address: "",
          state_id: "",
          local_government_area_id: "",
          description: "",
          technical_details: "",
          specifications:
            specifications?.map((spec: any) => ({
              id: spec.id,
              value: "",
            })) || [],
        }}
        onSubmit={(values, { resetForm }) => {
          const totalAdsCreated =
            getProfileQuery?.data?.data?.total_all_ads ?? 0;
          const adLimit = findFeatureBySlug("total-ads")?.pivot?.limit;
          if (adLimit !== undefined && (totalAdsCreated < adLimit)) {
            
           
            createAdsHandler(values, resetForm);
          } else
            LimitNotification({
              message: "Limit Reached",

              description: adLimit === undefined
              ? "You can't Post Ads on your current plan."
              : `You can't Post more than ${adLimit} Ad${adLimit === 1 ? '' : 's'}. on your current Plan,`,
              
            
              onClick: () => {
                navigate("/pricing");
                window.scroll(0, 0);
              },
            });
        }}
        validationSchema={validationSchema}
        // enableReinitialize
      >
        {({ handleChange, setFieldValue, values }) => {
          return (
            <Form>
              <div className={styles.inputContainer}>
                <h3>Upload Product Photos and Videos</h3>
                <div className={styles.inputRow}>
                  <Upload
                    ref={fileInputRef}
                    placeHolder="upload your feature image, max 1file"
                    name="featureImage"
                    // label="Upload a document to prove that you’re the owner of this business (CAC, Business letterhead etc.)"
                    onChange={(e) => handleFileChangeFeature(e, setFieldValue)}
                  />
                  <Upload
                    placeHolder="upload your photos"
                    name="imageFile"
                    // label="Upload a document to prove that you’re the owner of this business (CAC, Business letterhead etc.)"
                    onChange={(e) => handleFileChange(e, setFieldValue)}
                  />
                  <Upload
                    placeHolder="upload your Videos"
                    name="videoFile"
                    onChange={(e) => handleVideoChange(e, setFieldValue)}
                  />
                </div>
                <h3>Uploaded Media</h3>

                {uploadFeature && (
                  <div>
                    <h3>Feature Image</h3>
                    <img
                      src={URL.createObjectURL(uploadFeature)}
                      alt="Feature Preview"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                    <br />
                    <button onClick={handleRemoveFeature}>Cancel</button>
                  </div>
                )}

                {uploads?.length > 0 && <h3>Images</h3>}

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {uploads?.map((file, index) => (
                    <div key={index} style={{ textAlign: "center" }}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                      <br />
                      <button onClick={() => handleRemoveUpload(index)}>
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>

                {uploadVideos?.length > 0 && <h3>Videos</h3>}

                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {uploadVideos.map((file, index) => (
                    <div key={index} style={{ textAlign: "center" }}>
                      <video
                        src={URL.createObjectURL(file)}
                        controls
                        style={{
                          width: "200px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                      <br />
                      <button onClick={() => handleRemoveVideo(index)}>
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>

                {/* <div className={styles.imageContainer}>
                    {productDetailsData?.add_images?.map((image, index) => (
                      <div key={index} className={styles.imageWrapper}>
                        <img
                          src={image?.add_image}
                          alt={`Product Image ${index + 1}`}
                          className={styles.imageAds}
                          // width={'100%'}
                          // height={200}
                        />
                        <div
                          className={styles.favoriteIcon}
                          onClick={() => DeleteGalaryHandler([image?.id])} // Your delete logic can be handled here
                        >
                          <img width={30} src={favorite} alt="Favorite" />
                        </div>
                      </div>
                    ))}
                  </div> */}

                <div className={styles.inputRow}>
                  <Input
                    name="title"
                    label="Title"
                    placeholder="Add title"
                    type="text"
                    onChange={handleChange}
                  />
                  <Input
                    name="price"
                    label="Price"
                    placeholder="price"
                    type="text"
                    onChange={handleChange}
                  />
                  <Input
                    name="discount_price"
                    label="Discount Price"
                    placeholder="Discount Price"
                    type="text"
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.inputRow}>
                  <Input
                    name="pickup_address"
                    label="Pickup address"
                    type="text"
                    placeholder="Pickup address"
                  />
                  <SearchableSelect
                    name="category_id"
                    label="Category"
                    options={categoryOptions}
                    placeholder="Select Category"
                    onChange={(value: any) =>
                      handleCategoryChange(value, setFieldValue)
                    }
                  />
                  <SearchableSelect
                    name="sub_category_id"
                    label="Sub Category"
                    options={subCategoryOptions}
                    placeholder="Select Sub Category"
                    onChange={(value: any) => handleSubCategoryChange(value)}
                  />
                </div>
                {specifications && specifications?.length > 0 && (
                  <div className={styles.inputRowSpec}>
                    {specifications &&
                      specifications?.length > 0 &&
                      specifications?.map((spec: any, index: number) => (
                        <div key={index} style={{ marginBottom: "1rem" }}>
                          <Field
                            type="hidden"
                            name={`specifications[${index}].id`}
                            value={spec.id}
                          />
                          {spec.type === "input" ? (
                            <Input
                              name={`specifications[${index}].value`}
                              label={spec.title}
                              placeholder={spec.title}
                              type="text"
                              onChange={handleChange}
                            />
                          ) : spec.type === "dropdown" ? (
                            <SpecificationSelect
                              name={`specifications[${index}].value`}
                              // name={`spec_${spec.title}`}
                              label={spec.title}
                              placeholder={`Select ${spec.title}`}
                              options={JSON.parse(spec.options || "[]")?.map(
                                (opt: string) => ({
                                  label: opt,
                                  value: opt,
                                })
                              )}
                             
                              onChange={handleChange}
                            />
                          ) : null}
                        </div>
                      ))}
                  </div>
                )}
                <div className={styles.inputRow}>
                  <SearchableSelect
                    name="state_id"
                    label="State"
                    options={stateOptions}
                    placeholder="Select State"
                    onChange={(value: any) =>
                      handleStateChange(value, setFieldValue)
                    }
                  />
                  <br />

                  <SearchableSelect
                    name="local_government_area_id"
                    label="Lga"
                    options={lgaOptions}
                    placeholder="Select LGA"
                  />
                </div>
                <div style={{ display: "flex", gap: "2rem" }}>
                  <Checkbox label="USED" name="Used" isChecked={values.Used} />
                  <Checkbox label="NEW" name="New" isChecked={values.New} />
                  <Checkbox
                    label="PAY ON DELIVERY"
                    name="PayOnDelivery"
                    isChecked={values.PayOnDelivery}
                  />
                </div>
                <Input
                  name="description"
                  label="Description"
                  type="textarea"
                  placeholder="Description"
                />
                <Input
                  name="technical_details"
                  label="Technical Details"
                  type="textarea"
                  placeholder="Technical Details"
                />
                <section className={styles.buttonGroup}>
                  <Button
                    variant="red"
                    type="button"
                    disabled={false}
                    text="Cancel"
                    className="buttonStyle"
                    onClick={() => navigate(-1)}
                  />
                  <Button
                    variant="green"
                    type="submit"
                    disabled={createAdsMutation?.isPending}
                    text={
                      createAdsMutation?.isPending ? "loading..." : "Submit"
                    }
                    className="buttonStyle"
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

export default CreateAdz;
