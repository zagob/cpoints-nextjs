import { MessageErr } from "../../../../pages/errors/returnMessageError";
import { query, collection, where, db, getDocs } from "../index";
import { existUserIdById } from "../user/existUserById";

export async function getByDate(idUser: string, month: string, year: string) {
  const user = await existUserIdById(idUser);

  // if (!user.success) {
  //   return MessageErr(false, "Usuário não encontrado");
  // }

  const q = query(
    collection(db, `users/${idUser}/points`),
    where("dateTime", "==", `${year}/${month}`)
  );

  const querySnapshot = await getDocs(q);

  const data = querySnapshot.docs;

  const bonusTotalMinutes = data
    .map((item) => {
      const { bankBalance } = item.data();

      const [hour, minute] = bankBalance.bonusTimePoint
        .split(":")
        .map((item: string) => Number(item));

      const totalMinutes = hour * 60 + minute;

      return {
        ...bankBalance,
        totalTimePointMinuts: totalMinutes,
      };
    })
    .reduce((acc, value) => {
      if (value.statusPoint === "UP") {
        acc += value.totalTimePointMinuts;
      }
      if (value.statusPoint === "DOWN") {
        acc -= value.totalTimePointMinuts;
      }

      return acc;
    }, 0);

  const points = data.map((item) => {
    const data = item.data();

    return {
      ...data,
    };
  });

  return { bonusTotalMinutes, points };
  // try {

  // } catch (err) {
  //   return MessageErr(false, "Erro ao filtrar dados");
  // }
}
