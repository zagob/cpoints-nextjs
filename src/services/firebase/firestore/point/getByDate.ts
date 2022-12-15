import { query, collection, where, db, getDocs, orderBy } from "../index";

export async function getByDate(idUser: string, month: string, year: string) {
  const q = query(
    collection(db, `users/${idUser}/points`),
    where("dateTime", "==", `${year}/${month}`)
  );

  const queryOrderBy = query(
    collection(db, `users/${idUser}/points`),
    orderBy("created_at", "asc")
  );

  const querySnapshotOrderBy = await getDocs(queryOrderBy);

  const dataOrderBy = querySnapshotOrderBy.docs
    .map((item) => {
      const dataOrderBy = item.data();

      return dataOrderBy;
    })
    .filter((item) => item.dateTime === `${year}/${month}`);

  const querySnapshot = await getDocs(q);

  const data = querySnapshot.docs;

  const filterRemoveHoliday = data
    .map((item) => {
      const data = item.data();

      return data;
    })
    .filter((item) => item.holiday !== true);

  const bonusTotalMinutes = filterRemoveHoliday
    .map((item) => {
      const { bankBalance } = item;

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

  return { bonusTotalMinutes, points: dataOrderBy };
}
