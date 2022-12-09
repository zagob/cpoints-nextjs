import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { app } from ".";

const provider = new GoogleAuthProvider();
const auth = getAuth(app);

export { provider, auth, signInWithPopup, signOut };
