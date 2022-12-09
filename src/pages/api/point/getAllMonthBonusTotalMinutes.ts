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
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId, year } = dataQuery.parse(req.query);

    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return res.status(404).json({ message: "Not found User" });
      }

      let arr = [];
      for (let i = 1; i <= 12; i++) {
        const q = query(
          collection(db, `users/${userId}/points`),
          where("dateTime", "==", `${year}/${i.toString().padStart(2, "0")}`)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs;

        const totalMinutes = data
          .map((item) => {
            const { bankBalance } = item.data();

            const [hour, minute] = bankBalance.bonusTimePoint
              .split(":")
              .map((item: string) => Number(item));

            const totalMinutes = hour * 60 + minute;

            return {
              totalMinutes,
              statusPoint: bankBalance.statusPoint,
            };
          })
          .reduce((acc, value) => {
            if (value.statusPoint === "UP") {
              acc += value.totalMinutes;
            }
            if (value.statusPoint === "DOWN") {
              acc -= value.totalMinutes;
            }

            return acc;
          }, 0);

        arr.push(totalMinutes);
      }

      res.status(200).json(arr);
    } catch (err) {
      res.status(400).json({ message: "Fail get Point month", err });
    }
  }
}
