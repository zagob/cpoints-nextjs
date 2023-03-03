import { AsideAddPoint } from "../components/Dashboard/AsideAddPoint";
import { Chart } from "../components/Dashboard/Chart";
import { Table } from "../components/Dashboard/Table";
import { Loading } from "../components/Loading";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const { isLoading, user } = useAuth();

  if (isLoading || !user) {
    return <Loading />;
  }

  return (
    <main className="h-screen xl:p-4 overflow-y-auto overflow-x-hidden sm:overflow-hidden sm:grid sm:grid-cols-2 sm:gap-3 lg:flex">
      <AsideAddPoint />

      <div className="h-full grid grid-rows-6 gap-3 lg:flex-1">
        <Table />

        <Chart />
      </div>
    </main>
  );
}
