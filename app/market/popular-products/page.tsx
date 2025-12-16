"use client";
import PopularProductsPage from "@/screens/home/market/page/popularProduct";
import { Suspense } from "react";

const PopularProducts = () => {
  return (
    <Suspense>
      <PopularProductsPage />
    </Suspense>
  );
};

export default PopularProducts;
