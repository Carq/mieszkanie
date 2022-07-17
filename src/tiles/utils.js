import { colorStatuses } from "./constants";
import { metricTypes, dateTimeFormatTypes } from "./constants";
import max from "lodash/min";
import min from "lodash/max";

export function colorStatusToClassNames(colorStatus) {
  if (!colorStatus) return;

  return {
    green: colorStatus === colorStatuses.GREEN,
    "light-green": colorStatus === colorStatuses.LIGHTGREEN,
    amber: colorStatus === colorStatuses.AMBER,
    red: colorStatus === colorStatuses.RED,
    blue: colorStatus === colorStatuses.BLUE,
    "light-blue": colorStatus === colorStatuses.LIGHTBLUE,
    aqua: colorStatus === colorStatuses.AQUA,
  };
}

export function colorStatusToBackgroundClassNames(colorStatus) {
  if (!colorStatus) return;

  return {
    "background-green": colorStatus === colorStatuses.GREEN,
    "background-light-green": colorStatus === colorStatuses.LIGHTGREEN,
    "background-amber": colorStatus === colorStatuses.AMBER,
    "background-red": colorStatus === colorStatuses.RED,
    "background-blue": colorStatus === colorStatuses.BLUE,
    "background-light-blue": colorStatus === colorStatuses.LIGHTBLUE,
    "background-aqua": colorStatus === colorStatuses.AQUA,
    "background-silver": colorStatus === colorStatuses.SILVER,
  };
}

export function convertToTimeOnly(date) {
  const localTime = new Date(date);
  const minutes = `${localTime.getMinutes()}`.padStart(2, "0");
  return `${localTime.getHours()}:${minutes}`;
}

export function convertToMonthOnly(date) {
  const localTime = new Date(date);
  return `${localTime.toLocaleString("default", {
    month: "short",
    year: "numeric",
  })}`;
}

export function convertToDateWithoutYearOnly(date) {
  const localTime = new Date(date);
  const day = `${localTime.getDate()}`.padStart(2, "0");
  const month = `${localTime.getMonth() + 1}`.padStart(2, "0");
  return `${day}.${month}`;
}

export function convertDateTime(date) {
  const localTime = new Date(date);
  const day = `${localTime.getDate()}`.padStart(2, "0");
  const month = `${localTime.getMonth() + 1}`.padStart(2, "0");
  const minutes = `${localTime.getMinutes()}`.padStart(2, "0");
  return `${day}.${month}.${localTime.getFullYear()} ${localTime.getHours()}:${minutes}`;
}

export function calculateDateTimeFormat(dates) {
  if (dates.length < 2) {
    return dateTimeFormatTypes.DATEONLY;
  }

  const maxDate = new Date(max(dates));
  const minDate = new Date(min(dates));
  const diffInMinutes = (minDate.getTime() - maxDate.getTime()) / (1000 * 60);
  const avgDiffBetweenDatesInHours = diffInMinutes / 60 / (dates.length - 1);
  if (avgDiffBetweenDatesInHours <= 23.9) return dateTimeFormatTypes.TIMEONLY;
  if (avgDiffBetweenDatesInHours < 30 * 24) return dateTimeFormatTypes.DATEONLY;
  return dateTimeFormatTypes.MONTHONLY;
}

export function addHours(date, hours) {
  const dateObject = new Date(date);
  return dateObject.setHours(dateObject.getHours() + hours);
}

export function calculateDateTimeFormatAsString(dates) {
  const dateTimeFormat = calculateDateTimeFormat(dates);
  switch (dateTimeFormat) {
    case dateTimeFormatTypes.TIMEONLY:
      return "HH:mm";
    case dateTimeFormatTypes.MONTHONLY:
      return "MMM yyyy";
    default:
      return "dd MMM";
  }
}

export function metricTypeToSufix(metricType, unit) {
  switch (metricType) {
    case metricTypes.PERCENTAGE:
      return "%";
    case metricTypes.MONEY:
      return unit || "€";
    case metricTypes.TIME:
      return "";
    default:
      return "";
  }
}

export function getFormatedTime(totalSeconds) {
  const format = (val) => `${Math.floor(val)}`.slice(-2);
  const hours = format(totalSeconds / 3600);
  const minutes = format((totalSeconds % 3600) / 60);
  const seconds = format(totalSeconds % 60);

  let finalFormat = hours > 0 ? `${hours}h ` : "";
  finalFormat += minutes > 0 ? `${minutes}m ` : "";
  finalFormat += seconds > 0 && hours < 1 ? `${seconds}s ` : "";

  return finalFormat;
}

export function convertToSeconds(microseconds) {
  return parseFloat((microseconds / 1000).toFixed(1));
}
