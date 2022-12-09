import { useAuthUser } from "@react-query-firebase/auth";
import {
  GoogleAuthProvider,
  signInWithPopup,
  Auth,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { api } from "../services/api";
import { auth, provider, signOut } from "../services/firebase/auth";

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextProps {
  onSignInWithGoogle: () => Promise<void>;
  onSignOut: () => Promise<void>;
  onSetUserInfo: (dataUserInfo: InfoUserProps) => Promise<void>;
  user: UserProps | null;
  isLoading: boolean;
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
  const [user, setUser] = useState<UserProps | null>(null);
  const { data, isLoading } = useAuthUser(["user"], auth, {
    onSuccess: async (data) => {
      if (!data) {
        setUser(null);
        return router.push("/");
      }

      const { uid, displayName, email, photoURL } = data;

      const result = await getUserById(uid);

      if (!result) {
        await onSignOut();
        return;
      }
      setUser(result);

      router.push("/dashboard");
    },
  });

  async function onSignOut() {
    await signOut(auth);
  }

  async function onSignInWithGoogle() {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential?.accessToken;

        const { displayName, email, photoURL, uid } = result.user;

        const userData = {
          id: uid,
          email,
          name: displayName,
          avatar_url: photoURL,
          infoUser: null,
        };

        const { data } = await api.get(`/api/user/existUser?id=${uid}`);

        if (!data) {
          await api.post("/api/user/createUser", userData);
          setUser(userData);
          return;
        }

        setUser(userData);
      })
      .catch((error) => {});
  }

  async function onSetUserInfo(dataUserInfo: InfoUserProps) {
    const result = (await getUserById(data?.uid!)) as UserProps;

    setUser(result);
  }

  async function getUserById(uid: string) {
    try {
      const response = await api.get(`/api/user/getUser?id=${uid}`);

      return response.data;
    } catch (err) {}
  }

  return (
    <AuthContext.Provider
      value={{ onSignInWithGoogle, onSignOut, user, isLoading, onSetUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
}
