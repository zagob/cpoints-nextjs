import { ArrowRight, List } from "phosphor-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { AsideAddPoint } from "../components/Dashboard/AsideAddPoint";
import { Chart } from "../components/Dashboard/Chart";
import { Header } from "../components/Dashboard/Header";
import { Table } from "../components/Dashboard/Table";
import { Loading } from "../components/Loading";
import { LoadingDataTable } from "../components/LoadingDataTable";
import { useAuth } from "../hooks/useAuth";
import { useTime } from "../hooks/useTime";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../services/firebase/firestore";
import dayjs from "dayjs";
import { timeStringToMinute } from "../utils/timeStringToMinutes";
import { BankBalanceTime } from "../utils/transformBankBalanceTime";
import { createPoint } from "../services/firebase/firestore/point/createPoint";

export default function Dashboard() {
  const [dropdown, setDropdown] = useState(false);
  const { isLoading, user } = useAuth();
  const { isLoadingPoints } = useTime();

  if (isLoading || !user) {
    return <Loading />;
  }

  // async function addPoint() {

  //   points.map(async (point) => {
  //     await createPoint(
  //       user?.id!,
  //       {
  //         entryOne: point.entryOne,
  //         exitOne: point.exitOne,
  //         entryTwo: point.entryTwo,
  //         exitTwo: point.exitTwo,
  //         holiday: point.holiday ?? false,
  //         created_at: point.created_at,
  //         dateTime: point.dateTime,
  //       },
  //       480
  //     );
  //   });
  // }

  async function getAll() {
    const p = collection(db, `users/${user?.id!}/points`);
    const docSnap = await getDocs(p);

    console.log(
      docSnap.docs.map((doc) => {
        const d = doc.data();

        const entryOneToMinutes = timeStringToMinute(d.entryOne);
        const exitOneToMinutes = timeStringToMinute(d.exitOne);
        const entryTwoToMinutes = timeStringToMinute(d.entryTwo);
        const exitTwoToMinutes = timeStringToMinute(d.exitTwo);

        const bankBalance = BankBalanceTime(480, {
          entryOne: entryOneToMinutes,
          exitOne: exitOneToMinutes,
          entryTwo: entryTwoToMinutes,
          exitTwo: exitTwoToMinutes,
        });

        return {
          entryOne: entryOneToMinutes,
          exitOne: exitOneToMinutes,
          entryTwo: entryTwoToMinutes,
          exitTwo: exitTwoToMinutes,
          bankBalance,
          dateTime: d.dateTime,
          created_at: d.created_at,
          holiday: d.holiday,
        };
      })
    );
  }

  // return (
  //   <div className="flex flex-col gap-10">
  //     <button onClick={getAll}>get all points</button>
  //   </div>
  // );

  return (
    <div className="h-screen flex flex-col relative overflow-x-hidden">
      <Header />
      <motion.div
        animate={dropdown ? { right: 0 } : { right: "-100%" }}
        transition={{ duration: 0.5 }}
        className={`sm:hidden absolute w-full -right-[100%] bg-zinc-700 h-full z-50 top-12`}
      >
        <div
          onClick={() => setDropdown((old) => !old)}
          className="w-[50px] -left-12 absolute top-4 bg-zinc-700 rounded-l-lg shadow-lg"
        >
          <List size={32} className="pl-1" />
        </div>
        <motion.div
          animate={dropdown ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute left-2 top-2"
        >
          <ArrowRight
            className="text-gray-300"
            size={32}
            onClick={() => setDropdown(false)}
          />
        </motion.div>
        <div className="absolute flex flex-col w-full top-12 pb-4">
          <div className="w-full flex-1 overflow-y-auto">
            <Table />
          </div>
          <div className="w-full h-[250px]">
            <Chart />
          </div>
        </div>
      </motion.div>
      <main className="h-full m-2 flex gap-2 relative overflow-hidden sm:overflow-y-auto">
        <section className="bg-zinc-800 w-full sm:w-[380px] py-2 rounded">
          <AsideAddPoint />
        </section>
        <div className="flex-1 hidden sm:flex flex-col gap-2">
          <section className="bg-zinc-800 h-[65%] overflow-auto rounded relative">
            {isLoadingPoints ? <LoadingDataTable /> : <Table />}
          </section>
          <section className="bg-zinc-800 flex-1 rounded">
            <Chart />
          </section>
        </div>
      </main>
    </div>
  );
}
