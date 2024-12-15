export const formatTime = (time: any) => {
  if (!time) return "";
  return time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};
