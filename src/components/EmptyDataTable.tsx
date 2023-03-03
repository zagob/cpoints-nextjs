import { Newspaper } from "phosphor-react";
import { useTime } from "../hooks/useTime";

export function EmptyDataTable() {
  const { isLoadingPoints } = useTime();

  return (
    <div className="row-span-4 w-full h-full bg-zinc-800 flex-1 flex flex-col justify-center items-center rounded border-2 border-zinc-700">
      <Newspaper size={80} className="opacity-10" />
      <h2 className="text-zinc-600 text-2xl font-bold">
        {isLoadingPoints ? "Loading..." : "Nenhum Dado Encontrado"}
      </h2>
    </div>
  );
}
