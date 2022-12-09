import { AsideAddPoint } from "../components/Dashboard/AsideAddPoint";
import { Chart } from "../components/Dashboard/Chart";
import { Header } from "../components/Dashboard/Header";
import { Table } from "../components/Dashboard/Table";
import { useAuth } from "../hooks/useAuth";
import { useTime } from "../hooks/useTime";

export default function Dashboard() {
  const { isLoading, user } = useAuth();
  const { isLoadingPoints } = useTime();

  if (isLoading || !user) {
    return <h1>Carregando...</h1>;
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex gap-2 m-2">
        <AsideAddPoint />
        <div className="flex-1 flex flex-col gap-2">
          <div className="bg-zinc-800 flex-1">
            {isLoadingPoints ? "Loading" : <Table />}
          </div>
          <div className="bg-zinc-800 h-[280px]">
            <Chart />
          </div>
        </div>
      </main>
    </div>
  );
}
