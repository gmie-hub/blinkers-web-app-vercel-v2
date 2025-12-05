type BusinessHour = {
    day: string;
    open_time: string;
    close_time: string;
  };
  

  
  export const groupBusinessHours = (hours: BusinessHour[]): string => {
    const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

    const grouped: { days: string[]; open_time: string; close_time: string }[] =
      [];
  
    for (const { day, open_time, close_time } of hours) {
      const lastGroup = grouped[grouped.length - 1];
  
      if (lastGroup && lastGroup.open_time === open_time && lastGroup.close_time === close_time) {
        lastGroup.days.push(day);
      } else {
        grouped.push({ days: [day], open_time, close_time });
      }
    }
  
    return grouped
      .map(({ days, open_time, close_time }) => {
        const formatTime = (time: string) => {
          const [hour, minute] = time.split(":").map(Number);
          const period = hour >= 12 ? "PM" : "AM";
          const formattedHour = hour % 12 || 12;
          const formattedMinute = minute ? `:${minute.toString().padStart(2, "0")}` : "";
          return `${formattedHour}${formattedMinute} ${period}`;
        };

        const dayRange =
        days.length > 1
          ? `${capitalize(days[0])} - ${capitalize(days[days.length - 1])}`
          : capitalize(days[0]);

      return `${dayRange} (${formatTime(open_time)} - ${formatTime(close_time)})`;
    })
  
    //     const dayRange =
    //       days.length > 1 ? `${days[0]} - ${days[days.length - 1]}` : days[0];
  
    //     return `${dayRange} (${formatTime(open_time)} - ${formatTime(close_time)})`;
    //   })
      .join("\n"); // Adds a newline after each entry
  };
  
