import JobDetails from "@/screens/job/jobDetails/jobDetails";
import { getJobDetails } from "@/services/jobServices";

import { Metadata, ResolvingMetadata } from "next";

export async function generateMetadata(
  props: { params: Promise<{ id: number }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  // fetch data
  const job = await getJobDetails(params.id);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: job?.data.title,
    description: job?.data.description,
    openGraph: {
      images: [job?.data?.business?.logo ?? "", ...previousImages],
    },
  };
}

const JobDetailsPage = () => {
  return <JobDetails />;
};

export default JobDetailsPage;