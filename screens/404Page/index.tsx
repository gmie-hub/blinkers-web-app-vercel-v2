import React from "react";
import styles from "./index.module.scss"; // Import SCSS styles
import {  Image } from "antd";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button/button";

const NotFound: React.FC = () => {
    const router =useRouter()
  return (
    <div className={styles.container}>
      <Image
        src='/404.svg'
        alt="Page404Image"
        className={styles.image}
        preview={false}
      />
      {/* <img src="/assets/404.png" alt="404 Not Found" className={styles.image} /> */}
      <h1 className={styles.title}>Oops! Page Not Found</h1>
      <p className={styles.text}>
        The page you’re looking for doesn’t exist or may have been moved. Please
        check the URL or return to the homepage to continue browsing.
      </p>
 
      <Button className={'buttonStyle'} onClick={()=>{router.push("/")}}  text="   Back to Homepage" />
    </div>
  );
};

export default NotFound;
