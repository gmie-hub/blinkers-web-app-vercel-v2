import { useState, useEffect } from "react";
import styles from "./index.module.scss";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Modal } from "antd";
// import CategoriesCard from "../category";
import LocationModal from "../market/locationModal/location";
import SearchInput from "@/components/ui/searchInput";
import Button from "@/components/ui/button/button";
import { useRouter } from "next/navigation";
import { getCityAndState } from "@/lib/utils/location";

// Background images
const images = ["/Component-5.svg", "/Component-6.svg", "/homeImage3.svg"];

const PictureBg = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [openLocationModal, setOpenLocationModal] = useState(false);
  const [savedLocation, setSavedLocation] = useState<any>(null);

   const [location, setLocation] = useState<{ city?: string; state?: string ,lga?:string}>(
    {}
  );
 
   useEffect(() => {
    (async () => {
      try {
        const loc = await getCityAndState();
        setLocation(loc);
      } catch (err: any) {
        // notification.error({
        //   message: "Error",
        //   description: err || "Failed to access location. Please enable GPS.",
        // });
      }
    })();
  }, []);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLoc = JSON.parse(localStorage.getItem("userLocation") || "{}");
      setSavedLocation(savedLoc);
    }
  }, []);

  // Next image
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Previous image
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Auto slide
  useEffect(() => {
    const interval = setInterval(handleNextImage, 5000);
    return () => clearInterval(interval);
  }, []);

  // Pagination dot click
  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Search input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Search navigation
  const handleSearch = () => {
    router.push(`/product-listing/${searchTerm}`);
  };

  const handleNavigateToMarket = () => {
    router.push("/product-listing");
  };

  return (
    <div
      className={styles.image}
      style={{
        backgroundImage: `url(${images[currentImageIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className={styles.home}>
        <p className={styles.picHead}>Buy, Sell and Find Just About Anything</p>
        <p className={styles.picPara}>
          Whether you're local or international, explore boundless opportunities
          on one platform
        </p>

        {/* --- SEARCH BAR SECTION --- */}
        <div className={styles.searchBarContainer}>
          {/* Location Box */}
          <div
            className={styles.locationBox}
            onClick={() => setOpenLocationModal(true)}
          >
   
              <img src="/location.svg" className={styles.locIcon} />
              <span style={{ color: "black", fontSize: "20px" }}>
              {savedLocation?.lga ? savedLocation?.lga : location?.lga ? location?.lga : "Select Location"}
              </span>
    

            <span className={styles.arrowDown}>▼</span>
          </div>

          {/* Search Input */}
          <div className={styles.searchInputBox}>
            <SearchInput
              placeholder="What are you looking for?"
              onChange={handleInputChange}
            />
          </div>

          {/* Search Button */}
             <Button
                type="button"
                variant="green"
                text="Search"
                className={styles.searchBtn}
                onClick={handleSearch} // Set appliedSearchTerm here
              />
        </div>
        <br />

        {/* CTA Button */}
        <Button
          onClick={handleNavigateToMarket}
          text="Shop Now"
          className="buttonStyle"
        />

        {/* Dot Pagination */}
        <div className={styles.dotPagination}>
          {images.map((_, index) => (
            <span
              key={index}
              className={`${styles.dot} ${
                currentImageIndex === index ? styles.activeDot : ""
              }`}
              onClick={() => handleDotClick(index)}
            ></span>
          ))}
        </div>
      </div>

      {/* Left Arrow */}
      <div className={styles.leftArrow} onClick={handlePrevImage}>
        <LeftOutlined style={{ fontSize: "2rem", color: "#fff" }} />
      </div>

      {/* Right Arrow */}
      <div className={styles.rightArrow} onClick={handleNextImage}>
        <RightOutlined style={{ fontSize: "2rem", color: "#fff" }} />
      </div>

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

export default PictureBg;
