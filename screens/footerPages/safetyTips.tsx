import RouteIndicator from "@/components/ui/routeIndicator";
import { useCms } from "@/hooks/getCms";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

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

const SafetyTips = () => {
  const { data } = useCms();

  const cmsItem = data?.data?.data?.find((item: any) => item.id === 12);

  const cmsData = cmsItem?.description || "";
  const cmsDataTitle = cmsItem?.title || "";

  return (
    <div className="wrapper">
      <RouteIndicator showBack />
      <h3>{cmsDataTitle}</h3>
      <br />

      {/* Description returns a <div>, so we avoid wrapping in <p> */}
      <Description description={cmsData} />
    </div>
  );
};

export default SafetyTips;
