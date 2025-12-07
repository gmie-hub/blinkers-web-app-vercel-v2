import { useState, useEffect } from "react";
import RouteIndicator from "@/components/ui/routeIndicator";
import { useCms } from "@/hooks/getCms";
import DOMPurify from "dompurify";

interface DescriptionProps {
  description: string;
}

const Description = ({ description }: DescriptionProps) => {
  const [sanitizedDescription, setSanitizedDescription] = useState("");

  useEffect(() => {
    setSanitizedDescription(DOMPurify.sanitize(description));
  }, [description]);

  return (
    <div
      style={{ paddingInlineStart: "1rem" }}
      dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
    />
  );
};

const HowToBuy = () => {
  const { data } = useCms();
  const cmsItem = data?.data?.data?.find((item: any) => item.id === 11);

  const cmsData = cmsItem?.description || "";
  const cmsDataTitle = cmsItem?.title;

  return (
    <div className="wrapper">
      <RouteIndicator showBack />
      <h3>{cmsDataTitle}</h3>
      <br />
      {/* Remove the <p> wrapper because you cannot put block-level HTML inside <p> */}
      <Description description={cmsData} />
    </div>
  );
};

export default HowToBuy;
