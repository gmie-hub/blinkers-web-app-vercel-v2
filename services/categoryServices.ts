import api from "@/lib/utils/apiClient";

export const getSubCategory = async (id: number) => {
  return (await api.get(`categories/sub?category_id=${id}&per_page=${500}`))
    ?.data as CategoryResponse;
};

export const getSpecSubCategory = async (id: number) => {
  return (await api.get(`categories/sub?id=${id}`))
    ?.data as CategoryResponse;
};

export const getAllCategory = async (search?: string | number) => {
  const url = search
    ? `categories?search=${search}&per_page=${500}`
    : `categories?per_page=${500}`;
  return (await api.get(url))?.data as CategoryResponse;
};