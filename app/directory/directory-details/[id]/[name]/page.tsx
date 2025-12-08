import { getSocialImageUrl } from "@/lib/utils";
import NotClaim from "@/screens/directory/directoryDeails/directoryDetails";
import { getBusinessById } from "@/services/businessServices";
import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  props: { params: Promise<{ id: number; name: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const { id, name } = await props.params;
    const directory = await getBusinessById(id);

    const previousImages = (await parent).openGraph?.images || [];

    const title = directory.data.name || "Directory Details";
    const description =
      directory.data.about || `This is ${directory.data.name}`;
    const imageUrl = getSocialImageUrl(directory.data.logo);
    const pageUrl = `directory/directory-details/${id}/${name}`;

    return {
      title: directory?.data.name,
      description: directory?.data.about,
      openGraph: {
        title,
        description,
        url: pageUrl,
        siteName: "Blinkers",
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: title,
                type: "image/webp", // Specify the image type
              },
              ...previousImages,
            ]
          : previousImages,
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
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      // Additional metadata for better SEO
      other: {
        "og:image:width": "1200",
        "og:image:height": "630",
        "og:image:type": "image/webp",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Directory Details - Blinkers",
      description: "View directory details on Blinkers",
    };
  }
}

const DirectoryDetailsPage = () => {
  return <NotClaim />;
};

export default DirectoryDetailsPage;
