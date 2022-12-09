import { format } from "date-fns";
import ptBR from "date-fns/locale/pt";
import { useTime } from "../../hooks/useTime";
import { ModalDeletePoint } from "../modals/ModalDeletePoint";
import { ModalInfoPoint } from "../modals/ModalInfoPoint";

interface THeadProps {
  title: string;
  classNameString?: string;
}

export interface TRowPointProps {
  point: {
    id: string;
    entryOne: string;
    entryTwo: string;
    exitOne: string;
    exitTwo: string;
    dateTime: string;
    created_at: Date;
    bankBalance: {
      timeMorning: string;
      lunch: string;
      timeAfternoon: string;
      bonusTimePoint: string;
      totalTimePoint: string;
      statusPoint: "DOWN" | "EQUAL" | "UP";
    };
  };
}

function THead({ title, classNameString }: THeadProps) {
  return <th className={`pl-6 py-1 ${classNameString}`}>{title}</th>;
}

function TRow({ point }: TRowPointProps) {
  const {
    dateTime,
    id,
    created_at,
    entryOne,
    entryTwo,
    exitOne,
    exitTwo,
    bankBalance: { lunch, totalTimePoint, statusPoint, bonusTimePoint },
  } = point;

  const date = format(new Date(created_at), "dd 'de' MMMM, EEEE", {
    locale: ptBR,
  });

  const lunchTime = `${exitOne} - ${entryTwo} (${lunch})`;

  return (
    <tr className="bg-slate-800 border-b border-b-slate-700">
      <td className="py-1 px-6">{date}</td>
      <td className="py-1 px-6">{entryOne}</td>
      <td className="py-1 px-6">{lunchTime}</td>
      <td className="py-1 px-6">{exitTwo}</td>
      <td className="py-1 px-6">{totalTimePoint}</td>
      <td className="py-1 px-6 flex items-center gap-2">
        {bonusTimePoint}
        <div
          className={`w-2 h-2 rounded-full ${
            statusPoint === "UP"
              ? "bg-green-400"
              : statusPoint === "DOWN"
              ? "bg-red-400"
              : "bg-gray-400"
          }`}
        />
      </td>
      <td className="py-1 px-6">
        <div className="flex items-center gap-1">
          <ModalDeletePoint idPoint={id} />
          <ModalInfoPoint point={point} />
        </div>
      </td>
    </tr>
  );
}

export function Table() {
  const { points, isLoadingPoints } = useTime();

  if (isLoadingPoints) {
    return <div>Loading...</div>;
  }

  if (points.length === 0) {
    return <div>Nenhum dado encontrado</div>;
  }
  return (
    <div className="overflow-auto">
      <table className="table-fixed border-collapse rounded-lg w-full">
        <thead className="text-left m-2 bg-slate-700 text-slate-400 text-sm">
          <tr>
            <THead title="Data" classNameString="w-[300px]" />
            <THead title="Entrada" />
            <THead title="Almoço" classNameString="w-[250px]" />
            <THead title="Saída" />
            <THead title="Total Horas" />
            <THead title="Bonús" />
            <THead title="Ações" />
          </tr>
        </thead>
        <tbody className="text-sm text-slate-300">
          {points.map((point) => {
            return <TRow key={point.id} point={point} />;
          })}
        </tbody>
      </table>
    </div>
  );
}
