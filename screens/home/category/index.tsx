import { useQuery } from "@tanstack/react-query";
import styles from "./index.module.scss";
import CategoryWithSubcategories from "./subCategory";
import { Spin } from "antd";
import { getAllCategory, getSubCategory } from "@/services/categoryServices";

interface Props {
  handleClose: () => void;
}

const CategoriesCard = ({ handleClose }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["get-all-category"],
    queryFn: () => getAllCategory(),
  });

  const categoryData = data?.data?.data ?? [];

  const { data: subCategories, isLoading: isSubCategoryLoading } = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const allSubcategories = await Promise.all(
        categoryData.map((category) =>
          getSubCategory(category.id).then((res) => ({
            categoryId: category.id,
            subCategories: res?.data?.data,
          }))
        )
      );
      return allSubcategories;
    },
    enabled: categoryData.length > 0,
  });

  const subCategoryData = subCategories ?? [];

  const filteredCategories = categoryData.filter((category) => {
    const matchingSubcategories = subCategoryData.find(
      (item) => item.categoryId === category.id
    );

    return (
      matchingSubcategories && matchingSubcategories.subCategories.length > 0
    );
  });

  if (isLoading || isSubCategoryLoading) {
    return <Spin />;
  }

  return (
    <div className={styles.card}>
      {filteredCategories.map((category) => (
        <div key={category.id} className={styles.cardItem}>
          <CategoryWithSubcategories
            category={category}
            handleClose={handleClose}
          />
        </div>
      ))}
    </div>
  );
};

export default CategoriesCard;
