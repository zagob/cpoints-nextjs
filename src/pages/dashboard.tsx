import { List } from "phosphor-react";
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
    <div className="h-screen flex flex-col relative overflow-hidden">
      <Header />
      {/* <div className="absolute w-full border -right-[90%]">asdasd</div> */}
      <motion.div
        // initial={{  scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1 }}
        className={`absolute w-full bg-zinc-700 h-full z-50 top-16 
        ${
          dropdown ? "" : "-right-[100%]"
        } 
        `}
      >
        <div
          onClick={() => setDropdown((old) => !old)}
          className="w-[60px] -left-12 absolute bg-zinc-700 rounded-l-lg shadow-lg"
        >
          <List size={32} className="pl-1" />
        </div>
      </motion.div>
      <main className="h-full m-2 flex gap-2 relative overflow-hidden sm:overflow-y-auto">
        <section className="bg-zinc-800 w-full sm:w-[380px] py-2 rounded">
          <AsideAddPoint />
        </section>
        <div className="flex-1 hidden sm:flex flex-col gap-2">
          <section className="bg-zinc-800 h-[65%] overflow-auto rounded relatie">
            {isLoadingPoints ? <LoadingDataTable /> : <Table />}
          </section>
          <section className="bg-zinc-800 flex-1 rounded">
            <Chart />
          </section>
        </div>
      </main>
      {/* <main className="flex-1 relative sm:flex gap-2 m-2">
        <div className="absolute sm:hidden hover:brightness-110 cursor-pointer -right-2 bg-zinc-700 w-12 shadow-lg shadow-zinc-900 rounded-l-lg">
          <List size={32} className="pl-1" />
        </div>
        <AsideAddPoint />
        <div className="hidden flex-1 sm:flex flex-col gap-2 h-full">
          <div className="h-[450px] overflow-auto bg-zinc-800 rounded overflow-x-auto">
            {isLoadingPoints ? <LoadingDataTable /> : <Table />}
          </div>
          <Chart />
        </div>
      </main> */}
    </div>
  );
}
