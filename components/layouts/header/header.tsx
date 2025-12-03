import { useEffect, useState } from "react";
import { Image, Modal, Dropdown, Menu } from "antd";
import Link from "next/link";
import styles from "./styles.module.scss";

import { userAtom } from "@/lib/utils/store";
import { useAtom } from "jotai";
import { logout } from "@/lib/utils/logout";
import { isCurrentDateGreaterThan } from "@/lib/utils";
import { jwtDecode } from "jwt-decode";

import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import SuccessModalContent from "@/components/partials/sucessModal";
import Button from "@/components/ui/button/button";
import { useRouter, usePathname } from "next/navigation";
import {
  getUserNotifications,
  ReadNotification,
} from "@/services/notificationServices";
import { getApplicantsbyId } from "@/services/applicantServices";
import CategoriesCard from "@/screens/home/category";

const Header = () => {
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] =
    useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [user] = useAtom(userAtom);
  const queryClient = useQueryClient();
  const token = user?.security_token;
  const [isLogout, setIsLogout] = useState(false);

  // const getRouteFromNotification = (value: string) => {
  //   const match = routeData.find((item) => item.value === value);
  //   return match?.route || "/"; // default to home if not matched
  // };

  const getRouteFromNotification = (notificationValue: string) => {
    const match = routeData.find((item) => item.value === notificationValue);

    if (match) {
      if (match.route === "/profile" && match.tabKey) {
        localStorage.setItem("activeTabKeyProfile", match.tabKey);
      }

      router.push(match.route);
    } else {
      console.warn("No matching route for notification:", notificationValue);
    }
  };

  const [getAllUserNotificationQuery, getProfileQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-all-notification"],
        queryFn: () => getUserNotifications(user?.id, 0),
        retry: 0,
        refetchOnWindowFocus: false,
      },
      {
        queryKey: ["get-profile"],
        queryFn: () => getApplicantsbyId(user?.id ?? 0),
        retry: 0,
        refetchOnWindowFocus: true,
        enabled: !!user?.id,
      },
    ],
  });

  const profileData = getProfileQuery?.data?.data;

  const notifyData = getAllUserNotificationQuery?.data?.data?.data;
  const notifyTotal = getAllUserNotificationQuery?.data?.data?.total;

  useEffect(() => {
    try {
      const decoded: any = jwtDecode(token!);
      const date = new Date(decoded.exp * 1000);
      const expDate = date?.toUTCString();
      if (isCurrentDateGreaterThan(expDate)) {
        logout();
      }
    } catch (error) {
      console.error("Invalid token", error);
    }
  }, [token]);

  const handleNavigateToLogin = () => {
    router.push("/login");
  };

  const handleNavigateToSell = () => {
    if (user?.role !== "2" && user?.business === null) {
      router.push("/seller-verification");
    } else if (
      profileData?.subscription?.pricing?.plan?.name?.toLowerCase() ===
        "free" ||
      profileData?.subscription?.is_active === 0
    ) {
      router.push("/pricing");
    } else {
      //  if (user?.role === "2" || user?.business !== null) {
      router.push("/create-ad");
    }
    // } else {
    //   navigate("/seller-verification");
    // }
  };

  const handleNavigateToProfile = () => {
    router.push("/profile");
  };

  const handleCategoryClick = () => {
    setIsCardVisible(!isCardVisible);
    setIsOpen(!isOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const profileMenu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => {
          setIsMenuOpen(false);
          handleNavigateToProfile();
        }}
      >
        View Profile
      </Menu.Item>
      <Menu.Item key="2" onClick={() => setIsLogout(true)}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const notificationMenu = (
    <Menu style={{ maxHeight: 250, overflowY: "auto", width: 300 }}>
      {notifyData && notifyData.length > 0 ? (
        <>
          {notifyData
            .slice(0, 5)
            .map((noty: NotificationDatum, index: number) => (
              <Menu.Item
                key={index}
                onClick={() => {
                  // navigate(`/notifications/${noty?.id}`);
                  // const route = getRouteFromNotification(noty?.notification?.route);
                  getRouteFromNotification(noty?.notification?.route);
                  readNotificationHandler(noty?.id);
                  setNotificationDropdownOpen(false);
                }}
              >
                {noty.title.length > 40
                  ? noty.title.slice(0, 40) + "..."
                  : noty.title}
              </Menu.Item>
            ))}
          {notifyData.length > 0 && (
            <Menu.Item
              key="footer"
              disabled
              style={{ cursor: "default", padding: "8px 12px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 500,
                }}
              >
                <span>Total: {notifyTotal}</span>
                <div
                  style={{ color: "#1890ff", cursor: "pointer" }}
                  onClick={() => {
                    router.push("/notifications");
                    // setNotificationDropdownOpen(false); // ✅ Close on "View All"
                  }}
                >
                  View All
                </div>
              </div>
            </Menu.Item>
          )}
        </>
      ) : (
        <>
          <Menu.Item disabled>No new notifications</Menu.Item>
          <Menu.Item>
            <span
              style={{ color: "#1890ff", cursor: "pointer" }}
              onClick={() => {
                setIsMenuOpen(false);

                router.push(`/notifications`);
                setNotificationDropdownOpen(false); // ✅ Close on fallback
              }}
            >
              View previous Notifications
            </span>
          </Menu.Item>
        </>
      )}
    </Menu>
  );

  const readNotificationMutation = useMutation({
    mutationFn: ReadNotification,
    mutationKey: ["read-notification"],
  });

  const readNotificationHandler = async (id: number) => {
    const payload = { ids: [id], user_id: user?.id };

    try {
      await readNotificationMutation.mutateAsync(payload, {
        onSuccess: () => {
          queryClient.refetchQueries({
            queryKey: ["get-all-notification"],
          });
        },
        onError: (error) => {
          console.error("Error reading notification", error);
        },
      });
    } catch (error) {
      console.error("Unexpected error", error);
    }
  };

  return (
    <nav className={styles.container}>
      <Image src="/Logo.svg" className={styles.logo} preview={false} />
      <button className={styles.menuButton} onClick={toggleMenu}>
        {isMenuOpen ? "✖" : "☰"}
      </button>

      <div
        className={`${styles.middleNav} ${isMenuOpen ? styles.showMenu : ""}`}
      >
        <Link
          onClick={() => setIsMenuOpen(false)}
          href="/"
          className={pathname === "/" ? styles.activeNavLink : styles.navLink}
        >
          Home
        </Link>

        <span className={styles.navLink} onClick={handleCategoryClick}>
          Categories
          <Image
            src="cat1.svg"
            alt="Toggle Icon"
            className={`${styles.icon} ${isOpen ? styles.rotate : ""}`}
            preview={false}
          />
        </span>

        {navItems.map((item) => (
          <Link
            onClick={() => setIsMenuOpen(false)}
            key={item.id}
            href={item.route}
            className={
              pathname === item.route ? styles.activeNavLink : styles.navLink
            }
          >
            {item.name}
          </Link>
        ))}

        {user?.email !== undefined && isMenuOpen && (
          <>
            <div className={styles.mobileButtonWrapper}>
              <div className={styles.loggedInIcons}>
                <Dropdown
                  overlay={notificationMenu}
                  trigger={["click"]}
                  // open={notificationDropdownOpen}
                  // onOpenChange={(flag) => setNotificationDropdownOpen(flag)}
                >
                  <div
                    className={styles.notificationWrapper}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src="/notyIcon.svg"
                      alt="Notifications"
                      // className={styles.chatIcon}
                    />
                    {notifyTotal > 0 && (
                      <span className={styles.notifyBadge}>
                        {notifyTotal}
                        {/* {notifyTotal > 10 ? "9+" : notifyTotal} */}
                      </span>
                    )}
                  </div>
                </Dropdown>

                {/* <img src={ChatIcon} alt="Messages" className={styles.chatIcon} /> */}
              </div>
              <Dropdown overlay={profileMenu} trigger={["click"]}>
                <img
                  src="/Avatarprofile.svg"
                  alt="profile"
                  className={styles.profileIcon}
                  style={{ cursor: "pointer" }}
                />
              </Dropdown>
              <Button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleNavigateToSell();
                }}
                // onClick={handleNavigateToSell}
                className={styles.btn}
              >
                Sell
              </Button>
            </div>
          </>
        )}
        {user?.email === undefined && isMenuOpen && (
          <div className={styles.mobileButtonWrapper}>
            <Button onClick={handleNavigateToLogin} className={styles.btn}>
              Get Started
            </Button>
          </div>
        )}
      </div>

      <div className={styles.rightNav}>
        {user?.email !== undefined ? (
          <div className={styles.loggedInIcons}>
            <Dropdown
              overlay={notificationMenu}
              trigger={["click"]}
              open={notificationDropdownOpen}
              onOpenChange={(flag) => setNotificationDropdownOpen(flag)}
            >
              <div
                className={styles.notificationWrapper}
                style={{ cursor: "pointer" }}
              >
                <img
                  src="/notyIcon.svg"
                  alt="Notifications"
                  className={styles.chatIcon}
                />
                {notifyTotal > 0 && (
                  <span className={styles.notifyBadge}>
                    {notifyTotal}
                    {/* {notifyTotal > 10 ? "9+" : notifyTotal} */}
                  </span>
                )}
              </div>
            </Dropdown>
            <img
              src="/chatyicon.svg"
              alt="Messages"
              className={styles.chatIcon}
            />
            <Dropdown overlay={profileMenu} trigger={["click"]}>
              <img
                src="/Avatarprofile.svg"
                alt="Profile"
                className={styles.profileIcon}
                style={{ cursor: "pointer" }}
              />
            </Dropdown>
            <Button
              onClick={handleNavigateToSell}
              className={`${styles.btn} ${styles.sellButton}`}
            >
              Sell
            </Button>
          </div>
        ) : (
          <Button onClick={handleNavigateToLogin} className={styles.btn}>
            Get Started
          </Button>
        )}
      </div>

      <Modal
        open={isCardVisible}
        onCancel={handleCategoryClick}
        footer={null}
        closable={false}
        centered
        width={1300}
        style={{ top: "40px" }}
        bodyStyle={{ paddingBlockStart: "5px" }}
      >
        <CategoriesCard handleClose={() => setIsCardVisible(false)} />
      </Modal>

      <SuccessModalContent
        openSuccess={isLogout}
        message="Are You Sure You Want to Log Out?"
        text="Your login  credentials (Email and Password)  will be required to access your account again."
        onClose={() => setIsLogout(false)}
        buttonText="Yes, Logout"
        show2Button={true}
        showButton={false}
        // Icon={LogoutIconBig}
        handleClick={logout}
        showIcon={true}
        variant="red"
      />
    </nav>
  );
};

const navItems = [
  { id: 1, name: "Market", route: "/product-listing" },

  // { id: 1, name: "Market", route: "/market" },
  { id: 2, name: "Directory", route: "/directory" },
  { id: 3, name: "Jobs", route: "/jobs" },
  { id: 4, name: "Pricing", route: "/pricing" },
  { id: 5, name: "About Us", route: "/about-us" },
  { id: 6, name: "Contact Us", route: "/contact-us" },
  { id: 7, name: "FAQ", route: "/faq" },
];

export default Header;

const routeData = [
  { name: "HOME PAGE", value: "home_page", route: "/" },
  // { name: "ALL ADS", value: "all_ads", route: "/market" },
  { name: "ALL ADS", value: "all_ads", route: "/product-listing" },

  { name: "POST ADS", value: "post_ads", route: "/create-ad" },
  {
    name: "REGISTER AS SELLER",
    value: "register_as_seller",
    route: "/seller-signUp",
  },

  // Profile Tabs
  { name: "MY ADS", value: "my_ads", route: "/profile", tabKey: "7" },
  { name: "MY FAVORITE", value: "my_favorite", route: "/profile", tabKey: "8" },
  {
    name: "MY APPLICANT PROFILE",
    value: "my_applicant_profile",
    route: "/profile",
    tabKey: "1",
  },
  {
    name: "MY JOBS SELLER",
    value: "my_jobs_seller",
    route: "/profile",
    tabKey: "6",
  },
  {
    name: "MY JOBS BUSINESS OWNER",
    value: "my_jobs_business_owner",
    route: "/profile",
    tabKey: "6",
  },
  {
    name: "MY BUSINESS PROFILE",
    value: "my_business_profile",
    route: "/profile",
    tabKey: "2",
  },
  { name: "MY PROFILE", value: "my_profile", route: "/profile", tabKey: "1" },
  { name: "EDIT JOB", value: "edit_job", route: "/profile", tabKey: "6" },

  // Others
  { name: "REVIEWS", value: "reviews", route: "/reviews" },
  { name: "AUDIENCE", value: "audience", route: "/audience" },
  { name: "MY PLAN", value: "my_plan", route: "/plans" },
  { name: "CHAT", value: "chat", route: "/chat" },
  {
    name: "VIEW APPLICANTS",
    value: "view_applicants",
    route: "/jobs/applicants",
  },
  { name: "CATEGORIES PAGE", value: "categories_page", route: "/categories" },

  { name: "POST A JOB", value: "post_a_job", route: "/post-job" },
  {
    name: "REGISTER AS APPLICANT",
    value: "register_as_applicant",
    route: "/job/register-as-applicant",
  },
  {
    name: "CREATE BUSINESS",
    value: "create_business",
    route: "/job/add-business",
  },
  {
    name: "DIRECTORY HOMEPAGE",
    value: "directory_homepage",
    route: "/directory",
  },
  { name: "JOB HOMEPAGE", value: "job_homepage", route: "/jobs" },
  { name: "HELP", value: "help", route: "/contact-us" },
];
