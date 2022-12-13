import { db, doc, getDoc } from "../index";

interface UserProps {
  id: string;
  avatar_url: string | null;
  email: string | null;
  name: string;
  infoUser: {
    entryOne: string;
    entryTwo: string;
    exitOne: string;
    exitTwo: string;
    totalHours: string;
  } | null;
}

interface ReturnProps {
  success: boolean;
  message?: string;
  data?: UserProps | null;
}

export async function existUserIdById(idUser: string): Promise<ReturnProps> {
  const docRef = doc(db, "users", idUser);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return { success: false, message: "Nenhum Usuário encontrado" };
  }

  const data = docSnap.data() as UserProps;

  return { success: true, data };
}
