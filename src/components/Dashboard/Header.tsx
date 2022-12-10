import { Power } from "phosphor-react";
import { useAuth } from "../../hooks/useAuth";
import { ModalInfoUser } from "../modals/ModalInfoUser";

interface TimeProps {
  title: string;
  value: string | undefined;
  isDisabled: boolean;
}

function Time({ title, value, isDisabled }: TimeProps) {
  const valueIsDisabled = "00:00";
  return (
    <div
      className={`p-2 border border-gray-600 rounded bg-zinc-900 text-zinc-300 text-xs ${
        isDisabled && "opacity-40 cursor-not-allowed"
      }`}
    >
      <span className="">{title}: </span>
      <span className="font-bold text-zinc-200">
        {isDisabled ? valueIsDisabled : value}
      </span>
    </div>
  );
}

export function Header() {
  const { onSignOut, user } = useAuth();

  return (
    <header className="h-[60px] flex items-center justify-between px-10 bg-zinc-700">
      <div className="flex items-center justify-between">
        <h1>logo</h1>
        <div className="ml-32 mr-4 flex items-center gap-2">
          <Time
            isDisabled={!user?.infoUser}
            title="Entrada 1"
            value={user?.infoUser?.entryOne}
          />
          <Time
            isDisabled={!user?.infoUser}
            title="Saída 1"
            value={user?.infoUser?.exitOne}
          />
          <Time
            isDisabled={!user?.infoUser}
            title="Entrada 2"
            value={user?.infoUser?.entryTwo}
          />
          <Time
            isDisabled={!user?.infoUser}
            title="Saída 2"
            value={user?.infoUser?.exitTwo}
          />
          -
          <Time
            isDisabled={!user?.infoUser}
            title="Total de Horas"
            value={user?.infoUser?.totalHours}
          />
        </div>
        <ModalInfoUser />
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <span className="text-lg">{user?.name}</span>
        </div>
        <button type="button" title="Deslogar" onClick={onSignOut}>
          <Power
            size={26}
            weight="regular"
            className="text-red-400 hover:brightness-90 transition-all"
          />
        </button>
      </div>
    </header>
  );
}