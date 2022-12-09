import type { NextApiRequest, NextApiResponse } from "next";
import {
  doc,
  db,
  getDoc,
  collection,
  query,
  getDocs,
  where,
} from "../../../services/firebase/firestore";
import { z } from "zod";

const dataQuery = z.object({
  userId: z.string(),
  year: z.string(),
  month: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId, month, year } = dataQuery.parse(req.query);

    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return res.status(404).json({ message: "Not found User" });
      }

      const q = query(
        collection(db, `users/${userId}/points`),
        where("dateTime", "==", `${year}/${month}`)
      );

      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs;

      const bonusTotalMinutes = data
        .map((item) => {
          const { bankBalance } = item.data();

          const [hour, minute] = bankBalance.bonusTimePoint
            .split(":")
            .map((item: string) => Number(item));

          const totalMinutes = hour * 60 + minute;

          return {
            ...bankBalance,
            totalTimePointMinuts: totalMinutes,
          };
        })
        .reduce((acc, value) => {
          if (value.statusPoint === "UP") {
            acc += value.totalTimePointMinuts;
          }
          if (value.statusPoint === "DOWN") {
            acc -= value.totalTimePointMinuts;
          }

          return acc;
        }, 0);

      const points = data.map((item) => {
        const data = item.data();

        return {
          ...data,
        };
      });

      res.status(200).json({ bonusTotalMinutes, points });
    } catch (err) {
      res.status(400).json({ message: "Fail get Point month", err });
    }
  }
}
