export const formatTime = (time: any) => {
  if (!time) return "";
  
  // Convert the ISO string to a Date object
  const date = new Date(time);
  
  // Format the time using toLocaleTimeString
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
