export function timeStringToMinute(time: string) {
  const [hour, minute] = time.split(":").map((item) => Number(item));
  return hour * 60 + minute;
}
