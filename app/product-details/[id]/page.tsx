import { Metadata, ResolvingMetadata } from "next";
import { getProductDetailsByslug } from "@/services/adsServices";
import Main from "@/screens/home/market/productDetails/productDetailsToDisplay";

export async function generateMetadata(
  { params }: { params: { id: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const product = await getProductDetailsByslug(params.id);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];
  const imageUrl = product?.data?.cover_image_url;

  return {
    title: product?.data?.title,
    description: product?.data?.description,
    openGraph: {
      title: product?.data?.title,
      description: product?.data?.description,
      images: imageUrl ? [imageUrl, ...previousImages] : previousImages,
    },
    twitter: {
      card: "summary_large_image",
      title: product?.data?.title,
      description: product?.data?.description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

const ProductDetailsPage = () => {
  return <Main />;
};

export default ProductDetailsPage;