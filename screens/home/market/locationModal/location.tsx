import { useState } from "react";
import styles from "./index.module.scss";
import { useQueries } from "@tanstack/react-query";
import { App } from "antd";
import CustomSpin from "@/components/ui/spin";
import { getAllState, getLGAbyStateId } from "@/services/locationServices";

interface Props {
  handleClose: () => void;
}

const LocationModal = ({ handleClose }: Props) => {
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [activeState, setActiveState] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [statesQuery, lgaQuery] = useQueries({
    queries: [
      {
        queryKey: ["states"],
        queryFn: getAllState,
      },
      {
        queryKey: ["lgas", activeState?.id],
        queryFn: () => getLGAbyStateId(activeState!.id),
        enabled: !!activeState?.id,
      },
    ],
  });

  const states = statesQuery?.data?.data?.data ?? [];
  const lgas = lgaQuery?.data?.data?.data ?? [];

  const filteredStates = states?.filter((s: any) =>
    s?.state_name?.toLowerCase()?.includes(search?.toLowerCase())
  );

  const filteredLGAs = lgas?.filter((l: any) =>
    l?.local_government_area?.toLowerCase()?.includes(search?.toLowerCase())
  );

  const handleCloseModal = () => {
    setActiveState(null); // 👈 RESET HERE
    handleClose();
  };

  const handleSelectState = (state: any) => {
    setActiveState({ id: state.id, name: state.state_name });
    setSearch("");
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      notification.error({
        title: "Error",
        description: "Geolocation is not supported on this device.",
      });
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const data = await res.json();

          const detectedState = data?.principalSubdivision;
          const detectedLGA = data?.locality;

          if (!detectedState) {
            notification.error({
              title: "Error",
              description: "Unable to detect your state. Try again.",
            });
            setLoading(false);
            return;
          }

          const stateObj = states.find(
            (s: any) =>
              s.state_name.toLowerCase() === detectedState.toLowerCase()
          );

          if (!stateObj) {
            notification.error({
              title: "Error",
              description: "Your state is not supported.",
            });
            setLoading(false);
            return;
          }
          console.log("Detected:", detectedState, detectedLGA);

          localStorage.setItem(
            "userLocation",
            JSON.stringify({
              state: detectedState,
              lga: detectedLGA || null,
            })
          );

          setActiveState({ id: stateObj.id, name: stateObj.state_name });

          // Wait briefly for LGAs to load
          setTimeout(() => {
            if (!detectedLGA) return;

            const foundLGA = lgas.find((l: any) =>
              l.local_government_area
                .toLowerCase()
                .includes(detectedLGA.toLowerCase())
            );

            if (foundLGA) {
              handleCloseModal(); // close modal after selecting
            }
          }, 600);

          handleCloseModal();
        } catch (err) {
          console.error("Location error:", err);
          notification.error({
            title: "Error",
            description: "Unable to detect your location.",
          });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        // notification.error({
        //   message: "Error",
        //   description: "Failed to access location. Please enable GPS.",
        // });
        setLoading(false);
      }
    );
  };

  const handleSelectLGA = (lga: any) => {
    const selectedLocation = {
      state: activeState?.name,
      stateId: activeState?.id,
      lga: lga.local_government_area,
      lgaId: lga?.id,
    };

    localStorage.setItem("userLocation", JSON.stringify(selectedLocation));

    console.log("Saved to localStorage:", selectedLocation);

    handleCloseModal();
  };

  return (
    <div className={styles.container}>
      {/* Back button */}
      {activeState && (
        <button className={styles.backBtn} onClick={() => setActiveState(null)}>
          ← Back
        </button>
      )}

      {/* Page Title */}
      <div className={styles.headerRow}>
        <h3 className={styles.header}>
          {activeState ? `All ${activeState.name} (LGAs)` : "My Location"}
        </h3>

        <div className={styles.searchWrapper}>
          <img src="/Search.svg" alt="search" className={styles.searchIcon} />

          <input
            className={styles.search}
            placeholder="Find state, city or region…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tap to find my location --- show ONLY on page 1 */}
      {!activeState && (
        <div className={styles.myLocationBox} onClick={handleMyLocation}>
          <div className={styles.left}>
            {/* <span className={styles.icon}>📍</span> */}
            <img
              src="/locationrelated.svg"
              alt="LocationIcon"
              className={styles.icon}
            />

            {/* <div className={styles.texts}>
              <p className={styles.main}>My Location</p>
              <p className={styles.sub}>Tap to find location</p>
            </div> */}
            <div className={styles.texts}>
              <p className={styles.main}>
                {loading ? <CustomSpin /> : "My Location"}
              </p>
              <p className={styles.sub}>
                {loading ? "Searching..." : "Tap to find location"}
              </p>
            </div>
          </div>
          <span className={styles.arrow}>›</span>
        </div>
      )}

      {/* STATES PAGE */}
      {!activeState && (
        <div className={styles.listWrapper}>
          {/* First option */}
          <div
            className={styles.itemBox}
            onClick={() => {
              const selectedLocation = {
                state: "All Nigeria",
                stateId: 0,
                lga: "All Nigeria",
                lgaId: 0,
              };

              localStorage.setItem(
                "userLocation",
                JSON.stringify(selectedLocation)
              );

              console.log("Saved to localStorage:", selectedLocation);

              handleCloseModal(); // closes modal + resets state
            }}
          >
            <span className={styles.itemText}>All Nigeria</span>
            <span className={styles.arrow}>›</span>
          </div>

          {/* Existing mapped options */}
          {filteredStates.map((item: any) => (
            <div
              key={item.id}
              className={styles.itemBox}
              onClick={() => handleSelectState(item)}
            >
              <span className={styles.itemText}>{item.state_name}</span>
              <span className={styles.arrow}>›</span>
            </div>
          ))}
        </div>
      )}

      {/* LGAs PAGE */}
      {activeState && (
        <div className={styles.listWrapper}>
          {filteredLGAs.map((item: any) => (
            <div
              key={item.id}
              className={styles.itemBox}
              onClick={() => handleSelectLGA(item)}
            >
              <span className={styles.itemText}>
                {item.local_government_area}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationModal;
