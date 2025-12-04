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
export const ApplyForJobApi = async (payload: Partial<FlagJob>) => {
  return (await api.post("/jobs/application", payload))?.data as Response;
};


export const getFlaggedJobByJob_idUser_id = async (
  job_id: number,
  user_id: number
) => {
  return (await api.get(`jobs/flag?job_id=${job_id}&user_id=${user_id}`))
    ?.data ;
};

export const getJobDetails = async (id: number) => {
  return (await api.get(`jobs/${id}`))?.data as JobDetailsResponse;
};

export const getForYouJobs = async (page?: number) => {
  const url = `jobs?page=${page}&for_applicant=${true}`;
   return (await api.get(url))?.data as JobResponse;
 };
 export const getPopularJobs = async (page?: number) => {
 const url = `jobs?page=${page}&popular=${true}`;
  return (await api.get(url))?.data as JobResponse;
};


export const createBusiness = async (payload: FormData) => {
  return (
    await api.post("/businesses", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  )?.data;
};
export const LevelData = [
  {
    name: "intern",
    value: "intern",
  },
  {
    name: "beginner",
    value: "beginner",
  },
  {
    name: "junior",
    value: "junior",
  },
  {
    name: "mid-level",
    value: "mid-level",
  },
  {
    name: "senior",
    value: "senior",
  },
];
export const UpdateJob = async (payload: Partial<JobDatum>) => {
  return (await api.patch(`jobs/${payload.id}`, payload, {}))?.data as Response;
};

export const CreateJob = async (payload: Partial<JobDatum>) => {
  return (await api.post("jobs", payload, {}))?.data ;
};

export const FlagJobApi = async (payload: Partial<FlagJob>) => {
  return (await api.post("/jobs/flag/toggle", payload))?.data as Response;
};
