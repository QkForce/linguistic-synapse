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

export const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`; // "2026-01-31"
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};
