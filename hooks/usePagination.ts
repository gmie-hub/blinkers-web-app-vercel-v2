"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const usePagination = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!searchParams) {
    return {
      currentPage: 1,
      setCurrentPage: () => {},
      onChange: () => {},
      pageNum: 1,
    };
  }

  const pageNum = parseInt(searchParams.get("pageNum") || "1", 10);

  const onChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("pageNum", page.toString());
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo(0, 0);
  };
  
  return { currentPage: pageNum, setCurrentPage: onChange, onChange, pageNum };
};

export default usePagination;

