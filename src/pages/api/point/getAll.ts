import type { NextApiRequest, NextApiResponse } from "next";
import {
  doc,
  db,
  getDoc,
  collection,
  query,
  getDocs,
} from "../../../services/firebase/firestore";
import { z } from "zod";

const dataQuery = z.object({
  userId: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { userId } = dataQuery.parse(req.query);

    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return res.status(404).json({ message: "Not found User" });
      }

      const q = query(collection(db, `users/${userId}/points`));

      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((item) => {
        const dataPoint = item.data();

        return {
          ...dataPoint,
          created_at: dataPoint.created_at.toDate(),
        };
      });

      console.log("t", querySnapshot.docs);
      res.status(200).json(data);
    } catch (err) {
      res.status(400).json({ message: "Fail to create Point" });
    }
  }
}
