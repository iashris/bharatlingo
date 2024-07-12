export const convertTimeToSeconds = (time: string | number): number => {
  if (typeof time === "number") return time;

  const [minutes, seconds] = time.split(":").map(Number);
  return minutes * 60 + seconds;
};
