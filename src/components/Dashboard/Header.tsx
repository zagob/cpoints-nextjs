import Image from "next/image";
import { Power, UserCircle } from "phosphor-react";
import { useAuth } from "../../hooks/useAuth";

export function Header() {
  const { onSignOut, user } = useAuth();

  return (
    <header className="flex items-center justify-between px-10 mt-4 w-full absolute">
      <div className="flex items-center gap-2">
        {user?.avatar_url ? (
          <Image
            src={user?.avatar_url}
            width={32}
            height={32}
            alt="avatar"
            className="rounded-full outline outline-zinc-700 outline-offset-3"
          />
        ) : (
          <UserCircle
            size={32}
            className="rounded-full outline outline-zinc-700 outline-offset-3"
          />
        )}

        <span className="md:text-sm text-lg">{user?.name}</span>
      </div>
      <button type="button" title="Deslogar" onClick={onSignOut}>
        <Power
          size={26}
          weight="regular"
          className="text-red-400 hover:brightness-90 transition-all"
        />
      </button>
    </header>
  );
}
