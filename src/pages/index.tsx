import { GoogleLogo } from "phosphor-react";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { onSignInWithGoogle, isLoading, user } = useAuth();

  if (isLoading || user) {
    return <h1>Carregando...</h1>;
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <button
        type="button"
        className="flex items-center gap-2 font-bold text-xl border border-zinc-700 py-4 px-6 rounded bg-zinc-800 transition-all hover:brightness-90"
        onClick={onSignInWithGoogle}
      >
        Entrar com Google
        <GoogleLogo className="text-gray-100" size={30} weight="bold" />
      </button>
    </div>
  );
}
