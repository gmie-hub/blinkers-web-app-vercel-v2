// utils/location.ts
export const getCityAndState = async (): Promise<{ city?: string; state?: string }> => {
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
  
            resolve({
              city: data.address.city || data.address.town || data.address.village,
              state: data.address.state,
            });
          } catch (err) {
            reject("Failed to fetch location details");
          }
        },
        (err) => reject(err.message)
      );
    });
  };
  