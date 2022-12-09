import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";

export function useAuth() {
  const authContext = useContext(AuthContext);

  return authContext;
}
