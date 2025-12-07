// export function sanitizeUrlParam(param:any) {
//     return param
//       .trim() // Remove leading and trailing spaces
//       .replace(/\s+/g, '-') // Replace spaces with hyphens
//       .replace(/%/g, '-') // Replace percent signs with hyphens
//       .replace(/[^a-zA-Z0-9-]/g, ''); // Remove special characters (optional)
//   }

import { message } from "antd";
import { JSX } from "react";

export function sanitizeUrlParam(param: string): string {
  // Handle null, undefined, and empty strings
  if (param == null || param === "") {
    return ""; // Return an empty string if input is null, undefined, or empty
  }

  if (typeof param !== "string") {
    console.warn(
      "sanitizeUrlParam: Expected a string but received:",
      typeof param
    );
    return "";
  }

  return param
    .trim() // Remove leading and trailing spaces
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/%/g, "-") // Replace percent signs with hyphens
    .replace(/[^a-zA-Z0-9-]/g, ""); // Remove special characters (optional)
}

export function isCurrentDateGreaterThan(targetDateString: string) {
  // Get the current date and time
  const currentDate = new Date();

  // Convert the target date string to a Date object
  const targetDate = new Date(targetDateString);

  // Compare the current date with the target date
  if (currentDate > targetDate) {
    return true;
  } else {
    return false;
  }
}

export function countUpTo(
  num: number,
  element: JSX.Element,
  element1: JSX.Element
) {
  const result = [];
  for (let i = 1; i <= 5; i++) {
    if (i > num) result?.push(element1);
    else result?.push(element);
  }
  return result; // Return the array
}

export const handleCopyLink = (textToCopy: string) => {
  if (!textToCopy) {
    message.warning("No text to copy.");
    return;
  }
  
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      message.success("copied to clipboard!");
    })
    .catch(() => {
      message.error("Failed to copy . Please try again.");
    });
};