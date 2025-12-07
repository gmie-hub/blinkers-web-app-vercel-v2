"use client";
// import PricingPlansPage from "@/screens/pricing/pricing";
import dynamic from "next/dynamic";

const PricingPlansPage = dynamic(() => import('../../screens/pricing/pricing'), {
  ssr: false, // This disables SSR completely for this component
});

const PricingPage = () => {
  return <PricingPlansPage />;
};

export default PricingPage;