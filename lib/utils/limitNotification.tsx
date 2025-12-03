// import Button from "@/components/ui/button/button";
// import { notification } from "antd";

// type NotifyWithActionParams = {
//   message: string;
//   description: string;
//   buttonText?: string;
//   onClick: () => void;
// };

// export const LimitNotification = ({
//   message,
//   description,
//   buttonText = "Change Plan",
//   onClick,
// }: NotifyWithActionParams) => {
//   notification.error({
//     message,
//     description: (
//       <div>
//         {description}
      
//         <div style={{marginBlockEnd:'2rem'}}>
//         <Button
//         variant="green"
//         className={"buttonStyle"}
//           onClick={() => {
//             notification.destroy();
//             onClick();
//           }}
//         >
//           {buttonText}
//         </Button>
//         </div>
      
//       </div>
//     ),
//     duration: 0,
//   });
// };




// export const getInitials = (title: string = ""): string => {
//   const words = title.trim().split(" ");
//   const initials  = words
//     .filter(word => word.length > 0)
//     .slice(0, 2)
//     .map(word => word[0].toUpperCase())
//     .join("");
//   return initials;
// };


// const colorList = ["#f97316", "#10b981", "#3b82f6", "#ef4444"]; // orange, green, blue, red

//  export const getColorByString = (str?: string): string => {
// if (!str) return colorList[1]; // fallback

// let hash = 0;
// for (let i = 0; i < str.length; i++) {
//   hash = str.charCodeAt(i) + ((hash << 5) - hash);
// }

// const index = Math.abs(hash) % colorList.length;
// return colorList[index];
// };
 
import Button from "@/components/ui/button/button";
import { notification } from "antd";

type NotifyWithActionParams = {
  message: string;
  description: string;
  buttonText?: string;
  onClick: () => void;
};

export const LimitNotification = ({
  message,
  description,
  buttonText = "Change Plan",
  onClick,
}: NotifyWithActionParams) => {
  notification.error({
    title: message, // ⬅️ AntD v5 requires `title`
    description: (
      <div>
        {description}

        <div style={{ marginBlockEnd: "2rem" }}>
          <Button
            variant="green"
            className={"buttonStyle"}
            onClick={() => {
              notification.destroy();
              onClick();
            }}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    ),
    duration: 0,
    placement: "topRight",
  });
};


// ────────────────────────────────────────────────────────────────
// Get initial letters (e.g. “John Doe” → “JD”)
// ────────────────────────────────────────────────────────────────

export const getInitials = (title: string = ""): string => {
  const words = title.trim().split(" ");

  const initials = words
    .filter((word) => word.length > 0)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return initials;
};


// ────────────────────────────────────────────────────────────────
// Pick a color based on a string input
// ────────────────────────────────────────────────────────────────

const colorList = ["#f97316", "#10b981", "#3b82f6", "#ef4444"]; 
// orange, green, blue, red

export const getColorByString = (str?: string): string => {
  if (!str) return colorList[1]; // fallback color

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colorList.length;
  return colorList[index];
};
