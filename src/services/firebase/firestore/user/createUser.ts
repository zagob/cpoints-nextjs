import { z } from "zod";
import { setDoc, doc, db } from "../index";

const CreateUserSchema = z.object({
  name: z.string().nullable(),
  email: z.string().nullable(),
  avatar_url: z.string().nullable(),
});

type CreateUserProps = z.infer<typeof CreateUserSchema>;

export async function createUser(idUser: string, user: CreateUserProps) {
  const { avatar_url, email, name } = user;

  await setDoc(doc(db, "users", idUser), {
    id: idUser,
    avatar_url,
    email,
    name,
    infoUser: null,
  });
}
