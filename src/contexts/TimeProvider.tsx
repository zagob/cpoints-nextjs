import { format } from "date-fns";
import { createContext, ReactNode, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery, QueriesObserver } from "react-query";
import { DataFormProps } from "../components/Dashboard/AsideAddPoint";
import { useAuth } from "../hooks/useAuth";
import { api } from "../services/api";
import { queryClient } from "../services/reactQuery";

interface TimeContextProps {
  onSetDateSelected: (date: Date) => void;
  onSetMonthSelected: (date: Date) => void;
  onAddPointTime: (data: DataFormProps) => Promise<void>;
  onDeletePoint: (id: string) => Promise<void>;
  dateSelected: Date;
  monthSelected: string;
  points: PointsProps[];
  bonusTotalMinutes: number;
  isLoadingPoints: boolean;
  allMinutesMonthChart: number[];
}

interface TimeProviderProps {
  children: ReactNode;
}

interface BankBalanceProps {
  timeMorning: string;
  lunch: string;
  timeAfternoon: string;
  statusPoint: "UP" | "DOWN" | "EQUAL";
  totalTimePoint: string;
  bonusTimePoint: string;
}

interface PointsProps {
  id: string;
  entryOne: string;
  exitOne: string;
  entryTwo: string;
  exitTwo: string;
  dateTime: string;
  created_at: Date;
  bankBalance: BankBalanceProps;
}

export const TimeContext = createContext({} as TimeContextProps);

export function TimeProvider({ children }: TimeProviderProps) {
  const { user } = useAuth();
  const [dateSelected, setDateSelected] = useState<Date>(new Date());
  const [monthSelected, setMonthSelected] = useState(
    format(new Date(), "yyyy/MM")
  );
  const [points, setPoints] = useState<PointsProps[]>([]);
  const [bonusTotalMinutes, setBonusTotalMinutes] = useState(0);

  const [allMinutesMonthChart, setAllMinutesMonthChart] = useState<number[]>(
    []
  );

  const [year, month] = monthSelected.split("/");
  const { refetch, isLoading: isLoadingPoints } = useQuery({
    queryKey: ["getPointByDate", monthSelected],
    queryFn: async () => {
      const result = await api.get(
        `/api/point/getByDate?userId=${user?.id}&year=${year}&month=${month}`
      );
      return result;
    },
    onSuccess: ({ data }) => {
      setPoints(data.points);
      setBonusTotalMinutes(data.bonusTotalMinutes);
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  const { refetch: refetchAllMonth } = useQuery({
    queryKey: ["getAllMonth"],
    queryFn: async () => {
      const result = await api.get(
        `/api/point/getAllMonthBonusTotalMinutes?userId=${user?.id}&year=${year}`
      );

      return result;
    },
    onSuccess: ({ data }) => {
      setAllMinutesMonthChart(data);
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  function onSetDateSelected(date: Date) {
    setDateSelected(date);
  }

  function onSetMonthSelected(date: Date) {
    setMonthSelected(format(new Date(date), "yyyy/MM"));
  }

  async function onAddPointTime(data: DataFormProps) {
    const dateIsoString = dateSelected.toISOString();

    const [getYearMonthDate] = dateIsoString.split("T");

    const verifySomeDate = points
      .map((point) => new Date(point.created_at).toISOString().split("T")[0])
      .some((point) => point === getYearMonthDate);

    if (verifySomeDate) {
      toast.error("Já existe uma data cadastrada");
      return;
    }

    await api.post(`/api/point/create?idUser=${user?.id}`, {
      ...data,
      dateTime: monthSelected,
      created_at: dateIsoString,
    });

    refetch();
    refetchAllMonth();

    toast.success("Data cadastrada com sucesso!");
  }

  async function onDeletePoint(id: string) {
    try {
      const { data } = await api.delete(`/api/point/${id}?userId=${user?.id}`);

      if (data.message === "Point delete success") {
        toast.success("Ponto deletado com sucesso!");
        setPoints((oldState) => oldState.filter((point) => point.id !== id));
      }
    } catch (err) {
      toast.error("Erro ao deletar ponto, Tente novamente!");
    }
  }

  return (
    <TimeContext.Provider
      value={{
        dateSelected,
        onSetDateSelected,
        monthSelected,
        onSetMonthSelected,
        bonusTotalMinutes,
        points,
        isLoadingPoints,
        onAddPointTime,
        onDeletePoint,
        allMinutesMonthChart,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
}
