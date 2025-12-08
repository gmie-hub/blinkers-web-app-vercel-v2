import { Metadata, ResolvingMetadata } from "next";
import { getProductDetailsByslug } from "@/services/adsServices";
import Main from "@/screens/home/market/productDetails/productDetailsToDisplay";

export const revalidate = 60;

function ensureAbsoluteUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${process.env.NEXT_PUBLIC_SITE_URL}${url}`;
}

function getSocialImageUrl(imageUrl: string | undefined): string | undefined {
  if (!imageUrl) return undefined;
  
  const absoluteUrl = ensureAbsoluteUrl(imageUrl);

  return absoluteUrl;
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const { id } = await params;
    
    // Fetch product data
    const product = await getProductDetailsByslug(id);

    // Handle case where product doesn't exist
    if (!product?.data) {
      return {
        title: 'Product Not Found - Blinkers',
        description: 'The requested product could not be found',
      };
    }

    const previousImages = (await parent).openGraph?.images || [];
    
    const title = product.data.title || "Product Details";
    const description = product.data.description || "Check out this amazing product on Blinkers";
    const imageUrl = getSocialImageUrl(product.data.cover_image_url);
    const pageUrl = `product-details/${id}`;

    // Log for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Generated metadata for:', id);
      console.log('Image URL:', imageUrl);
      console.log('Page URL:', pageUrl);
    }

    return {
      title: `${title} - Blinkers`,
      description,
      openGraph: {
        title,
        description,
        url: pageUrl,
        siteName: "Blinkers",
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
            type: 'image/webp', // Specify the image type
          },
          ...previousImages
        ] : previousImages,
        type: "website",
        locale: "en_US",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
        creator: "@blinkers",
        site: "@blinkers",
      },
      alternates: {
        canonical: pageUrl,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      // Additional metadata for better SEO
      other: {
        'og:image:width': '1200',
        'og:image:height': '630',
        'og:image:type': 'image/webp',
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product Details - Blinkers',
      description: 'View product details on Blinkers',
    };
  }
}

const ProductDetailsPage = () => {
  return <Main />;
};

export default ProductDetailsPage;