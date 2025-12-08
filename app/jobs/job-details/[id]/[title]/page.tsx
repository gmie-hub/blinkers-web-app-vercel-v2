import { getSocialImageUrl } from "@/lib/utils";
import JobDetails from "@/screens/job/jobDetails/jobDetails";
import { getJobDetails } from "@/services/jobServices";

import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  props: { params: Promise<{ id: number; title: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const { id, title: jobTitle } = await props.params;

    const job = await getJobDetails(id);

    if (!job?.data) {
      return {
        title: 'Job Not Found - Blinkers',
        description: 'The requested job could not be found',
      };
    }

    const previousImages = (await parent).openGraph?.images || [];

    const title = job.data.title || "Job Details";
    const description =
      job.data.description || "Check out this amazing job on Blinkers";
    const imageUrl = getSocialImageUrl(job.data.user.profile_image);
    const pageUrl = `jobs/job-details/${id}/${jobTitle}`;

    return {
      title: `${title} - Blinkers`,
      description,
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
      title: "Product Details - Blinkers",
      description: "View product details on Blinkers",
    };
  }
}

const JobDetailsPage = () => {
  return <JobDetails />;
};

export default JobDetailsPage;
