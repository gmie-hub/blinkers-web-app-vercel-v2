import { useCallback, useState } from "react";
import { Steps } from "antd";
import styles from "./styles.module.scss";
import Card from "../../../../customs/card/card";
import RouteIndicator from "../../../../customs/routeIndicator";
import BasicInfoForm from "./forms/basicInfo";
import ProfInfoForm from "./forms/profInfo";
import { useQueries } from "@tanstack/react-query";
import { getApplicantsbyId } from "../../../request";
import { userAtom } from "../../../../utils/store";
import { useAtomValue } from "jotai";
import { AxiosError } from "axios";
import CustomSpin from "../../../../customs/spin";

interface ApplyAsApplicantProps {
  showRouteIndicator?: boolean;
}

const ApplyAsApplicant = ({ showRouteIndicator =true}: ApplyAsApplicantProps) => {
  const [displayForm, setDisplayForm] = useState(false);
  const [current, setCurrent] = useState(0);
  const user = useAtomValue(userAtom);

  const { Step } = Steps;

  const next = useCallback(() => {
    setCurrent(current + 1);
    setDisplayForm((prevState) => !prevState);
    window.scroll(0, 0);
  }, [current]);

  const prev = useCallback(() => {
    setCurrent(current - 1);
    setDisplayForm((prevState) => !prevState);
    window.scroll(0, 0);
  }, [current]);

  const [getApplicantQuery] = useQueries({
    queries: [
      {
        queryKey: ["get-applicant"],
        queryFn: () => getApplicantsbyId(user?.id!),
        retry: 0,
        refetchOnWindowFocus: false,
        enabled:!!user?.id
      },
    ],
  });

  const applicantDetailsData = getApplicantQuery?.data?.data;
  const applicantDetailsError = getApplicantQuery?.error as AxiosError;
  const applicantDetailsErrorMessage =
    applicantDetailsError?.message ||
    "An error occurred. Please try again later.";

  return (
    <div className="wrapper">
      {showRouteIndicator && <RouteIndicator showBack={true} />}

      <div className={styles.wrapper}>
        {getApplicantQuery?.isLoading ? (
          <CustomSpin />
        ) : getApplicantQuery?.isError ? (
          <h1 className="error">{applicantDetailsErrorMessage}</h1>
        ) : (
          <Card style={styles.card}>
            <section className={styles.textContainer}>
              <div>
                <p>Register As An Applicant</p>
                <p>
                  Fill the form and save your details for future job
                  applications. Your basic info is pre-filled, just complete
                  your professional details to finish your applicant profile.
                </p>
              </div>

              <Steps current={current} labelPlacement="vertical" responsive>
                <Step
                  title="Basic Information"
                  icon={
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        background:
                          current >= 0
                            ? "linear-gradient(180deg, #009900 0%, #2fce2f 100%)"
                            : "#e0e0e0",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2rem",
                      }}
                    >
                      1
                    </div>
                  }
                />
                <Step
                  title="Professional Information"
                  icon={
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        background:
                          current >= 1
                            ? "linear-gradient(180deg, #009900 0%, #2fce2f 100%)"
                            : "#e0e0e0",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2rem",
                      }}
                    >
                      2
                    </div>
                  }
                />
              </Steps>
            </section>

            {!displayForm ? (
              <BasicInfoForm
                handleNext={next}
                applicantDetailsData={applicantDetailsData}
              />
            ) : (
              <ProfInfoForm onPrev={prev} />
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export default ApplyAsApplicant;
