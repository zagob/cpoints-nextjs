import { MessageErr } from "../../../../pages/errors/returnMessageError";
import { deleteDoc, doc, db } from "../index";

export async function deletePoint(idUser: string, idPoint: string) {
  try {
    await deleteDoc(doc(db, `users/${idUser}/points`, idPoint));

    return MessageErr(true, "Ponto deletado com sucesso!");
  } catch (err) {
    return MessageErr(false, "Falha ao delete Ponto");
  }
}
