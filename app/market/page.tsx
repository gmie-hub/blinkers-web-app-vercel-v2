"use client";
import Market from "@/screens/home/market/market";
import { Suspense } from "react";

const MarketPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Market />
    </Suspense>
  );
};

export default MarketPage;