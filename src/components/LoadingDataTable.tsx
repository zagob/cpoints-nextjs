import { CircleNotch } from "phosphor-react";

export function LoadingDataTable() {
  return (
    <div className="w-full h-full flex-1 flex flex-col justify-center items-center">
      <CircleNotch size={40} className="animate-spin text-zinc-500" />
      <span className="text-2xl text-zinc-500">Carregando dados...</span>
    </div>
  );
}
