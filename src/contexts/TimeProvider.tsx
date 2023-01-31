import { format } from "date-fns";
import dayjs from "dayjs";
import { createContext, ReactNode, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { DataFormProps } from "../components/Dashboard/AsideAddPoint";
import { useAuth } from "../hooks/useAuth";
import { createPoint } from "../services/firebase/firestore/point/createPoint";
import { deletePoint } from "../services/firebase/firestore/point/deletePoint";
import { getAllMonthTotalMinutes } from "../services/firebase/firestore/point/getAllMonthTotalMinutes";
import { getByDate } from "../services/firebase/firestore/point/getByDate";
import { existUserIdById } from "../services/firebase/firestore/user/existUserById";
import { timeStringToMinute } from "../utils/timeStringToMinutes";

interface TimeContextProps {
  onSetDateSelected: (date: Date) => void;
  onSetMonthSelected: (date: Date) => void;
  onAddPointTime: (data: DataFormProps, holiday: boolean) => Promise<void>;
  onDeletePoint: (id: string) => Promise<void>;
  onSetPointSelected: (point: PointsProps | null) => void;
  pointSelected: PointsProps | null;
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
  holiday: boolean;
  bankBalance: BankBalanceProps;
}

export const TimeContext = createContext({} as TimeContextProps);

export function TimeProvider({ children }: TimeProviderProps) {
  const { user } = useAuth();
  const [pointSelected, setPointSelected] = useState<PointsProps | null>(null);
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
    queryKey: ["getPointByDate", user, monthSelected],
    queryFn: async () => {
      if (user === null) {
        return;
      }
      const result = await getByDate(user.id, month, year);

      return result;
    },
    onSuccess: (data: { bonusTotalMinutes: number; points: [] }) => {
      if (data) {
        setPoints(data.points);
        setBonusTotalMinutes(data.bonusTotalMinutes);
      }
    },
    enabled: !!user,
    refetchOnWindowFocus: false,
  });

  const { refetch: refetchAllMonth } = useQuery({
    queryKey: ["getAllMonth", year],
    queryFn: async () => {
      const result = await getAllMonthTotalMinutes(user?.id!, year);

      return result;
    },
    onSuccess: (data: number[]) => {
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

  async function onAddPointTime(data: DataFormProps, holiday: boolean) {
    const idUser = user?.id!;

    const formatDateSelected = dayjs(dateSelected).format("YYYY-MM-DD");
    const dateSelectedISO = dayjs(dateSelected).toISOString();

    const existSameDate = points.some(
      (point) =>
        dayjs(point.created_at).format("YYYY-MM-DD") === formatDateSelected
    );

    if (existSameDate) {
      toast.error("Já existe uma data cadastrada");
      return;
    }

    const result = await existUserIdById(idUser);

    if (!result.data?.infoUser) {
      toast.error("Usuario não encontrado");
      return;
    }

    const totalHours = result.data?.infoUser?.totalHours;

    const entryOneToMinutes = timeStringToMinute(data.entryOne);
    const exitOneToMinutes = timeStringToMinute(data.exitOne);
    const entryTwoToMinutes = timeStringToMinute(data.entryTwo);
    const exitTwoToMinutes = timeStringToMinute(data.exitTwo);

    const totalHoursToMinutes = timeStringToMinute(totalHours);

    const timePointToMinutes = {
      entryOne: entryOneToMinutes,
      exitOne: exitOneToMinutes,
      entryTwo: entryTwoToMinutes,
      exitTwo: exitTwoToMinutes,
    };

    const dataPoint = {
      ...timePointToMinutes,
      holiday,
      dateTime: monthSelected,
      created_at: dateSelectedISO,
    };

    await createPoint(idUser, dataPoint, totalHoursToMinutes);

    refetch();
    refetchAllMonth();

    toast.success("Ponto cadastrada com sucesso!");
  }

  function onSetPointSelected(point: PointsProps | null) {
    if (!point) {
      setPointSelected(null);
      return;
    }
    setPointSelected(point);
    const date = new Date(point.created_at);
    onSetDateSelected(date);
  }

  async function onDeletePoint(id: string) {
    try {
      if (!user?.id) {
        toast.error("Nenhum id do Usuário encontrado");
        return;
      }
      const data = await deletePoint(user.id, id);

      if (!data.success) {
        throw new Error(data.message);
      }

      refetch();
      toast.success(data.message);
    } catch (err) {
      toast.error("Erro ao deletar ponto, Tente novamente!");
    }
  }

  return (
    <TimeContext.Provider
      value={{
        dateSelected,
        onSetDateSelected,
        onSetPointSelected,
        pointSelected,
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
