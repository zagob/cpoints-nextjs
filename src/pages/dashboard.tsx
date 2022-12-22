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

export default function Dashboard() {
  const [dropdown, setDropdown] = useState(false);
  const { isLoading, user } = useAuth();
  const { isLoadingPoints } = useTime();

  if (isLoading || !user) {
    return <Loading />;
  }

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
