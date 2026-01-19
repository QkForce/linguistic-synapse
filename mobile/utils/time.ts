export const formatMsToTime = (ms: number): string => {
  const isNegative = ms < 0;
  const absoluteMs = Math.abs(ms);

  const totalSeconds = Math.floor(absoluteMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num: number) => num.toString().padStart(2, "0");

  let timeString = "";
  if (hours > 0) {
    timeString = `${hours}:${pad(minutes)}:${pad(seconds)}`;
  } else {
    timeString = `${pad(minutes)}:${pad(seconds)}`;
  }
  return isNegative ? `-${timeString}` : timeString;
};
