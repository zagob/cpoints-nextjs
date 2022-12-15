import { doc, db, addDoc, collection, updateDoc } from "../index";
import { z } from "zod";
import { timeStringToMinute } from "../../../../utils/timeStringToMinutes";
import {
  convertToMinutes,
  convertToTimeString,
  differenceInMinutes,
  splitStringTime,
} from "../../../../utils/timePointTransform";
import { verifyTimeString } from "../../../../utils/verifyTimeString";

const DataPointSchema = z.object({
  entryOne: z.string(),
  exitOne: z.string(),
  entryTwo: z.string(),
  exitTwo: z.string(),
  dateTime: z.string(),
  created_at: z.string(),
  holiday: z.boolean(),
});

type CreatePointProps = z.infer<typeof DataPointSchema>;

export async function createPoint(
  idUser: string,
  point: CreatePointProps,
  totalHours: string
) {
  const {
    created_at,
    dateTime,
    entryOne,
    entryTwo,
    exitOne,
    exitTwo,
    holiday,
  } = point;

  const validadeDate = Date.parse(created_at);

  if (isNaN(validadeDate)) {
    return { success: false, message: "Data invalida" };
  }

  if (
    entryOne.length === 0 ||
    entryTwo.length === 0 ||
    exitOne.length === 0 ||
    exitTwo.length === 0
  ) {
    return { success: false, message: "Valores invalidos" };
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

  const minutesAfternoon = Math.abs(
    differenceInMinutes(
      convertToMinutes(entryTwoSplit.hours, entryTwoSplit.minutes),
      convertToMinutes(exitTwoSplit.hours, exitTwoSplit.minutes)
    )
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

  const response = await addDoc(collection(db, `users/${idUser}/points`), {
    entryOne,
    entryTwo,
    exitOne,
    exitTwo,
    created_at,
    dateTime,
    bankBalance,
    holiday,
  });

  await updateDoc(doc(db, `users/${idUser}/points`, response.id), {
    id: response.id,
  });

  const data = {
    entryOne,
    entryTwo,
    exitOne,
    exitTwo,
    dateTime,
    bankBalance,
    holiday,
  };

  return {
    success: true,
    message: "Ponto cadastrado com sucesso!",
    data,
  };
}
