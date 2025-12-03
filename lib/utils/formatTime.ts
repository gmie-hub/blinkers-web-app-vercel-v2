import { formatDistanceToNow, format, parseISO } from "date-fns";

export const getTimeAgo = (postedDate: string | null | undefined): string => {
  if (!postedDate || postedDate?.trim() === "") {
    return "Invalid date";
  }

  const date = new Date(postedDate);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  return `${formatDistanceToNow(date, { addSuffix: true })}`;
};

export const formatAmount = (amount: number | string) =>
  `₦${Number(amount)?.toLocaleString()}`;

export function convertDate(dateString: string | null) {
  if (!dateString) return "";
  const p = dateString.split(/\D/g);
  return [p[0], p[1], p[2]].join("-");
}

export function getTimeFromDate(dateString: string | null): string {
  if (!dateString) return "";

  // Parse the date string and create a Date object
  const date = new Date(dateString);

  // Extract hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // Determine am/pm and adjust hours for 12-hour format
  const period = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

  return `${hours}:${minutes}${period}`;
}

export function formatDateToMonthYear(dateString: string | null): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // Check for invalid date

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${year}`;
}

export function formatDateToDayMonthYear(dateString: string | null): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return ""; // Check for invalid date

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const day = date.getDate();

  // Determine the correct suffix for the day
  const suffix = (day: number): string => {
    if (day >= 11 && day <= 13) return "th"; // Special case for 11th, 12th, 13th
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${suffix(day)} of ${month}, ${year}`;
}

export const formatDateOnly = (dateString: string | null) => {
  if (!dateString) return ""; // Return an empty string or handle it as needed

  const dateTimeObject = parseISO(dateString);

  if (isNaN(dateTimeObject.getTime())) {
    // Handle invalid date (parseISO returns Invalid Date)
    return ""; // Return an empty string or handle it as needed
  }

  // return format(dateObject, "dd-MM-yyyy");
  return format(dateTimeObject, "dd-MMM-yyyy");
};





