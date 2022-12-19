import { differenceInMinutes } from "date-fns";
import { z } from "zod";
import {
  convertToMinutes,
  convertToTimeString,
  splitStringTime,
} from "../../../../utils/timePointTransform";
import { timeStringToMinute } from "../../../../utils/timeStringToMinutes";
import { verifyTimeString } from "../../../../utils/verifyTimeString";
import { doc, updateDoc, db } from "../index";
import { existUserIdById } from "../user/existUserById";

const DataPointSchema = z.object({
  entryOne: z.string(),
  exitOne: z.string(),
  entryTwo: z.string(),
  exitTwo: z.string(),
  dateTime: z.string(),
  created_at: z.string(),
});

type UpdatePointProps = z.infer<typeof DataPointSchema>;

export async function updatePoint(
  idUser: string,
  idPoint: string,
  dataPoint: UpdatePointProps,
  totalHours: string
) {
  const { entryOne, entryTwo, exitOne, exitTwo, created_at, dateTime } =
    dataPoint;

  const user = await existUserIdById(idUser);

  if (!user.success) {
    return user.message;
  }

  if (
    entryOne.length === 0 ||
    entryTwo.length === 0 ||
    exitOne.length === 0 ||
    exitTwo.length === 0
  ) {
    return { success: false, message: "Dados invalidos" };
  }

  const isTimeValid = verifyTimeString({
    entryOne,
    entryTwo,
    exitOne,
    exitTwo,
  });

  if (isTimeValid) {
    return {
      success: false,
      message: "Invalid time value, format: Max: 23:59",
    };
  }

  const totalHoursInMinutes = timeStringToMinute(totalHours);
  const entryOneSplit = splitStringTime(entryOne);
  const exitOneSplit = splitStringTime(exitOne);
  const entryTwoSplit = splitStringTime(entryTwo);
  const exitTwoSplit = splitStringTime(exitTwo);

  const minutesMorning = differenceInMinutes(
    convertToMinutes(entryOneSplit.hours, entryOneSplit.minutes),
    convertToMinutes(exitOneSplit.hours, exitOneSplit.minutes)
  );

  const minutesLunch = differenceInMinutes(
    convertToMinutes(exitOneSplit.hours, exitOneSplit.minutes),
    convertToMinutes(entryTwoSplit.hours, entryTwoSplit.minutes)
  );

  const minutesAfternoon = differenceInMinutes(
    convertToMinutes(entryTwoSplit.hours, entryTwoSplit.minutes),
    convertToMinutes(exitTwoSplit.hours, exitTwoSplit.minutes)
  );

  const bonusTimePoint =
    minutesMorning + minutesAfternoon - totalHoursInMinutes;

  const totalTimePoint = minutesMorning + minutesAfternoon;

  const bankBalance = {
    timeMorning: convertToTimeString(minutesMorning),
    lunch: convertToTimeString(minutesLunch),
    timeAfternoon: convertToTimeString(minutesAfternoon),
    bonusTimePoint: convertToTimeString(Math.abs(bonusTimePoint)),
    totalTimePoint: convertToTimeString(totalTimePoint),
    statusPoint: (Math.sign(bonusTimePoint) === 1
      ? "UP"
      : Math.sign(bonusTimePoint) === -1
      ? "DOWN"
      : "EQUAL") as "UP" | "DOWN" | "EQUAL",
  };

  await updateDoc(doc(db, `users/${idUser}/points`, idPoint), {
    entryOne,
    entryTwo,
    exitOne,
    exitTwo,
    created_at,
    dateTime,
    bankBalance,
  });

  const data = {
    entryOne,
    entryTwo,
    exitOne,
    exitTwo,
    created_at,
    dateTime,
    bankBalance,
  };

  return { success: true, message: "Ponto alterado com sucesso!", data };
}
