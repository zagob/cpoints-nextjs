export function splitStringTime(time: string) {
  const [hours, minutes] = time.split(":");
  return {
    hours: Number(hours),
    minutes: Number(minutes),
  };
}

export function convertToMinutes(hours: number, minutes: number) {
  return hours * 60 + minutes;
}

export function differenceInMinutes(minutes1: number, minutes2: number) {
  return minutes2 - minutes1;
}

export function convertToTimeString(timeMinutes: number) {
  const hours = String(Math.floor(timeMinutes / 60)).padStart(2, "0");
  const minutes = String(timeMinutes % 60).padStart(2, "0");

  return `${hours}:${minutes}`;
}
