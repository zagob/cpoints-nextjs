import type { NextApiRequest, NextApiResponse } from "next";
import { setDoc, doc, db, getDoc } from "../../../services/firebase/firestore";
import { z } from "zod";

type Data = {
  message: string;
};

const bodyDataUser = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar_url: z.string().url().nullable(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id, avatar_url, email, name } = bodyDataUser.parse(req.body);

  try {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return res.status(404).json({ message: "Already exist user id" });
    }

    await setDoc(doc(db, "users", id), {
      id,
      avatar_url,
      email,
      name,
      infoUser: null,
    });

    res.status(201).json({ message: "User create success" });
  } catch (err) {
    res.status(400).json({ message: "Fail to create User" });
  }
}
