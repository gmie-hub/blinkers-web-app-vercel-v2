
export const getCityAndState = async (): Promise<{ 
  city?: string; 
  state?: string;
  lga?: string;
}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          const address = data?.address || {};

          resolve({
            city:
              address.city ||
              address.town ||
              address.village ||
              address.hamlet ||
              address.municipality ||
              address.county,
            state: address.state,
            lga:
              address.county ||
              address.state_district ||
              address.region ||
              address.city_district,
          });
        } catch (err) {
          reject("Failed to fetch location details");
        }
      },
      (err) => reject(err.message)
    );
  });
};
