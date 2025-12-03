import api from "@/lib/utils/apiClient";

export const jobTypeData = [
  {
    name: "on-site",
    value: "on-site",
  },
  {
    name: "hybrid",
    value: "hybrid",
  },
  {
    name: "remote",
    value: "remote",
  },
  {
    name: "other",
    value: "other",
  },
];

export const employmentTypeData = [
  {
    name: "full-time",
    value: "full-time",
  },
  {
    name: "part-time",
    value: "part-time",
  },
  {
    name: "contract",
    value: "contract",
  },
  {
    name: "other",
    value: "other",
  },
];

export const basicInfoApi = async (payload: FormData) => {
  return (
    await api.post("/users/update", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  )?.data;
};
export const ProfInfoApi = async (payload: FormData) => {
  return (
    await api.post("/applicants", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  )?.data;
};
export const getIndustries = async (search?: string) => {
  // Construct the URL dynamically based on whether page is provided
  const url = search
    ? `industries?per_page=${500}&search=${search}`
    : `industries?per_page=${500}`;
  // const url = `industries?per_page=${500}&search$=${search}`

  return (await api.get(url))?.data;
};


export const getAllJobs = async (page: number, search?: string | number) => {
  const url = search
    ? `jobs?page=${page}&search=${search}`
    : `jobs?page=${page}`;
  return (await api.get(url))?.data as JobResponse;
};