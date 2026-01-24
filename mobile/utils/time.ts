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

const MONTHS_KK_SHORT = [
  "Қаң",
  "Ақп",
  "Нау",
  "Сәу",
  "Мам",
  "Мау",
  "Шіл",
  "Там",
  "Қыр",
  "Қаз",
  "Қар",
  "Жел",
];

export const getShortMonthName = (monthIndex: number): string => {
  return MONTHS_KK_SHORT[monthIndex] || "";
};

// 2026-01-17 15:34:13
export const parseDateString = (
  dateString: string,
): {
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
  seconds: number;
  dateString: string;
  timeString: string;
} => {
  const parts = dateString.split(" ");
  const part_1 = parts[0].split("-");
  const part_2 = parts[1].split(":");

  return {
    year: Number(part_1[0]),
    month: Number(part_1[1]),
    date: Number(part_1[2]),
    hours: Number(part_2[0]),
    minutes: Number(part_2[1]),
    seconds: Number(part_2[2]),
    dateString: parts[0],
    timeString: parts[1],
  };
};
