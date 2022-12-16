import { List } from "phosphor-react";
import { AsideAddPoint } from "../components/Dashboard/AsideAddPoint";
import { Chart } from "../components/Dashboard/Chart";
import { Header } from "../components/Dashboard/Header";
import { Table } from "../components/Dashboard/Table";
import { Loading } from "../components/Loading";
import { LoadingDataTable } from "../components/LoadingDataTable";
import { useAuth } from "../hooks/useAuth";
import { useTime } from "../hooks/useTime";

export default function Dashboard() {
  const { isLoading, user } = useAuth();
  const { isLoadingPoints } = useTime();

  if (isLoading || !user) {
    return <Loading />;
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative sm:flex gap-2 m-2">
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
      </main>
    </div>
  );
}
