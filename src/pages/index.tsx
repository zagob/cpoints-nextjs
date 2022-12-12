import { GoogleLogo } from "phosphor-react";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { onSignInWithGoogle, isLoading, user, isAuthenticated, messageAuth } =
    useAuth();

  return (
    <div className="h-screen flex items-center justify-center">
      <button
        type="button"
        className="flex items-center gap-2 font-bold text-xl border border-zinc-700 py-4 px-6 rounded bg-zinc-800 transition-all hover:brightness-90 disabled:brightness-75 disabled:opacity-40 disabled:cursor-not-allowed"
        onClick={onSignInWithGoogle}
        disabled={messageAuth !== null}
      >
        {messageAuth === null ? "Entrar com Google" : messageAuth}
        {messageAuth === null ? (
          <>
            <div>
              <GoogleLogo className="text-gray-100" size={30} weight="bold" />
            </div>
          </>
        ) : (
          <div>
            <div className="w-4 h-4 border-l rounded-full animate-spin" />
          </div>
        )}
      </button>
    </div>
  );
}
