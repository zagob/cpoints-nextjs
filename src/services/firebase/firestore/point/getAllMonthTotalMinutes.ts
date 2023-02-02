import { MessageErr } from "../../../../errors/returnMessageError";
import { query, collection, where, getDocs, db } from "../index";

export type DataAllMonthOfYearProps = number[] | undefined;

export async function getAllMonthTotalMinutes(idUser: string, year: string) {
  try {
    const allMonthsAtSix = Array.from({ length: 6 }).map(
      (_, index) => `${year}/${String(index + 1).padStart(2, "0")}`
    );
    const allMonthsOfSixAtEnd = Array.from({ length: 6 }).map(
      (_, index) => `${year}/${String(index + 7).padStart(2, "0")}`
    );

    const allMonthsOfYear = allMonthsAtSix
      .concat(allMonthsOfSixAtEnd)
      .map((month) => ({ month: month.split("/")[1].toString() }));

    const querySnapshotAllMonthsAtSix = await getDocs(
      query(
        collection(db, `users/${idUser}/points`),
        where("dateTime", "in", allMonthsAtSix)
      )
    );

    const querySnapshotAllMonthsOfSixAtEnd = await getDocs(
      query(
        collection(db, `users/${idUser}/points`),
        where("dateTime", "in", allMonthsOfSixAtEnd)
      )
    );

    const returnQuerySnapshotAllMonthsAtSix = querySnapshotAllMonthsAtSix.docs
      .map((item) => item.data())
      .concat(querySnapshotAllMonthsOfSixAtEnd.docs.map((item) => item.data()));

    const monthsOfTotalMinutes = allMonthsOfYear.map((month) => ({
      ...month,
      totalMinutesMonth: returnQuerySnapshotAllMonthsAtSix
        .filter((item) => item.dateTime.split("/")[1] === month.month ?? [])
        .map((item) => ({
          holiday: item.holiday,
          bankBalance: {
            bonus: item.bankBalance.bonus,
            status: item.bankBalance.status,
          },
        }))
        .reduce((acc, value) => {
          const bonus = value.bankBalance.bonus;

          if (value.holiday) {
            return acc;
          }

          if (value.bankBalance.status === "UP") {
            acc += bonus;
          }

          if (value.bankBalance.status === "DOWN") {
            acc -= bonus;
          }

          return acc;
        }, 0),
    }));

    return monthsOfTotalMinutes.map((item) => item.totalMinutesMonth);
  } catch (err) {
    return Array.from({ length: 12 }).map((_, i) => i + 1);
  }
}
