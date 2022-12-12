import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { doc, db, updateDoc } from "../../../services/firebase/firestore";

type Data = {
  message: string;
};

const paramIdUser = z.object({
  id: z.string(),
});

const bodyInfoUser = z.object({
  entryOne: z.string().nullable(),
  entryTwo: z.string().nullable(),
  exitOne: z.string().nullable(),
  exitTwo: z.string().nullable(),
  totalHours: z.string().nullable(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const { id } = paramIdUser.parse(req.query);
    const { entryOne, entryTwo, exitOne, exitTwo, totalHours } =
      bodyInfoUser.parse(req.body);
    try {
      await updateDoc(doc(db, `users`, id), {
        infoUser: {
          entryOne,
          entryTwo,
          exitOne,
          exitTwo,
          totalHours,
        },
      });

      res.status(201).json({ message: "Info User create success" });
    } catch (err) {
      res.status(404).json({ message: "Error", err });
    }
  }
}
