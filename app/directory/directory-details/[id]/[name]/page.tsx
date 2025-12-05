
import NotClaim from "@/screens/directory/directoryDeails/directoryDetails";
import { getBusinessById } from "@/services/businessServices";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  props: { params: Promise<{ id: number }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  // fetch data
  const product = await getBusinessById(params.id);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product?.data.name,
    description: product?.data.category.title,
    openGraph: {
      images: [product?.data.logo, ...previousImages],
    },
  };
}

const DirectoryDetailsPage = () => {
  return <NotClaim />;
};

export default DirectoryDetailsPage;
