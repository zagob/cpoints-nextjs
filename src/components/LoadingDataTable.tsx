import { CircleNotch, CirclesThree } from "phosphor-react";

export function LoadingDataTable() {
  return (
    <div className="w-full h-full bg-zinc-800 flex-1 flex flex-col justify-center items-center">
      <CircleNotch size={40} className="animate-spin text-zinc-500" />
      <span className="text-2xl text-zinc-500">Carregando dados...</span>
    </div>
  );
}
