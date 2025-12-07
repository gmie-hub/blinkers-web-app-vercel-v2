import { useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Form, Formik } from "formik";

import { Image } from "antd";

import { useQueries } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getAllCategory, getSubCategory } from "@/services/categoryServices";
import { getAllState, getLGAbyStateId } from "@/services/locationServices";
import Checkbox from "@/components/ui/checkBox/checkbox";
import SearchableSelect from "@/components/ui/searchableSelect/searchableSelect";
import Button from "@/components/ui/button/button";
import ProductList from "./productList";

const PriceOptions = [
  { key: "asc", value: "Low To High" },
  { key: "desc", value: "High To Low" },
  // { key: 3, value: "Discounted" },
];

interface Props {
  appliedSearchTerm: string;
  setAppliedSearchTerm: any;
}

const Main = ({ appliedSearchTerm, setAppliedSearchTerm }: Props) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  const [categoryId, setCategoryId] = useState(0);
  const [selectedItems, setSelectedItems] = useState<number[]>([]); // Array of strings
  const [stateId, setStateId] = useState(0);
  const [lgaId, setLgaId] = useState(0);
  const router = useRouter();

  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  const handleCheckboxPriceChange = (optionKey: string) => {
    setSelectedPrice((prevSelected) =>
      prevSelected === optionKey ? null : optionKey
    );
  };
  const handleStateChange = (value: number, setFieldValue: any) => {
    setStateId(value);
    setLgaId(0);
    setFieldValue("lga", "");
  };

  const handleLgaChange = (value: number) => {
    setLgaId(value);
    // setFieldValue("lga", "")
  };

  // useEffect(() => {
  //   if (selectedItems.length > 0) {
  //     setAppliedSearchTerm(selectedItems); // Get the last item
  //   }
  // }, [selectedItems]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    if (windowWidth < 1024) {
      setIsFilterVisible(false);
    } else {
      setIsFilterVisible(true);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth]);

  const toggleFilterVisibility = () => {
    setIsFilterVisible((prevState) => !prevState);
  };

  const toggleItems = (index: number, id: number) => {
    setCategoryId(id);
    setOpenIndex(openIndex === index ? null : index);
  };

  const [getCategoryQuery, getSubCategoryQuery, getStateQuery, getLGAQuery] =
    useQueries({
      queries: [
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

  const categoryData = getCategoryQuery?.data?.data?.data ?? [];
  const subCategory = getSubCategoryQuery?.data?.data?.data;
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

  // Updated handleCheckboxChange to save only subCategory titles
  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    subCategoryTitle: number
  ) => {
    const { checked } = e.target;
    setSelectedItems((prevState) => {
      if (checked) {
        return [...prevState, subCategoryTitle]; // Add selected sub-category title
      } else {
        return prevState.filter((item) => item !== subCategoryTitle); // Remove unselected sub-category title
      }
    });
  };

  // Updated isChecked to check against subCategory titles
  const isChecked = (subCategoryTitle: number) => {
    return selectedItems.includes(subCategoryTitle);
  };

  const handleBack = () => {
    appliedSearchTerm = "";
    setAppliedSearchTerm("");
    // search = "";
    // navigate("/market");
    router.push("/product-listing");

    setStateId(0);
    setLgaId(0);
    setSelectedItems([]);
    setSelectedPrice("");
  };

  return (
    <Formik
      initialValues={{
        state: "",
        lga: "",
        selectedItems: [],
        nearby_me: false,
        selectedPrices: {},
      }}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({ setFieldValue }) => (
        <Form>
          <div className={styles.container}>
            <div className={styles.leftSide}>
              {isFilterVisible && (
                <>
                  <div className={styles.spaceBetween}>
                    <p>Filters</p>
                    <Image
                      className={styles.filter}
                      onClick={toggleFilterVisibility}
                      width={30}
                      src="/setting-4.svg"
                      alt="FilterIcon"
                      preview={false}
                    />
                  </div>
                  {/* <Checkbox
                    label="Nearby Me"
                    name="nearby_me"
                    isChecked={values.nearby_me}
                    // onChange={(e: any) => handleCheckboxChange(e, "Nearby Me")}
                  /> */}

                  <p className={styles.subjectBg}>CATEGORIES</p>

                  {categoryData?.map((category: any, index: number) => (
                    <div key={index}>
                      <div
                        className={styles.itemContainer}
                        onClick={() => toggleItems(index, category?.id)}
                      >
                        <p>{category.title}</p>
                        <p className={styles.plusSign}>
                          {openIndex === index ? "-" : "+"}
                        </p>
                      </div>
                      {openIndex === index && (
                        <ul className={styles.itemList}>
                          {subCategory?.map((sub: any) => (
                            <li key={sub.id}>
                              <Checkbox
                                isChecked={isChecked(sub.title)} // Pass sub.title to isChecked
                                label={sub.title}
                                name={`selectedItems.${sub.id}`}
                                onChange={
                                  (e: any) => handleCheckboxChange(e, sub.id) // Pass sub.title to handleCheckboxChange
                                }
                              />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                  <div>
                    <p className={styles.subjectBg}>LOCATION</p>

                    <SearchableSelect
                      name="state"
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
                      name="lga"
                      label="Lga"
                      options={lgaOptions}
                      placeholder="Select LGA"
                      onChange={(value) => handleLgaChange(value)} // Update stateId here
                    />
                  </div>
                  <div>
                    <p className={styles.subjectBg}>Price</p>
                    <ul className={styles.itemList}>
                      {PriceOptions.map((option, index) => (
                        <li key={index}>
                          <input
                            type="checkbox"
                            checked={selectedPrice === option.key}
                            onChange={() =>
                              handleCheckboxPriceChange(option.key)
                            }
                          />
                          <label>{option.value}</label>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div style={{ marginBlockStart: "2rem" }}>
                    {/* <Button text="Apply Filter" /> */}
                    <br />
                    <br />
                    <Button
                      onClick={handleBack}
                      variant="white"
                      text="Reset Filter"
                    />
                  </div>
                </>
              )}

              {!isFilterVisible && (
                <div className={styles.spaceBetween}>
                  <p>Filters</p>
                  <Image
                    className={styles.filter}
                    onClick={toggleFilterVisibility}
                    width={30}
                    src="/Search.svg"
                    alt="FilterIcon"
                    preview={false}
                  />
                </div>
              )}
            </div>

            <div className={styles.rightSide}>
              <p className={styles.title1}>Popular Products</p>
              {/* <PopularProducts/> */}

              <p className={styles.title1}>All Products</p>
              <ProductList
                appliedSearchTerm={appliedSearchTerm}
                setAppliedSearchTerm={setAppliedSearchTerm}
                selectedItems={selectedItems}
                stateId={stateId}
                lgaId={lgaId}
                setStateId={setStateId}
                setLgaId={setLgaId}
                setSelectedItems={setSelectedItems}
                selectedPrice={selectedPrice}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Main;
