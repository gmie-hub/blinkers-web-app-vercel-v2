import { Metadata, ResolvingMetadata } from "next";
import { getProductDetailsByslug } from "@/services/adsServices";
import Main from "@/screens/home/market/productDetails/productDetailsToDisplay";

export async function generateMetadata(
  props: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  // fetch data
  const product = await getProductDetailsByslug(params.id);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product?.data.title,
    description: product?.data.description,
    openGraph: {
      images: [product?.data.cover_image_url, ...previousImages],
    },
  };
}

const ProductDetailsPage = () => {
  return <Main />;
};

export default ProductDetailsPage;