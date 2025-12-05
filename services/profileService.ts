import api from "@/lib/utils/apiClient";

export const updateApplicationStatus = async (
  payload: ApplicationStatusPayload,
  id: number
) => {
  const response = await api.patch(`jobs/application/${id}`, payload);
  return response.data;
};

export const getApplicationDetails = async (id: number) => {
  return (await api.get(`jobs/application/${id}`))?.data as ApplicantResponse;
};


export const getAllApplication = async (
  page: number,
  job_id: number,
  status: number
) => {
  return (
    await api.get(
      `jobs/application?page=${page}&job_id=${job_id}&status=${status}`
    )
  )?.data ;
};

export const deleteJob = async ({ id }: { id: number }) => {
  return (await api.delete(`jobs/${id}`))?.data as JobDatum;
};
export const getJobBYBusinessId = async (id: number) => {
  return (await api.get(`jobs?user_id=${id}`))?.data as JobResponse;
};

export const replyReview = async (
  payload: ReplyReviewPayload,
  id: number
) => {
  const response = await api.patch(`/business/reviews/${id}`, payload);
  return response.data;
};
export const getAllReviews = async (id: string, page?: number) => {
  const url = page
    ? `business/reviews?business_id=${id}&page=${page}&per_page=${5}`
    : `business/reviews?business_id=${id}&per_page=${5}`;

  return (await api.get(url))?.data as ReviewResponse;
};
export const uploadGallery = async (payload: FormData) => {
  return (
    await api.post("businesses/gallery", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  )?.data;
};

export const deleteGalarybyId = async ({
  business_id,
  ids,
}: {
  business_id: number | string;
  ids: number[];
}) => {
  return (
    await api.delete(`businesses/gallery`, {
      data: {
        business_id, // Sending business_id and ids in the body
        ids,
      },
    })
  )?.data ;
};
export const CreateBusinessHourApi = async (
  payload: Partial<BusinessHourDatum>
) => {
  return (await api.post("businesses/hours", payload, {}))?.data as Response;
};

export const getAllSubscriptionById = async (id: number) => {
  return (await api.get(`plans/${id}`))?.data as PlanDatumResponse;
};


export const UpdateAds = async (id: string | number, payload: FormData) => {
  return (
    await api.post(`ads/${id}`, payload, {
      // headers: { "Content-Type": "multipart/form-data" },
    })
  )?.data as Response;
};

export const createAds = async (payload: FormData) => {
  return (
    await api.post("/ads", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  )?.data;
};

export const deleteAdsGalarybyId = async ({
  add_id,
  image_ids,
}: {
  add_id: number | string;
  image_ids: number[];
}) => {
  return (
    await api.delete(`ads/image`, {
      data: {
        add_id, // Sending business_id and ids in the body
        image_ids,
      },
    })
  )?.data ;
};

export const deleteAdsVideobyId = async ({
  add_id,
  video_ids,
}: {
  add_id: number | string;
  video_ids: number[];
}) => {
  return (
    await api.delete(`ads/video`, {
      data: {
        add_id, // Sending business_id and ids in the body
        video_ids,
      },
    })
  )?.data ;
};
export const uploadAdsGallery = async (payload: FormData) => {
  return (
    await api.post("ads/image", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  )?.data;
};
export const uploadAdsVideo = async (payload: FormData) => {
  return (
    await api.post("ads/video", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  )?.data;
};
export const getMyAdzByUserId = async (user_id?: number, status?:number) => {
  return (await api.get(`/ads?per_page=${30}&user_id=${user_id}&status=${status}`))?.data ;
};
export const updateAdsStatus = async (
  payload: AdsStatusPayload,
  id: number
) => {
  const response = await api.patch(`/ads/${id}`, payload);
  return response.data;
};
export const getMyApplicationDetails = async (id: number) => {
  return (await api.get(`jobs/application/${id}`))
    ?.data as ApplicDetailsResponse;
};

export const getMyApplications = async (
  page: number,
  applicantId: number,
  status: number
) => {
  return (
    await api.get(
      `jobs/application?page=${page}&applicant_id=${applicantId}&status=${status}`
    )
  )?.data as ApplicantResponse;
};
export const getAllSubscriptionbyId = async (id:number) => {
  return (await api.get(`plans/${id}`))?.data as any;
};


export const deleteUser = async () => {
  return (await api.delete(`/users/delete`))?.data;
};



export const changePassword = async (payload: Partial<ChangePassword>) => {
  return (await api.patch(`users/change-password`, payload, {}))
    ?.data as Response;
};
