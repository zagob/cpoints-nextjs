export function BankBalanceTime(
  totalHours: number,
  timeDay: {
    entryOne: number;
    exitOne: number;
    entryTwo: number;
    exitTwo: number;
  }
) {
  const { entryOne, exitOne, entryTwo, exitTwo } = timeDay;

  const timeMorning = exitOne - entryOne;
  const timeLunch = entryTwo - exitOne;
  const timeAffternoon = exitTwo - entryTwo;

  const totalTime = timeAffternoon - timeMorning;
  const bonus = totalTime - totalHours;

  const isNumberStatus = Math.sign(bonus);

  const status =
    isNumberStatus === 1 ? "UP" : isNumberStatus === -1 ? "DOWN" : "EQUAL";

  return {
    timeMorning,
    timeLunch,
    timeAffternoon,
    totalTime,
    status,
    bonus: Math.abs(bonus),
  };
}
