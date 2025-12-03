"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const usePagination = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageNum = parseInt(searchParams.get("pageNum") || "1", 10);

  const onChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("pageNum", page.toString());
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo(0, 0);
  };
  
  // To maintain some backward compatibility with the old return signature,
  // we can provide a 'setCurrentPage' that is just an alias for 'onChange'.
  // 'currentPage' is now just 'pageNum'.
  return { currentPage: pageNum, setCurrentPage: onChange, onChange, pageNum };
};

export default usePagination;

