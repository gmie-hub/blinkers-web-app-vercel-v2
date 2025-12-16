import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import { Tabs, TabsProps } from "antd";
import MyBusinesses from "./myBusinesses";
import MyApplications from "./myApplication/myApplications";
import MyDetails from "../job/apply/applyAsApplicant/index";

import ProfileDetails from "./profileDetails/profileDetails";
import MyAds from "./myAds/myAds";
import MyFavorite from "./myFavorite";
// import Notification from "../notification";
import JobPosted from "./businessInformation/postedJob/postedJob";
import SubscriptionCard from "./subscription/sub";
import { useParams } from "next/navigation";

const Profile = () => {
  const params = useParams();
  const id = params.id as string;
  const [activeKey, setActiveKey] = useState("1");

  useEffect(() => {
    if (id) {
      setActiveKey(id);
    } else {
      const savedKey = localStorage.getItem("activeTabKeyProfile");
      if (savedKey) {
        setActiveKey(savedKey);
      }
    }
  }, [id]);

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
      children: <MyDetails showRouteIndicator={false} />,
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
              backgroundImage: "url(/Container.svg)", // Ensure you use the correct image reference
            }}
          >
            <div className={styles.home}>
              <p className={styles.picHead}>My Profile</p>
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
