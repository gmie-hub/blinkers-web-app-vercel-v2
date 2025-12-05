import Icon from "/Container.svg";
import styles from "./styles.module.scss";
import { useState } from "react";
import { Tabs, TabsProps } from "antd";
import MyBusinesses from "./myBusinesses";
import { useParams } from "react-router-dom";
import MyApplications from "./myApplication/myApplications";
import MyDetails from "../job/apply/applyAsApplicant/index";

import ProfileDetails from "./profileDetails/profileDetails";
import MyAds from "./myAds/myAds";
import MyFavorite from "./myFavorite";
// import Notification from "../notification";
import JobPosted from "./businessInformation/postedJob/postedJob";
import SubscriptionCard from "./subscription/sub";

const Profile = () => {
  const { id } = useParams();
  const [activeKey, setActiveKey] = useState(() => {
    // If id is available, use it; otherwise, fallback to localStorage or "1"
    return id || localStorage.getItem("activeTabKeyProfile") || "1";
  });


  // Update localStorage whenever the active key changes
//   useEffect(() => {
//     localStorage.setItem("activeTabKeyProfile", activeKey);
//   }, [activeKey]);



//do not change the key, if you want to add new tab give it another number not exisitng number
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Profile Details",
      children: <ProfileDetails />,
    },
    {
      key: "2",
      label: "My Businesses",
      children: <MyBusinesses />,
    },
    {
      key: "3",
      label: "My Subscription",
      children: <SubscriptionCard />,
    },
    {
      key: "4",
      label: "My Applications",
      children: <MyApplications />,
    },
    {
      key: "5",
      label: "My Application Details",
      children: <MyDetails  showRouteIndicator={false}/>,
    },
    {
      key: "6",
      label: "Posted Job",
      children: <JobPosted />,
    },
    {
      key: "7",
      label: "My Ads",
      children: <MyAds />,
    },
    {
      key: "8",
      label: "Favorites",
      children: <MyFavorite />,
      // children: <Reviews />,

      
    },
    // {
    //   key: "9",
    //   label: "Notifications",
    //   children: <Notification  />,
    // },
    // {
    //   key: "10",
    //   label: "Settings",
    //   // children: <Reviews limit={3} />,
    // },
  ];

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    localStorage.setItem("activeTabKeyProfile", key);


  };

  return (
    <>
      <div className="wrapper">
        <div className={styles.container}>
          <div
            className={styles.image}
            style={{
              backgroundImage: `url(${Icon})`, // Ensure you use the correct image reference
            }}
          >
            <div className={styles.home}>
              <p className={styles.picHead}>Profile</p>
            </div>
          </div>
        </div>

        <div>
          <Tabs
            className={styles.tabs}
            activeKey={activeKey} // Use the activeKey from state
            onChange={handleTabChange}
            items={items}
          />
        </div>
      </div>
    </>
  );
};

export default Profile;
