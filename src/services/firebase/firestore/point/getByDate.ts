import { query, collection, where, db, getDocs } from "../index";

interface PointProps {
  id: string;
  created_at: Date;
  dateTime: string;
  entryOne: number;
  exitOne: number;
  entryTwo: number;
  exitTwo: number;
  holiday: boolean;
  bankBalance: {
    bonus: number;
    status: "UP" | "DOWN" | "EQUAL";
    timeAffternoon: number;
    timeLunch: number;
    timeMorning: number;
    totalTime: number;
  };
}

export interface DataByMonthProps {
  totalMinutesByMonth: number;
  points: PointProps[];
}

export async function getByDate(idUser: string, month: string, year: string) {
  const queryOfMonthAndYear = query(
    collection(db, `users/${idUser}/pTest`),
    where("dateTime", "==", `${year}/${month}`)
  );

  const getDataSnapShot = await getDocs(queryOfMonthAndYear);
  const getDataMonthAndYear = getDataSnapShot.docs.map((point) => {
    const data = point.data() as PointProps;

    return data;
  });

  const sortData = getDataMonthAndYear.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateA - dateB;
  });

  const totalMinutesByMonth = getDataMonthAndYear.reduce((acc, value) => {
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
  }, 0);

  console.log("sortData", sortData);

  return { totalMinutesByMonth, points: sortData };
}
