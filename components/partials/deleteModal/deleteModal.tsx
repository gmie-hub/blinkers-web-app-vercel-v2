import styles from './delete.module.scss';
import { Modal, Image } from 'antd';
import { ReactNode } from 'react';
import Button from '@/components/ui/button/button';

interface Props {
  handleCancel: () => void;
  handleConfirm?: () => void;
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'red' | 'greenOutline' | 'green';
  cancelVariant?: 'red' | 'greenOutline' | 'default';
  icon?: ReactNode;
  disabled?: boolean;
}

const ReusableDeleteModal = ({
  open,
  handleCancel,
  handleConfirm,
  title = '',
  description = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'red',
  icon,
  disabled,
}: Props) => {
  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      centered
      footer={null}
    >
      <section className={styles.DeleteModalWrapper}>
        {icon ?? <Image src='/remove.svg' alt="ProductIcon" preview={false} />}
        <p className={styles.ModalTitle}>{title}</p>
        <p className={styles.ModalDescription}>{description}</p>
        <div className={styles.btn}>
          <Button
            variant={'greenOutline'}
            onClick={handleCancel}
            type="button"
            text={cancelText}
            className={styles.btn}
          />
          
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            type="submit"
            text={confirmText}
            className={styles.btn}
            disabled={disabled}
          />
        </div>
      </section>
    </Modal>
  );
};

export default ReusableDeleteModal;
