import { z } from "zod";
import { updateDoc, doc, db } from "../index";

const InfoUserSchema = z.object({
  entryOne: z.string(),
  entryTwo: z.string(),
  exitOne: z.string(),
  exitTwo: z.string(),
  totalHours: z.string(),
});

type InfoUserProps = z.infer<typeof InfoUserSchema>;

export async function infoUser(idUser: string, infoUser: InfoUserProps) {
  const { entryOne, entryTwo, exitOne, exitTwo, totalHours } = infoUser;
  await updateDoc(doc(db, "users", idUser), {
    infoUser: {
      entryOne,
      entryTwo,
      exitOne,
      exitTwo,
      totalHours,
    },
  });

  return { message: "Info User Adicionado com sucesso" };
}
