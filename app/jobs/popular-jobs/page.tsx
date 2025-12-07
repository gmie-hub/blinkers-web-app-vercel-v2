"use client";
import PopularJobs from "@/screens/job/popularJob/popularJob";
import { Suspense } from "react";

const PopularJobsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PopularJobs />
    </Suspense>
  );
};

export default PopularJobsPage;
