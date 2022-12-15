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

  // return (
  //   <div className="h-screen flex flex-col gap-2 p-2">
  //     <div className="bg-zinc-800 flex-1 overflow-auto">
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //       <div>{"asd".repeat(20)}</div>
  //     </div>
  //     <div className="bg-zinc-800 h-[300px]">asd</div>
  //   </div>
  // );

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex gap-2 m-2">
        <AsideAddPoint />
        <div className="flex-1 flex flex-col gap-2">
          {isLoadingPoints ? <LoadingDataTable /> : <Table />}
          <Chart />
        </div>
      </main>
    </div>
  );
}
