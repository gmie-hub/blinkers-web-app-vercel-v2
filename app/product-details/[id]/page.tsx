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

  const title = product?.data?.title || "Product Details";
  const description = product?.data?.description
  const imageUrl = product?.data?.cover_image_url;

  return {
    title: product?.data?.title,
    description: product?.data?.description,
    openGraph: {
      title,
      description,
      url: typeof window !== "undefined" ? window.location.href : undefined,
      siteName: "Blinkers", // ← Recommended
      images: imageUrl ? [imageUrl, ...previousImages] : previousImages,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/product-details/${params.id}`,
    },
  };
}

const ProductDetailsPage = () => {
  return <Main />;
};

export default ProductDetailsPage;
