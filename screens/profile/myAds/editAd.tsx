import { Field, Form, Formik, FormikProps, FormikValues } from "formik";
import styles from "./editAds.module.scss";
import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import Input from "../../../customs/input/input";
import SearchableSelect from "../../../customs/searchableSelect/searchableSelect";
import Button from "../../../customs/button/button";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteAdsGalarybyId,
  deleteAdsVideobyId,
  getAllCategory,
  getAllState,
  getAllSubscriptionbyId,
  getApplicantsbyId,
  getLGAbyStateId,
  getProductDetails,
  getSpecSubCategory,
  getSubCategory,
  UpdateAds,
  uploadAdsGallery,
  uploadAdsVideo,
} from "../../request";
import { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import Checkbox from "../../../customs/checkBox/checkbox";
import Upload from "../../../customs/upload/upload";
import { App } from "antd";
import { errorMessage } from "../../../utils/errorMessage";
import DeleteIcon from "../../../assets/deleteicon.svg";
import CustomSpin from "../../../customs/spin";
import * as Yup from "yup";
import SpecificationSelect from "../../../customs/select/speSelect";
import { userAtom } from "../../../utils/store";
import { useAtomValue } from "jotai";
import { LimitNotification } from "../../../utils/limitNotification";

const EditAdz = () => {
  const { id } = useParams();
  const [stateId, setStateId] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const { notification } = App.useApp();
  const [uploadFeature, setUploadFeature] = useState<File | null>(null);
  const [upload, setUpload] = useState<File | null>(null);
  const [uploadVideo, setUploadVideo] = useState<File | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [subCategoryId, setSubCategoryId] = useState(0);
  const formikRef = useRef<FormikProps<any>>(null);
  const user = useAtomValue(userAtom);

  console.log(subCategoryId, "subCategoryId");
  const handleStateChange = (value: number, setFieldValue: any) => {
    setStateId(value);
    setFieldValue("local_government_area_id", "");
  };

  const handleCategoryChange = (value: number, setFieldValue: any) => {
    setCategoryId(value);
    setFieldValue("sub_category_id", "");
  };

  const [
    getProductDetailsQuery,
    getStateQuery,
    getLGAQuery,
    getAllCategoryQuery,
    getSubCategoryQuery,
    getSpecificationQuery,
    getProfileQuery,
  ] = useQueries({
    queries: [
      {
        queryKey: ["get-product-details", id],
        queryFn: () => getProductDetails(parseInt(id!)),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!id,
      },
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

  const productDetailsData = getProductDetailsQuery?.data?.data;
  const productDetailsError = getProductDetailsQuery?.error as AxiosError;
  const productDetailsErrorMessage =
    productDetailsError?.message ||
    "An error occurred. Please try again later.";

  const stateData = getStateQuery?.data?.data?.data ?? [];
  const lgaData = getLGAQuery?.data?.data?.data ?? [];
  const subCategory = getSubCategoryQuery?.data?.data?.data ?? [];

  useEffect(() => {
    setSubCategoryId(productDetailsData?.sub_category_id || 0);
  }, [productDetailsData]);

  const stateOptions: { value: number; label: string }[] = [
    { value: 0, label: "Select State" }, // Default option
    ...(Array.isArray(stateData) && stateData.length > 0
      ? stateData.map((item: StateDatum) => ({
          value: item?.id ?? 0, // Fallback to 0 if undefined
          label: item?.state_name ?? "Unknown State", // Fallback to a default label
        }))
      : []),
  ];

  const lgaOptions: { value: number; label: string }[] = [
    { value: 0, label: "Select Lga" }, // Default option
    ...(Array.isArray(lgaData) && lgaData.length > 0
      ? lgaData.map((item: LGADatum) => ({
          value: item?.id ?? 0, // Fallback to 0 if undefined
          label: item?.local_government_area ?? "Unknown LGA", // Fallback to a default label
        }))
      : []),
  ];

  const categoryData = getAllCategoryQuery?.data?.data?.data ?? [];

  const categoryOptions: { value: number; label: string }[] = [
    { value: 0, label: "Select Business" }, // Default option
    ...(Array.isArray(categoryData) && categoryData.length > 0
      ? categoryData.map((item: CategoryDatum) => ({
          value: item?.id ?? 0, // Default to 0 if undefined
          label: item?.title ?? "Unknown Category", // Default label
        }))
      : []),
  ];

  const subCategoryOptions: { value: number; label: string }[] = [
    { value: 0, label: "Select Business" }, // Default option
    ...(Array.isArray(subCategory) && subCategory.length > 0
      ? subCategory.map((item: CategoryDatum) => ({
          value: item?.id ?? 0, // Default to 0 if undefined
          label: item?.title ?? "Unknown Subcategory", // Default label
        }))
      : []),
  ];

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: Function
  ) => {
    if (!e.target?.files) return;


    const imageLimit = findFeatureBySlug("total-ads-images")?.pivot?.limit;

    const uploadedCount = productDetailsData?.add_images?.filter(
      (img: any) => img.is_featured === 0
    )?.length ?? 0;

    if (imageLimit === undefined || (uploadedCount  >= imageLimit)) {
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


    
    const selectedFile = e.target?.files[0];

    const validFileTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
    ];

    if (!validFileTypes.includes(selectedFile?.type)) {
      notification.error({
        message: "Invalid File Type",
        description: "Only image files (jpg, jpeg, png) are allowed.",
      });
      return;
    }
    setFieldValue("imageFiles", selectedFile);
    setUpload(selectedFile);
  };
  const handleVideoChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: Function
  ) => {
    setUploadVideo(null);
    if (!e.target?.files) return;

    const videoLimit = findFeatureBySlug("total-ads-videos")?.pivot?.limit;
    const uploadedCount =  productDetailsData?.add_videos?.length ?? 0;

    if (videoLimit === undefined || (uploadedCount  >= videoLimit)) {
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


    const selectedFile = e.target?.files[0];

    const validFileTypes = ["video/mp4"];

    if (!validFileTypes.includes(selectedFile?.type)) {
      notification.error({
        message: "Invalid File Type",
        description: "Only video files (mp4,) are allowed.",
      });
      return;
    }
    setFieldValue("videoFiles", selectedFile);
    setUploadVideo(selectedFile);
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
    if (!validFileTypes.includes(selectedFile?.type)) {
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

  const handleSubCategoryChange = (value: number) => {
    setSubCategoryId(value);
  };


 
  const deleteGalaryMutation = useMutation({ mutationFn: deleteAdsGalarybyId });

  const DeleteGalaryHandler = async (imageIds: number[]) => {
    try {
      await deleteGalaryMutation.mutateAsync(
        {
          add_id: parseInt(id!), // Ensure id is available
          image_ids: imageIds,
        },
        {
          onSuccess: (data) => {
            notification.success({
              message: "Success",
              description: data?.message,
            });
            queryClient.refetchQueries({
              queryKey: ["get-product-details"],
            });
          },
        }
      );
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: errorMessage(error) || "An error occurred",
      });
    }
  };

  const deleteVideoMutation = useMutation({ mutationFn: deleteAdsVideobyId });

  const DeleteVideoHandler = async (videoIds: number[]) => {
    try {
      await deleteVideoMutation.mutateAsync(
        {
          add_id: id!, // Ensure id is available
          video_ids: videoIds,
        },
        {
          onSuccess: (data) => {
            notification.success({
              message: "Success",
              description: data?.message,
            });
            queryClient.refetchQueries({
              queryKey: ["get-product-details"],
            });
          },
        }
      );
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: errorMessage(error) || "An error occurred",
      });
    }
  };

  const UploadGalleryMutation = useMutation({
    mutationFn: uploadAdsGallery,
    mutationKey: ["upload-ads-gallery"],
  });

  const UploadGalleryHandler = async () => {
    const formData = new FormData();

    if (id) {
      formData.append("add_id", id); // Correctly append the file
    }
    if (upload) {
      formData.append("add_image[]", upload); // Correctly append the file
    }

    try {
      await UploadGalleryMutation.mutateAsync(formData, {
        onSuccess: (data) => {
          notification.success({
            message: "Success",
            description: data?.message,
          });

          queryClient.refetchQueries({
            queryKey: ["get-product-details"],
          });
          setUpload(null);
        },
      });
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: errorMessage(error) || "An error occurred",
      });

      setUpload(null);
    }
  };

  const UploadVideoMutation = useMutation({
    mutationFn: uploadAdsVideo,
    mutationKey: ["upload-ads-video"],
  });

  const UploadVideoHandler = async () => {
    const formData = new FormData();

    if (id) {
      formData.append("add_id", id); // Correctly append the file
    }
    if (uploadVideo) {
      formData.append("add_video[]", uploadVideo); // Correctly append the file
    }

    try {
      await UploadVideoMutation.mutateAsync(formData, {
        onSuccess: (data) => {
          notification.success({
            message: "Success",
            description: data?.message,
          });

          queryClient.refetchQueries({
            queryKey: ["get-product-details"],
          });
          setUploadVideo(null);
        },
      });
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: errorMessage(error) || "An error occurred",
      });

      setUploadVideo(null);
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (upload) {
      UploadGalleryHandler();
    }
  }, [upload]);

  useEffect(() => {
    if (uploadVideo) {
      UploadVideoHandler();
    }
  }, [uploadVideo]);

  // useEffect(() => {
  //   if (uploadFeature) {
  //     UploadGalleryHandler();
  //   }
  // }, [uploadFeature]);

  useEffect(() => {
    setStateId(productDetailsData?.state_id!);
  }, [productDetailsData?.state_id]);

  useEffect(() => {
    setCategoryId(productDetailsData?.category_id!);
  }, [productDetailsData?.category_id]);

  const updateAdsMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: FormData }) =>
      UpdateAds(id, payload),
    mutationKey: ["edit-ads"],
  });

  const UpdateAdsHandler = async (values: FormikValues) => {
    const formData = new FormData();
    const descriptionTags = [];

    const parsePrice = (price: string | number) =>
      Math.floor(Number(price?.toString().replace(/,/g, "")));
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
    // formData.append("price", values?.price);
    // formData.append("discount_price", values?.discount_price);
    formData.append("price", parsePrice(values?.price).toString());
    formData.append(
      "discount_price",
      parsePrice(values?.discount_price).toString()
    );

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
    // formData.append("status", '5')

    // formData.append("pickup_lat", values.pickup_lat);
    // formData.append("pickup_lng", values.pickup_lng);

    if (uploadFeature) {
      formData.append("add_featured_image", uploadFeature);
    }
    formData.append("_method", "patch");

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
      await updateAdsMutation.mutateAsync(
        { id: productDetailsData?.id!, payload: formData },
        {
          onSuccess: (data) => {
            notification.success({
              message: "Success",
              description: data?.message,
            });
            navigate(-1);
          },
        }
      );
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: errorMessage(error) || "An error occurred",
      });
    }
  };

  const specifications =
    getSpecificationQuery?.data?.data?.data[0]?.specifications;

  const validationSchema = Yup.object().shape({
    category_id: Yup.string().required("required"),
    sub_category_id: Yup.string().required("required"),
    title: Yup.string().required("required"),
    price: Yup.string().required("required"),
    description: Yup.string().required("required"),
    state_id: Yup.string().required("required"),
    local_government_area_id: Yup.string().required("required"),
    pickup_address: Yup.string().required("required"),
  });

  const handleRemoveFeature = () => {
    setUploadFeature(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input value
    }
  };

  useEffect(() => {
    if (
      formikRef.current &&
      productDetailsData &&
      getSpecificationQuery?.data?.data?.data[0]?.specifications
    ) {
      const specificationsstate =
        getSpecificationQuery?.data?.data?.data[0]?.specifications.map(
          (spec: any) => {
            const matched = productDetailsData.specification_values?.find(
              (item: any) => item.specification_id === spec.id
            );
            return {
              id: spec.id,
              value: matched?.value ?? "",
            };
          }
        );

      formikRef?.current?.setFieldValue("specifications", specificationsstate);
    }
  }, [productDetailsData, getSpecificationQuery?.data]);

  return (
    <section className="wrapper">
      {getProductDetailsQuery?.isLoading ? (
        <CustomSpin />
      ) : getProductDetailsQuery?.isError ? (
        <h1 className="error">{productDetailsErrorMessage}</h1>
      ) : (
        <Formik
          innerRef={formikRef}
          initialValues={{
            title: productDetailsData?.title || "",
            Used: productDetailsData?.description_tags?.includes("USED"),
            New: productDetailsData?.description_tags?.includes("NEW"),
            PayOnDelivery:
              productDetailsData?.description_tags?.includes("PAY ON DELIVERY"),
            price: productDetailsData?.price || "",

            discount_price: productDetailsData?.discount_price || "",
            category_id: productDetailsData?.category_id || "",
            sub_category_id: productDetailsData?.sub_category_id || "",
            pickup_address: productDetailsData?.pickup_address || "",
            state_id: productDetailsData?.state_id || "",
            local_government_area_id:
              productDetailsData?.local_government_area_id || "",
            description: productDetailsData?.description || "",
            technical_details: productDetailsData?.technical_details || "",
            specifications: [],
            // specifications: specificationsstate?.map((spec:any) => ({
            //   id: spec.id,
            //   value: spec.value ?? '',
            // })),
          }}
          onSubmit={(values) => {
            const totalAdsCreated =
              getProfileQuery?.data?.data?.total_all_ads ?? 0;
            const adLimit = findFeatureBySlug("total-ads")?.pivot?.limit;
            if (adLimit !== undefined && (totalAdsCreated < adLimit)) {
              
             
              UpdateAdsHandler(values);
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
          enableReinitialize
        >
          {({ handleChange, setFieldValue, values }) => {
            return (
              <Form>
                <div className={styles.inputContainer}>
                  <h3>Upload Product Photos and Videos</h3>
                  <div className={styles.inputRow}>
                    <Upload
                      placeHolder="upload your feature image, max 1file"
                      name="featureImage"
                      // label="Upload a document to prove that you’re the owner of this business (CAC, Business letterhead etc.)"
                      onChange={(e) =>
                        handleFileChangeFeature(e, setFieldValue)
                      }
                    />
                    <Upload
                      placeHolder={
                        UploadGalleryMutation?.isPending
                          ? "Loading... "
                          : "upload your photos"
                      }
                      name="imageFile"
                      // label="Upload a document to prove that you’re the owner of this business (CAC, Business letterhead etc.)"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                    />
                    <Upload
                      placeHolder={
                        UploadVideoMutation?.isPending
                          ? "loading..."
                          : "upload your Videos"
                      }
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

                  <div className={styles.imageContainer}>
                    {productDetailsData?.add_images?.map((image, index) => (
                      <div key={index} className={styles.imageWrapper}>
                        <img
                          src={image?.image_url || image?.add_image}
                          alt={`Product Image ${index + 1}`}
                          className={styles.imageAds}
                          // width={'100%'}
                          // height={200}
                        />
                        <div
                          className={styles.favoriteIcon}
                          onClick={() => DeleteGalaryHandler([image?.id])} // Your delete logic can be handled here
                        >
                          <img width={30} src={DeleteIcon} alt="Favorite" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <br />

                  <div className={styles.imageContainer}>
                    {productDetailsData?.add_videos?.map(
                      (image, index: number) => (
                        <div key={index} className={styles.imageWrapper}>
                          <video
                            className={styles.imageAds}
                            src={image?.add_video}
                            controls
                          />
                          <div
                            className={styles.favoriteIcon}
                            onClick={() => DeleteVideoHandler([image?.id])} // Your delete logic can be handled here
                          >
                            <img width={30} src={DeleteIcon} alt="Favorite" />
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className={styles.inputRow}>
                    <Input
                      name="title"
                      label="title"
                      placeholder="Ad title"
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
                          <div key={spec.id} style={{ marginBottom: "1rem" }}>
                            <Field
                              type="hidden"
                              name={`specifications[${index}].id`}
                              value={spec.id}
                            />
                            {spec.type === "input" ? (
                              <Input
                                name={`specifications[${index}].value`}
                                // name={`spec_${spec.title}`}
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
                    <Checkbox
                      label="USED"
                      name="Used"
                      isChecked={values.Used}
                    />
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
                      disabled={updateAdsMutation?.isPending}
                      text={updateAdsMutation?.isPending ? "loading" : "Submit"}
                      className="buttonStyle"
                    />
                  </section>
                </div>
              </Form>
            );
          }}
        </Formik>
      )}
    </section>
  );
};

export default EditAdz;
