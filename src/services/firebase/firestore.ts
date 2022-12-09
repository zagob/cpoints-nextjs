import {
  getFirestore,
  setDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  addDoc,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { app } from ".";

const db = getFirestore(app);

export {
  db,
  setDoc,
  query,
  doc,
  where,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
  serverTimestamp,
};
