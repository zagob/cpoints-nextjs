import { MessageErr } from "../../../../errors/returnMessageError";
import { query, collection, where, getDocs, db } from "../index";

export async function getAllMonthTotalMinutes(idUser: string, year: string) {
  try {
    let arr = [];
    for (let i = 1; i <= 12; i++) {
      const q = query(
        collection(db, `users/${idUser}/points`),
        where("dateTime", "==", `${year}/${i.toString().padStart(2, "0")}`)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs;

      const totalMinutes = data
        .map((item) => {
          const { bankBalance } = item.data();

          const [hour, minute] = bankBalance.bonusTimePoint
            .split(":")
            .map((item: string) => Number(item));

          const totalMinutes = hour * 60 + minute;

          return {
            totalMinutes,
            statusPoint: bankBalance.statusPoint,
          };
        })
        .reduce((acc, value) => {
          if (value.statusPoint === "UP") {
            acc += value.totalMinutes;
          }
          if (value.statusPoint === "DOWN") {
            acc -= value.totalMinutes;
          }

          return acc;
        }, 0);

      arr.push(totalMinutes);
    }

    return arr;
  } catch (err) {
    return MessageErr(false, "Erro ao filtrar dados");
  }
}
