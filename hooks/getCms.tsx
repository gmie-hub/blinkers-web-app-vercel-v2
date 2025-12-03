// hooks/useJobDetails.ts
import { getAllCms } from "@/services/cmsServices";
import { useQuery } from "@tanstack/react-query";

export const useCms = () => {
  return useQuery({
    queryKey: ["get-cms", ],
    queryFn: () => getAllCms(),
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
