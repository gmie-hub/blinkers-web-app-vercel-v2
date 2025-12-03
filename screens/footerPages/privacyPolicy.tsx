import RouteIndicator from "@/components/ui/routeIndicator";
import { useCms } from "@/hooks/getCms";
import DOMPurify from "dompurify";

interface DescriptionProps {
  description: string;
}

const Description = ({ description }: DescriptionProps) => {
  const sanitizedDescription = DOMPurify.sanitize(description);

  return (
    <div
      style={{ paddingInlineStart: "1rem" }}
      dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
    />
  );
};

const PrivacyPolicy = () => {
  const { data } = useCms();

  const cmsItem = data?.data?.data?.find((item: any) => item.id === 27);

  const cmsData = cmsItem?.description || "";
  const cmsDataTitle = cmsItem?.title || "";

  return (
    <div className="wrapper">
      <RouteIndicator showBack />
      <h3>{cmsDataTitle}</h3>
      <br />

      {/* Description returns a <div>, so no <p> wrapper */}
      <Description description={cmsData} />
    </div>
  );
};

export default PrivacyPolicy;
