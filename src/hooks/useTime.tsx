import { useContext } from "react";
import { TimeContext } from "../contexts/TimeProvider";

export function useTime() {
  const timeContext = useContext(TimeContext);

  return timeContext;
}
