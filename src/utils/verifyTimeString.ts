interface DataTimeStringProps {
  entryOne: string;
  exitOne: string;
  entryTwo: string;
  exitTwo: string;
}

export function verifyTimeString(times: DataTimeStringProps): Boolean {
  const { entryOne, entryTwo, exitOne, exitTwo } = times;

  const [entryOneHour, entryOneMinutes] = entryOne
    .split(":")
    .map((item) => Number(item));
  const [entryTwoHour, entryTwoMinutes] = entryTwo
    .split(":")
    .map((item) => Number(item));
  const [exitOneHour, exitOneMinutes] = exitOne
    .split(":")
    .map((item) => Number(item));
  const [exitTwoHour, exitTwoMinutes] = exitTwo
    .split(":")
    .map((item) => Number(item));

  const entryOneHourToMinutes = entryOneHour * 60;
  const entryTwoHourToMinutes = entryTwoHour * 60;
  const exitOneHourToMinutes = exitOneHour * 60;
  const exitTwoHourToMinutes = exitTwoHour * 60;

  const isHourTimeValid =
    entryOneHourToMinutes > 1380 ||
    entryTwoHourToMinutes > 1380 ||
    exitOneHourToMinutes > 1380 ||
    exitTwoHourToMinutes > 1380;

  const isMinuteTimeValid =
    entryOneMinutes > 59 ||
    entryTwoMinutes > 59 ||
    exitOneMinutes > 59 ||
    exitTwoMinutes > 59;

  if (isHourTimeValid || isMinuteTimeValid) {
    return true;
  }

  return false;
}
