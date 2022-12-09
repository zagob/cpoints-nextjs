import type { NextApiRequest, NextApiResponse } from "next";
import {
  doc,
  db,
  getDoc,
  deleteDoc,
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
  idUser: z.string({ description: "required idUser" }),
  entryOne: z.string(),
  exitOne: z.string(),
  entryTwo: z.string(),
  exitTwo: z.string(),
  dateTime: z.string(),
});

const queryIdPoint = z.object({
  pointId: z.string(),
});

const dataQuery = z.object({
  point: z.string().array(),
  userId: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { idUser, entryOne, entryTwo, exitOne, exitTwo } =
      bodyDataPoint.parse(req.body);

    const { pointId } = queryIdPoint.parse(req.query);

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

      await updateDoc(doc(db, `users/${idUser}/points`, pointId), {
        entryOne,
        entryTwo,
        exitOne,
        exitTwo,
        bankBalance,
      });

      const data = {
        entryOne,
        entryTwo,
        exitOne,
        exitTwo,
        bankBalance,
      };

      res.status(201).json(data);
    } catch (err) {
      res.status(400).json({ message: "Fail to create Point" });
    }
  }

  if (req.method === "DELETE") {
    const { point, userId } = dataQuery.parse(req.query);

    const pointId = point.join();

    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ message: "Not found User" });
    }

    try {
      await deleteDoc(doc(db, `users/${userId}/points`, pointId));
      return res.status(200).json({ message: "Point delete success" });
    } catch {
      return res.status(404).json({ message: "Fail to delete point" });
    }
  }
}
