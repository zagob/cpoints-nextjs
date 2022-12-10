import { useAuthUser } from "@react-query-firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";
import { createContext, ReactNode, useState } from "react";
import toast from "react-hot-toast";
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
  isAuthenticated: boolean;
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
      console.log('dataaaa', !!data)
      if (!data) {
        setUser(null);
        return router.push("/");
      }

      const { uid } = data;

      const result = await getUserById(uid);

      console.log('result',result)

      if (!result) {
        await onSignOut();
        return;
      }
      setUser(result);

      router.push("/dashboard");

      return data;
    },
  });

  const isAuthenticated = user !== null;

  console.log('data',data)
  console.log('isAuthenticated',isAuthenticated)

  async function onSignOut() {
    await signOut(auth);
  }

  async function onSignInWithGoogle() {
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential?.accessToken;

        const { displayName, email, photoURL, uid } = result.user;

        let userData = {
          id: uid,
          email,
          name: displayName,
          avatar_url: photoURL,
          infoUser: null,
        };

        const { data } = await api.get(`/api/user/existUser?id=${uid}`);

        console.log('data Login', data)
        if (!data) {
          await api.post("/api/user/createUser", userData);
          setUser(userData);
          return;
        }
        const { data: dataUserInfo } = await api.get(`/api/user/getUser?id=${uid}`)
        setUser(dataUserInfo);
      })
      .catch((error) => {}).finally(() => {
        toast.success('Authenticado')
      })
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
      value={{ onSignInWithGoogle, onSignOut, user, isLoading, onSetUserInfo, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}
