"use client";
import TopBusiness from "@/screens/directory/topBusiness/topBusiness";
import { Suspense } from "react";

const TopBusinessPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TopBusiness />
    </Suspense>
  );
};

export default TopBusinessPage;
