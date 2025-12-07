"use client";

import JobForYou from "@/screens/job/jobForYou/forYou";
import { Suspense } from "react";

const JobForYouPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobForYou />
    </Suspense>
  );
};

export default JobForYouPage;