"use client";
import Directory from "@/screens/directory/directory";
import { Suspense } from "react";

const DirectoryPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Directory />
    </Suspense>
  );
};

export default DirectoryPage;
