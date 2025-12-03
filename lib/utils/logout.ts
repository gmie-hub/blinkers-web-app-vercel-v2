export const logout = () => {
  localStorage.removeItem("skill-data");
  localStorage.removeItem("education-info");
  localStorage.removeItem("employment-History");
  localStorage.removeItem("basic-info");
  localStorage.removeItem("link-data");
  localStorage.removeItem("blinkers-web&site#");
  localStorage.removeItem("activeTabKeyProfile");
  localStorage.removeItem("activeTabKeyBasicInfo");



  window.location.href = "/";
};
