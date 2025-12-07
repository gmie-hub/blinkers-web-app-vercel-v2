"use client";
import Jobs from "@/screens/job/job";
import { Suspense } from "react";

const JobsPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Jobs />;
    </Suspense>
  );
};

export default JobsPage;
