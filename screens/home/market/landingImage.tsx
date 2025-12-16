import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import ProductSection from "./page";
import { useParams } from "next/navigation";
import SearchInput from "@/components/ui/searchInput";
import Button from "@/components/ui/button/button";
import { getCityAndState } from "@/lib/utils/location";
import { Modal } from "antd";
import LocationModal from "./locationModal/location";

const Market = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const params = useParams();
  const search = params.search as string;
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(search || "");
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [childData, setChildData] = useState<any>(null); // store data from child

  const [location, setLocation] = useState<{
    city?: string;
    state?: string;
    lga?: string;
  }>({});
  const [savedLocation, setSavedLocation] = useState<any>({});

  useEffect(() => {
    (async () => {
      try {
        const loc = await getCityAndState();
        setLocation(loc);
      } catch (err: any) {
        console.log(err);
      }
    })();

    if (typeof window !== "undefined") {
      const item = localStorage.getItem("userLocation");
      if (item) {
        setSavedLocation(JSON.parse(item));
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Update the search query state
  };

  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm); // Update appliedSearchTerm only on button click
    // setSearchTerm('')
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.image}
        style={{
          backgroundImage: `url(/Container.svg)`, // Ensure you use the correct image reference
        }}
      >
        <div className={styles.home}>
          <p className={styles.picHead}>Market</p>
          <p className={styles.picPara}>
            Explore the marketplace to discover products and services
          </p>

          <div className={styles.searchBarContainer}>
            {/* Location Box */}
            <div
              className={styles.locationBox}
              onClick={() => setOpenLocationModal(true)}
            >
              <div>
                <img src="/location.svg" className={styles.locIcon} />
                <span style={{ color: "black", fontSize: "20px" }}>
                  {savedLocation?.lga
                    ? savedLocation?.lga
                    : location?.lga
                    ? location?.lga
                    : "Select Location"}
                </span>
              </div>

              <span className={styles.arrowDown}>▼</span>
            </div>

            {/* Search Input */}

            <div className={styles.searchInputBox}>
              <SearchInput
                placeholder="What are you looking for?"
                // width="40rem"
                // isBtn={true}
                onChange={handleInputChange}
                value={searchTerm}
              >
                <Button
                  type="button"
                  variant="green"
                  text="Search"
                  className={styles.searchBtn}
                  onClick={handleSearch} // Set appliedSearchTerm here
                />
              </SearchInput>
            </div>
          </div>
        </div>
      </div>

      <ProductSection
        appliedSearchTerm={appliedSearchTerm}
        setAppliedSearchTerm={setAppliedSearchTerm}
        savedLocationFromChild={(data: any) => setChildData(data)} // <-- callback
      />

      {/* LOCATION MODAL */}
      <Modal
        open={openLocationModal}
        onCancel={() => setOpenLocationModal(false)}
        footer={null}
        centered
        width={1300}
      >
        <LocationModal handleClose={() => setOpenLocationModal(false)} />
      </Modal>
    </div>
  );
};

export default Market;
