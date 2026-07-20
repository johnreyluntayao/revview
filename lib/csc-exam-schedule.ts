const PHILIPPINE_TIME_OFFSET_MS = 8 * 60 * 60 * 1000;
const EXAM_MONTHS = [2, 7] as const;

export const CSC_EXAM_SCHEDULE_URL =
  "https://www.csc.gov.ph/examination-advisories/examination-announcement-no-08-s-2025-2026-ppt-exam-calendar";

/**
 * CSC schedules the CSE-PPT on the second Sunday of March and August.
 * The target time is 6:30 a.m. Philippine Standard Time, the official
 * latest recommended arrival time for examinees.
 */
export function getCscExamDate(year: number, monthIndex: (typeof EXAM_MONTHS)[number]) {
  const firstDayOfMonth = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
  const firstSunday = 1 + ((7 - firstDayOfMonth) % 7);
  const secondSunday = firstSunday + 7;

  return new Date(
    Date.UTC(year, monthIndex, secondSunday, 6, 30) -
      PHILIPPINE_TIME_OFFSET_MS,
  );
}

export function getNextCscExamDate(now = new Date()) {
  const philippineYear = new Date(
    now.getTime() + PHILIPPINE_TIME_OFFSET_MS,
  ).getUTCFullYear();

  for (let year = philippineYear; year <= philippineYear + 2; year += 1) {
    for (const month of EXAM_MONTHS) {
      const examDate = getCscExamDate(year, month);

      if (examDate.getTime() > now.getTime()) {
        return examDate;
      }
    }
  }

  return getCscExamDate(philippineYear + 3, EXAM_MONTHS[0]);
}

