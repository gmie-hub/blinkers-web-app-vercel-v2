import styles from "./index.module.scss";
import { Modal } from "antd";
import { Image } from "antd";
import { ReactNode } from "react";
import Button from "@/components/ui/button/button";

interface Props {
  handleCancel: () => void;
  handleClick: () => void;
  handleClickBtn2?: () => void;
  open: boolean;
  text?: string;
  heading?: string;
  icon?: ReactNode;
  BtnText?: string;
  BtnText2?: string;
}

const ModalContent = ({
  open,
  heading,
  text,
  handleCancel,
  handleClick,
  handleClickBtn2,
  icon,
  BtnText,
  BtnText2,
}: Props) => {
  return (
    <Modal open={open} onCancel={handleCancel} centered title="" footer={null}>
      <section className={styles.ModalWrapper}>
        {icon ? icon : <Image src="/Done.svg" alt="done" preview={false} />}
        {heading && <h3>{heading}</h3>}

        {text && <p className={styles.ModalPara}>{text}</p>}
        <div className={styles.btn}>
          {BtnText2 && (
            <Button
              onClick={handleClickBtn2}
              type="button"
              text={BtnText2}
              className={styles.btn}
              variant={"white"}
            />
          )}
          <Button
            onClick={handleClick}
            type="button"
            text={BtnText ? BtnText : "Okay"}
            className={styles.btn}
          />
        </div>
        {/* { BtnText2 &&
          <div className={styles.btn}>
            <Button
              onClick={handleClick}
              type="button"
              text={BtnText2}
              className={styles.btn}
            />
          </div>
        } */}
      </section>
    </Modal>
  );
};
export default ModalContent;
