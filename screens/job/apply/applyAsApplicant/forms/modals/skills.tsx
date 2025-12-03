import { Form, Formik, FormikValues } from "formik";
import styles from "../styles.module.scss";
import { FC } from "react";
import * as Yup from "yup";
import { useSetAtom } from "jotai";
import { SkilsInfoAtom } from "@/lib/utils/store";
import Button from "@/components/ui/button/button";
import Input from "@/components/ui/input/input";

interface ComponentProps {
  handleClose: () => void;
  indexData: string;
  handleSubmit: (values: FormikValues, data: Payload) => void;
  index:number
}

const Skill: FC<ComponentProps> = ({
  indexData,
  handleClose,
  handleSubmit,
  index,
}) => {
  const skilsInfoAtomdata = useSetAtom(SkilsInfoAtom);

  const validationSchema = Yup.object().shape({
    skills: Yup.string().required("Skill is required"),
  });

  return (
    <section>
      <Formik
        initialValues={{
          skills: indexData || "",
        }}
        enableReinitialize={true}
        onSubmit={(values, { resetForm }) => {
          // Retrieve the current skill data from localStorage
          const currentSkillInfo = JSON.parse(
            localStorage.getItem("skill-data") ?? "[]"
          );

          let updatedSkillInfo: SkillsData[];
          if (indexData) {
            // Update the existing skill
            updatedSkillInfo = currentSkillInfo?.map((item: any, currIndex:number) =>
              currIndex === index ? values.skills : item
            );
          } else {
            // Add a new skill
            updatedSkillInfo = [...currentSkillInfo, values.skills];
          }

          skilsInfoAtomdata(updatedSkillInfo);

          handleSubmit(values, { skills: updatedSkillInfo });

          resetForm();
          handleClose();
        }}
        validationSchema={validationSchema}
      >
        {() => (
          <Form>
            <div className={styles.inputContainer}>
              <Input
                name="skills"
                label="Skill"
                placeholder="Enter your skill"
                type="text"
              />

              <section className={styles.buttonGroup}>
                <Button
                  variant="white"
                  type="button"
                  text="Cancel"
                  className={styles.btn}
                  onClick={handleClose}
                />
                <Button
                  variant="green"
                  type="submit"
                  text="Save"
                  className={styles.btn}
                />
              </section>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
};

export default Skill;
