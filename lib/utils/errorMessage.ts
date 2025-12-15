export const errorMessage = (error: any) => {
  const responseError = error?.response?.data?.error;

  // Collect messages when the API returns an error object (e.g., field -> messages[])
  const errorMessages =
    responseError && typeof responseError === "object"
      ? Object.values(responseError).flat()
      : [];

  // Prefer collected messages, otherwise fall back through common locations.
  return errorMessages.length
    ? errorMessages
    : error?.response?.data?.error ||
        error?.response?.data?.error?.[0] ||
        error?.response?.data?.message ||
        error?.response?.data?.Message ||
        error?.Message ||
        error?.response?.data?.title ||
        error?.message;
};
