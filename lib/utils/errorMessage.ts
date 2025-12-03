export const errorMessage = (error: any) => {
  const errorMessages = Object.values(error?.response?.data?.error).flat(); // Flatten any nested arrays
  // .join(", ");

  return typeof error === "object"
    ? errorMessages
    : error?.response?.data?.error ||
        error?.response?.data?.error[0] ||
        error?.response?.data?.message ||
        error?.response?.data?.Message ||
        error?.Message ||
        error?.response?.data?.title ||
        error?.message;
};
