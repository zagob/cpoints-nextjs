import { Newspaper } from "phosphor-react";

export function EmptyDataTable() {
  return (
    <div className="w-full h-full bg-zinc-800 flex-1 flex flex-col justify-center items-center">
      <Newspaper size={80} className="opacity-10" />
      <h2 className="text-zinc-600 text-2xl font-bold">
        Nenhum Dado Encontrado
      </h2>
    </div>
  );
}
