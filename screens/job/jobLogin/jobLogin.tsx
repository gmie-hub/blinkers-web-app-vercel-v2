import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";
import Button from "../../../customs/button/button";
import JobImage from "../../../assets/image 39.svg";

interface Props {
  handleCloseModal: () => void;
}

const JobWelcome = ({handleCloseModal}:Props) => {
  const navigate = useNavigate();
  const currentPath = location.pathname;

  return (
    <div className={styles.container}>
      
      <img src={JobImage} alt="DirectoryImage" />

      <h2 className={styles.title}>Welcome To Blinkers Job Portal</h2>
      <p className={styles.subtitle}>
      Discover job opportunities, register as an applicant, post jobs and access our applicants pool. Log in or sign up to continue
      </p>

      <div className={styles.noticeBox}>
        <span className={styles.warningIcon}>⚠️</span>

        <p>
        After logging in, you can access the job portal from this job page from the Top navigation bar
        </p>
      </div>

      <Button
        onClick={() => {
          navigate(`/login?redirect=${currentPath}`);
        }}
        type="button"
      >
        {" "}
        Login
      </Button>
      <br />
      <br />

      <Button
      variant="greenOutline"
        onClick={() => navigate("/sign-up")}
      >
        Sign Up
      </Button>
    

      <p className={styles.guestLink} onClick={handleCloseModal}>
        Continue As A Guest
      </p>
    </div>
  );
};

export default JobWelcome;
