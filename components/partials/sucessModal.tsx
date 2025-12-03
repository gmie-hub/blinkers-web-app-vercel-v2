// import React from 'react';
// import { Modal } from 'antd'; // Ant Design Modal
// import { ReactComponent as SuccessIcon } from '../assets/Done copy.svg'; // Custom icon
// import { Button } from '../customs'; // Custom button component

// interface Props {
//   openSuccess: boolean; // Control modal visibility
//   message: string; // The message to display in the modal
//   onClose: () => void; // Function to handle the closing action
//   buttonText?: string; // Optional button text (default is 'Okay')
//   Icon?: React.ComponentType; // Optional icon component (default is SuccessIcon)
// }

// const SuccessModalContent = ({ openSuccess, message, onClose, buttonText = 'Okay', Icon = SuccessIcon }: Props) => {
//   return (
//     <Modal
//       open={openSuccess} // Control modal visibility
//       onCancel={onClose} // Close the modal on cancel action (click outside or "x")
//       centered // Center the modal on the screen
//       footer={null} // Remove the default footer
//       closable={false} // Optional: Control whether the "x" close button shows up
//     >
//       <section className={'ModalWrapper'}>
//         {Icon && <Icon />} {/* Display icon if provided */}
//         <p className={'ModalPara'}>{message}</p> {/* Display message */}
//         <div className={'btn'}>
//           <Button
//             onClick={onClose} // Handle the onClose action
//             type="button"
//             text={buttonText} // Display custom button text or default 'Okay'
//             className={'btn'}
//           />
//         </div>
//       </section>
//     </Modal>
//   );
// };

// export default SuccessModalContent;

import { Modal } from "antd"; // Ant Design Modal
import Button from "../ui/button/button";

interface Props {
  openSuccess: boolean; // Control modal visibility
  message: string; // The message to display in the modal
  onClose: () => void; // Function to handle the closing action
  buttonText?: string; // Optional button text (default is 'Okay')
  Icon?: any; // Optional icon component (default is SuccessIcon)
  onCancel?: () => void; // Optional: Function to handle cancel action (click outside or "x")
  showButton?: boolean; // Optional: Control if the button should be displayed (default true)
  show2Button?: boolean;
  handleClick?: () => void;
  showIcon?: boolean;
  text?: string;
  variant?: any;
}

const SuccessModalContent = ({
  openSuccess,
  message,
  onClose,
  buttonText = "Okay",
  Icon,
  onCancel,
  showButton = true, // Default to showing the button
  show2Button,
  handleClick,
  showIcon = true,
  text,
  variant,
}: Props) => {
  return (
    <Modal
      open={openSuccess} // Control modal visibility
      onCancel={onCancel || onClose} // Optional: Close the modal on cancel action (click outside or "x"), fallback to onClose if onCancel isn't provided
      centered // Center the modal on the screen
      footer={null} // Remove the default footer
      closable={onCancel !== undefined} // Show the "x" close button only if onCancel is provided
    >
      <section className={"ModalWrapper"}>
        {showIcon && Icon && <Icon />} {/* Display icon if provided */}
        <p className={"ModalPara"}>{message}</p> {/* Display message */}
        <h3>{text}</h3>
        {showButton && ( // Conditionally render the button based on `showButton` prop
          <div className="space-between">
            <Button
              onClick={onClose} // Handle the onClose action
              type="button"
              text={buttonText} // Display custom button text or default 'Okay'
              className={"btn"}
            />
          </div>
        )}
        {show2Button && ( // Conditionally render the button based on `showButton` prop
          <div className="space-between">
            <Button
              onClick={onClose} // Handle the onClose action
              type="button"
              text={"No,Go Back"} // Display custom button text or default 'Okay'
              className={"btn"}
              variant="white"
            />
            <Button
              onClick={handleClick} // Handle the onClose action
              type="button"
              text={buttonText} // Display custom button text or default 'Okay'
              className={"btn"}
              variant={variant}
            />
          </div>
        )}
      </section>
    </Modal>
  );
};

export default SuccessModalContent;
