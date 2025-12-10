"use client";

import Market from "@/screens/home/market/market";
import { Suspense } from "react";

const MarketPage = () => {
  return (
    <Suspense>
      <Market />
    </Suspense>
  );
};

export default MarketPage;
