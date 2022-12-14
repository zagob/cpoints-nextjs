import { format } from "date-fns";
import { createContext, ReactNode, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "react-query";
import { DataFormProps } from "../components/Dashboard/AsideAddPoint";
import { useAuth } from "../hooks/useAuth";
import { createPoint } from "../services/firebase/firestore/point/createPoint";
import { deletePoint } from "../services/firebase/firestore/point/deletePoint";
import { getAllMonthTotalMinutes } from "../services/firebase/firestore/point/getAllMonthTotalMinutes";
import { getByDate } from "../services/firebase/firestore/point/getByDate";
import { updatePoint } from "../services/firebase/firestore/point/updatePoint";
import { existUserIdById } from "../services/firebase/firestore/user/existUserById";

interface TimeContextProps {
  onSetDateSelected: (date: Date) => void;
  onSetMonthSelected: (date: Date) => void;
  onAddPointTime: (data: DataFormProps, holiday: boolean) => Promise<void>;
  onUpdatePointTime: (
    idPoint: string,
    data: DataFormProps,
    holiday: boolean
  ) => Promise<void>;
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
      console.log("carregando");
      const result = await getAllMonthTotalMinutes(user?.id!, year);

      return result;
    },
    onSuccess: (data: number[]) => {
      console.log("carregou");
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
    const dateIsoString = dateSelected.toISOString();

    const [getYearMonthDate] = dateIsoString.split("T");

    const verifySomeDate = points
      .map((point) => new Date(point.created_at).toISOString().split("T")[0])
      .some((point) => point === getYearMonthDate);

    if (verifySomeDate) {
      toast.error("J?? existe uma data cadastrada");
      return;
    }

    const result = await existUserIdById(idUser);

    if (!result.data?.infoUser) {
      toast.error("Usuario n??o encontrado");
      return;
    }

    const totalHours = result.data?.infoUser?.totalHours;

    const dataPoint = {
      ...data,
      holiday,
      dateTime: monthSelected,
      created_at: dateIsoString,
    };

    await createPoint(idUser, dataPoint, totalHours);

    refetch();
    refetchAllMonth();

    toast.success("Ponto cadastrada com sucesso!");
  }

  async function onUpdatePointTime(
    idPoint: string,
    data: DataFormProps,
    holiday: boolean
  ) {
    const idUser = user?.id!;
    const dateIsoString = dateSelected.toISOString();

    const [getYearMonthDate] = dateIsoString.split("T");

    const verifySomeDate = points
      .map((point) => new Date(point.created_at).toISOString().split("T")[0])
      .filter((point) => !(point === getYearMonthDate))
      .some((point) => point === getYearMonthDate);

    if (verifySomeDate) {
      toast.error("J?? existe uma data cadastrada");
      return;
    }

    const result = await existUserIdById(idUser);

    if (!result.data?.infoUser) {
      toast.error("Usuario n??o encontrado");
      return;
    }

    const totalHours = result.data?.infoUser?.totalHours;

    const dataPoint = {
      ...data,
      holiday,
      dateTime: monthSelected,
      created_at: dateIsoString,
    };

    await updatePoint(idUser, idPoint, dataPoint, totalHours);

    refetch();
    refetchAllMonth();

    toast.success("Ponto Editado com sucesso!");
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
        toast.error("Nenhum id do Usu??rio encontrado");
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
        onUpdatePointTime,
        onDeletePoint,
        allMinutesMonthChart,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
}
