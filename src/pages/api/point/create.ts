import type { NextApiRequest, NextApiResponse } from "next";
import {
  doc,
  db,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "../../../services/firebase/firestore";
import { z } from "zod";
import { timeStringToMinute } from "../../../utils/timeStringToMinutes";
import {
  convertToMinutes,
  convertToTimeString,
  differenceInMinutes,
  splitStringTime,
} from "../../../utils/timePointTransform";
import { verifyTimeString } from "../../../utils/verifyTimeString";

const bodyDataPoint = z.object({
  entryOne: z.string(),
  exitOne: z.string(),
  entryTwo: z.string(),
  exitTwo: z.string(),
  dateTime: z.string(),
  // created_at: z.date().transform((date) => date.toISOString()),
  created_at: z.string(),
});

const paramUserId = z.object({
  idUser: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { idUser } = paramUserId.parse(req.query);
    const { entryOne, entryTwo, exitOne, exitTwo, dateTime, created_at } =
      bodyDataPoint.parse(req.body);

    const validadeDate = Date.parse(created_at);

    if (isNaN(validadeDate)) {
      return res.status(404).json({ message: "Not Date valid" });
    }

    try {
      const docRef = doc(db, "users", idUser);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return res.status(404).json({ message: "Not found User" });
      }

      if (
        entryOne.length === 0 ||
        entryTwo.length === 0 ||
        exitOne.length === 0 ||
        exitTwo.length === 0
      ) {
        return res.status(404).json({ message: "Invalid value" });
      }

      const isTimeValid = verifyTimeString({
        entryOne,
        entryTwo,
        exitOne,
        exitTwo,
      });

      if (isTimeValid) {
        return res
          .status(404)
          .json({ message: "Invalid time value, format: Max: 23:59" });
      }

      const { totalHours } = docSnap.data().infoUser;

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

      console.log("minutesAfternoon", minutesAfternoon);

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

      console.log("bankBalance", bankBalance);

      const response = await addDoc(collection(db, `users/${idUser}/points`), {
        entryOne,
        entryTwo,
        exitOne,
        exitTwo,
        created_at,
        dateTime,
        bankBalance,
      });

      await updateDoc(doc(db, `users/${idUser}/points`, response.id), {
        id: response.id,
        entryOne,
        entryTwo,
        exitOne,
        exitTwo,
        dateTime,
        bankBalance,
      });

      const data = {
        entryOne,
        entryTwo,
        exitOne,
        exitTwo,
        dateTime,
        bankBalance,
      };

      res.status(201).json(data);
    } catch (err) {
      res.status(400).json({ message: "Fail to create Point" });
    }
  }
}
