import { useAuthUser } from "@react-query-firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { createContext, ReactNode, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { auth, provider, signOut } from "../services/firebase/auth";
import { db } from "../services/firebase/firestore";

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
      console.log("uid", uid);
      const { data: existUserById } = await api.get(
        `/api/user/existUser?id=${uid}`
      );
      if (!existUserById) {
        if (uid) {
          await setDoc(doc(db, "users", uid), dataUser);
          // await api
          //   .post("/api/user/createUser", dataUser)
          //   .then(() => {
          //     setMessageAuth("Criando usuário...");
          //     setUser(dataUser);
          //   })
          //   .finally(() => {
          //     // setMessageAuth("Authenticado");
          //     router.push("/dashboard");
          //   });
          setMessageAuth("Criando usuário...");
          setUser(dataUser);
          router.push("/dashboard");
          return;
        }
      }
      const { data: dataUserInfo } = await api.get(
        `/api/user/getUser?id=${uid}`
      );
      console.log("dataUserInfo", dataUserInfo);
      setUser(dataUserInfo);
      // setMessageAuth("Authenticado");
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
    // console.log("dataUserInfo", dataUserInfo);
    const result = await getUserById(data?.uid!);

    setUser(result);

    // await updateDoc(doc(db, "users", user?.id!), {
    //   infoUser: dataUserInfo,
    // });
  }

  async function getUserById(uid: string) {
    try {
      const response = await api.get(`/api/user/getUser?id=${uid}`);

      return response.data;
    } catch (err) {}
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
