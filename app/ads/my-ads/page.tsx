"use client";
import MyAds from "@/screens/profile/myAds/myAds";
import { Suspense } from "react";

const MyAdsPage = () => {
  return (
    <Suspense>
      <MyAds />
    </Suspense>
  );
};

export default MyAdsPage;