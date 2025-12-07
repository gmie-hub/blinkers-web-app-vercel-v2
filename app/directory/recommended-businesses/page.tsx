"use client";
import RecommendedBusinesses from "@/screens/directory/recommended/recommendedBusiness";
import { Suspense } from "react";

const RecommendedBusinessesPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RecommendedBusinesses />
    </Suspense>
  );
};

export default RecommendedBusinessesPage;
