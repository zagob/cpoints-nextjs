import { useAuthUser } from "@react-query-firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";
import { createContext, ReactNode, useState } from "react";

import { auth, provider, signOut } from "../services/firebase/auth";
import { createUser } from "../services/firebase/firestore/user/createUser";
import { existUserIdById } from "../services/firebase/firestore/user/existUserById";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextProps {
  onSignInWithGoogle: () => Promise<void>;
  onSignOut: () => Promise<void>;
  onSetUserInfo: (dataUserInfo: InfoUserProps) => Promise<void>;
  user: UserProps | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  messageAuth: string | null;
}

interface InfoUserProps {
  entryOne: string;
  entryTwo: string;
  exitOne: string;
  exitTwo: string;
  totalHours: string;
}

interface UserProps {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  infoUser: InfoUserProps | null;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [messageAuth, setMessageAuth] = useState<string | null>(null);
  const [user, setUser] = useState<UserProps | null>(null);
  const { data, isLoading } = useAuthUser(["user"], auth, {
    onSuccess: async (data) => {
      if (!data) {
        setMessageAuth(null);
        setUser(null);
        router.push("/");
        return;
      }
      setMessageAuth("Entrando...");
      const { uid, displayName, photoURL, email } = data;
      const dataUser = {
        id: uid,
        name: displayName,
        avatar_url: photoURL,
        email,
        infoUser: null,
      };
      const { success, data: user } = await existUserIdById(uid);

      if (!success) {
        if (uid) {
          await createUser(uid, {
            avatar_url: photoURL,
            email,
            name: displayName,
          });
          setMessageAuth("Criando usuário...");
          setUser(dataUser);
          router.push("/dashboard");
          return;
        }
      }
      setUser(user!);
      router.push("/dashboard");
      return data;
    },
  });

  const isAuthenticated = user !== null;

  async function onSignOut() {
    await signOut(auth);
  }

  async function onSignInWithGoogle() {
    setMessageAuth("Login...");

    const { user } = await signInWithPopup(auth, provider);

    if (!user) {
      return;
    }
  }

  async function onSetUserInfo(dataUserInfo: InfoUserProps) {
    if (!user?.id) {
      return;
    }

    const { data } = await existUserIdById(user.id);

    setUser(data as UserProps);
  }

  return (
    <AuthContext.Provider
      value={{
        onSignInWithGoogle,
        onSignOut,
        user,
        isLoading,
        onSetUserInfo,
        isAuthenticated,
        messageAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
