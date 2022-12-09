import type { NextApiRequest, NextApiResponse } from "next";
import { doc, db, getDoc } from "../../../services/firebase/firestore";
import { z } from "zod";

const paramUser = z.object({
  id: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = paramUser.parse(req.query);

    try {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return res.status(200).json(true);
      }

      res.status(200).json(false);
    } catch (err) {
      res.status(400).json({ message: "Fail to create User" });
    }
  }
}
