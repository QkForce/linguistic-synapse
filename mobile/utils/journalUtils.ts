import { Intensity, LessonLog } from "@/types/stat";

export const convertLogsToActivityRecord = (
  logs: LessonLog[],
): Record<string, Intensity> => {
  const dailyTotal: Record<string, number> = {};
  logs.forEach((log) => {
    const dateKey = log.created_at.substring(0, 10);
    dailyTotal[dateKey] =
      (dailyTotal[dateKey] || 0) + (log.sentence_count || 0);
  });

  const activityRecord: Record<string, Intensity> = {};
  Object.keys(dailyTotal).forEach((date) => {
    const count = dailyTotal[date];
    // Scale: 0 (0), 1 (1-10), 2 (11-25), 3 (26-50), 4 (50+)
    if (count > 50) activityRecord[date] = 4;
    else if (count > 25) activityRecord[date] = 3;
    else if (count > 10) activityRecord[date] = 2;
    else if (count > 0) activityRecord[date] = 1;
    else activityRecord[date] = 0;
  });

  return activityRecord;
};
