import { Form, Formik, FormikValues } from "formik";
import styles from "./index.module.scss";
import * as Yup from "yup";
import { App, Image } from "antd";
import { useMutation, useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { useAtom } from "jotai";
import Card from "@/components/ui/card/card";
import Input from "@/components/ui/input/input";
import Button from "@/components/ui/button/button";
import RouteIndicator from "@/components/ui/routeIndicator";
import { errorMessage } from "@/lib/utils/errorMessage";
import { userAtom } from "@/lib/utils/store";
import { SellerSignUpCall } from "@/services/authService";
import SearchableSelect from "@/components/ui/searchableSelect/searchableSelect";
import { useRouter } from "next/navigation";
import { getAllState, getLGAbyStateId } from "@/services/locationServices";
import { getApplicantsbyId } from "@/services/applicantServices";

const SellerSignUp = () => {
  const { notification } = App.useApp();
  const router = useRouter();
  const [stateId, setStateId] = useState(0);
  const [user, setUser] = useAtom(userAtom);

  const handleStateChange = (value: number, setFieldValue: any) => {
    setStateId(value);
    setFieldValue("local_government_area_id", "");
  };

  const [getProfileQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-profile"],
        queryFn: () => getApplicantsbyId(user?.id ?? 0),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!user?.id,
      },
    ],
  });

  const profileData = getProfileQuery?.data?.data;



  const SignUpMutation = useMutation({
    mutationFn: SellerSignUpCall,
    mutationKey: ["sign-up"],
  });

  const signUpHandler = async (values: FormikValues) => {
    const payload: Partial<SellerSignUpData> = {
      name: user?.name,
      // number: user?.number,
      address: values?.address,
      address_lat: user?.address,
      address_long: user?.address,
      // email: user?.email,
      store_name: values?.store_name,
      store_bio: values?.store_bio,
      state_id: values?.state_id,
      local_government_area_id: values?.local_government_area_id,
      profile_image: values?.profile_image,
      facebook_address: values?.facebook_address,
      instagram_address: values?.instagram_address,
      twitter_address: values?.twitter_address,
      website_address: values?.website_address,
    };

    // if (
    //   !values?.facebook_address &&
    //   !values?.instagram_address &&
    //   !values?.twitter_address &&
    //   !values?.website_address
    // ) {
    //   notification.error({
    //     message: "Social media Link",
    //     description: "at least one social media link is compulsory",
    //     placement: "top",
    //     duration: 4,
    //   });
    //   return; // Ensure this stops further execution
    // }

    try {
      await SignUpMutation.mutateAsync(payload, {
        onSuccess: (data) => {
          notification.success({
            title: "Success",
            description: data?.message,
          });

          setUser((prevUser: any) => ({
            ...prevUser,
            role: "2",
          }));
          if(profileData?.subscription?.pricing?.plan?.name?.toLowerCase() === 'free' || profileData?.subscription?.is_active === 0)  {
            router.push('/pricing')
          }else
          handleNavigateCreateAds();
        },
      });
    } catch (error) {
      notification.error({
        title: "Error",
        description: errorMessage(error) || "An error occurred",
      });
    }
  };

  const validationSchema = Yup.object().shape({
    store_name: Yup.string().required("required"),
    address: Yup.string().required("required"),
    state_id: Yup.string().required("required"),
    local_government_area_id: Yup.string().required("required"),
    // profile_image: Yup.string().required("required"),
    facebook_address: Yup.string()
      // .required("required")
      .url("Invalid URL format"),
    instagram_address: Yup.string()
      // .required("required")
      .url("Invalid URL format"),
    twitter_address: Yup.string()
      // .required("required")
      .url("Invalid URL format"),
    website_address: Yup.string()
      // .required("required")
      .url("Invalid URL format"),
  });

  const [getStateQuery, getLGAQuery] = useQueries({
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
    ],
  });

  const stateData = getStateQuery?.data?.data?.data ?? [];
  const lgaData = getLGAQuery?.data?.data?.data ?? [];

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
  const handleNavigateCreateAds = () => {
    router.push("/create-ad");
    window.scroll(0, 0);
  };

  return (
    <section className={styles.container}>
      <div
        onClick={() => {
          router.push("/");
        }}
        className={styles.smallScreen}
      >
        <Image src='/Frame 1618868702.svg' alt={'BlinkersLogo'} preview={false} />
      </div>

      <Card style={styles.card}>
        {/* <Image src={LoginIcon} alt={LoginIcon} preview={false} /> */}
        <RouteIndicator showBack />
        <p className={styles.welcome}>Complete Profile</p>
        <small></small>

        <Formik
          initialValues={{
            address: user?.address,
            store_name: "",
            store_bio: "",
            state_id: "",
            local_government_area_id: "",
            // profile_image: "",
            facebook_address: "",
            instagram_address: "",
            twitter_address: "",
            website_address: "",
          }}
          onSubmit={(values) => {
            signUpHandler(values);
          }}
          validationSchema={validationSchema}
        >
          {({ setFieldValue }) => {
            return (
              <Form className="fields">
                <Input
                  name="store_name"
                  label="Store name"
                  placeholder="Store name"
                  className={styles.inputText}
                />
                <Input
                  name="store_bio"
                  type="textarea"
                  label="About store"
                  placeholder="About store"
                  className={styles.inputText}
                />
                <Input
                  name="address"
                  // disabled={true}
                  label="Address"
                  className={styles.inputText}
                />
                <br />

                <SearchableSelect
                  name="state_id"
                  label="State"
                  options={stateOptions}
                  placeholder="Select State"
                  // onChange={(value: any) => handleStateChange(value)}
                  onChange={(value: any) =>
                    handleStateChange(value, setFieldValue)
                  } // Update stateId and reset lga here
                />
                <br />

                <SearchableSelect
                  name="local_government_area_id"
                  label="Lga"
                  options={lgaOptions}
                  placeholder="Select LGA"
                />

                <Input
                  name="facebook_address"
                  label="Facebook link"
                  placeholder="Enter Facebook link e.g. https://facebook.com/username "
                  className={styles.inputText}
                />

                <Input
                  name="instagram_address"
                  label="Twitter link"
                  placeholder="Enter Twitter link e.g. https://twitter.com/username "
                  type="text"
                  className={styles.inputText}
                />
                <Input
                  name="twitter_address"
                  label="Instagram link"
                  placeholder="Enter Instagram link e.g. https://instagram.com/username "
                  type="text"
                  className={styles.inputText}
                />
                <Input
                  name="website_address"
                  label="Website link"
                  placeholder="Enter Website link e.g. https://lipsum.com/"
                  type="text"
                  className={styles.inputText}
                />

                <Button
                  disabled={SignUpMutation?.isPending}
                  text={SignUpMutation?.isPending ? "Submitting..." : "save"}
                  type="submit"
                  className={styles.button}
                />
              </Form>
            );
          }}
        </Formik>
      </Card>
    </section>
  );
};

export default SellerSignUp;
