import { useQuery } from "@tanstack/react-query";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSubCategory } from "@/services/categoryServices";

interface CategoryWithSubcategoriesProps {
  category: CategoryDatum;
  handleClose: () => void;
}

const CategoryWithSubcategories = ({
  category,
  handleClose,
}: CategoryWithSubcategoriesProps) => {
  const { data: subCategories, isLoading: subcategoriesLoading } = useQuery({
    queryKey: ["subcategories", category.id],
    queryFn: () => getSubCategory(category.id),
    enabled: !!category.id,
  });

  const subCategoryData = subCategories?.data?.data ?? [];
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );
  const router = useRouter();

  const handleSubCategoryClick = (sub: string) => {
    setSelectedSubCategory(sub);
    handleClose();
  };

  useEffect(() => {
    if (selectedSubCategory) {
      // navigate(`/market/${selectedSubCategory}`);
      router.push(`/product-listing/${selectedSubCategory}`);

      // handleClose();
    }
  }, [selectedSubCategory]);

  return (
    <div className={styles.subCategory}>
      <p
        style={{ cursor: "pointer" }}
        onClick={() => handleSubCategoryClick(category?.title)}
      >
        {category.title}{" "}
      </p>
      {subcategoriesLoading ? (
        <p>Loading subcategories...</p>
      ) : (
        <ul>
          {subCategoryData.map((sub) => (
            <li key={sub.id} onClick={() => handleSubCategoryClick(sub?.title)}>
              {sub.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryWithSubcategories;
