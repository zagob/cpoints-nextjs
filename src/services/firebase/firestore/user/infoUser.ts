import { z } from "zod";
import { updateDoc, doc, db } from "../index";

const InfoUserSchema = z.object({
  entryOne: z.number().max(480, { message: "Formato de time inválido" }),
  entryTwo: z.number().max(480, { message: "Formato de time inválido" }),
  exitOne: z.number().max(480, { message: "Formato de time inválido" }),
  exitTwo: z.number().max(480, { message: "Formato de time inválido" }),
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
