import { format } from "date-fns";
import ptBR from "date-fns/locale/pt";
import { useTime } from "../../hooks/useTime";
import { useIs2XL, useIsXL } from "../../utils/mediaQueryHook";
import { EmptyDataTable } from "../EmptyDataTable";
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
    holiday: boolean;
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
  const isQuery2XL = useIs2XL();
  const isQueryXL = useIsXL();
  const {
    dateTime,
    id,
    created_at,
    entryOne,
    entryTwo,
    exitOne,
    exitTwo,
    holiday,
    bankBalance: { lunch, totalTimePoint, statusPoint, bonusTimePoint },
  } = point;

  const dateLg = format(new Date(created_at), "dd 'de' MMMM, EEEE", {
    locale: ptBR,
  });

  const dateMd = format(new Date(created_at), "dd/MM/yyyy", {
    locale: ptBR,
  });

  const lunchTimeLg = `${exitOne} - ${entryTwo} (${lunch})`;
  const lunchTimeMd = `(${lunch})`;

  return (
    <tr
      className={`bg-slate-800 border-b border-b-slate-700 font-light ${
        !holiday && "hover:brightness-150 cursor-default"
      } ${holiday && "opacity-70 bg-slate-900"}`}
    >
      <td className="py-1 px-6">{isQuery2XL ? dateLg : dateMd}</td>
      <td className="py-1 px-6 hidden lg:table-cell">{entryOne}</td>
      <td className="py-1 px-6 hidden lg:table-cell">
        {isQueryXL ? lunchTimeLg : lunchTimeMd}
      </td>
      <td className="py-1 px-6 hidden md:table-cell">{exitTwo}</td>
      <td className="py-1 px-6 hidden sm:table-cell">{totalTimePoint}</td>
      <td className="py-1 px-6 flex items-center gap-2">
        {bonusTimePoint}
        <div
          className={`w-2 h-2 rounded-full ${
            statusPoint === "UP"
              ? "bg-green-400"
              : statusPoint === "DOWN" && !holiday
              ? "bg-red-400"
              : holiday
              ? "bg-blue-600"
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
  const isQueryXL = useIsXL();
  const isQuery2XL = useIs2XL();
  const { points, isLoadingPoints } = useTime();

  if (isLoadingPoints) {
    return <div>Loading...</div>;
  }

  if (points.length === 0) {
    return <EmptyDataTable />;
  }

  return (
    <table className="table-auto w-full border-collapse rounded-lg text-left text-sm">
      <thead className="bg-slate-700 text-slate-400">
        <tr>
          <THead
            title="Data"
            classNameString={`${!isQuery2XL ? "w-[180px]" : "w-[295px]"} `}
          />
          <THead title="Entrada" classNameString="hidden lg:table-cell" />
          <THead
            title="Almoço"
            classNameString={`${
              isQueryXL ? "w-[250px]" : "w-[150px]"
            } hidden lg:table-cell`}
          />
          <THead title="Saída" classNameString="hidden md:table-cell" />
          <THead title="Total Horas" classNameString="hidden sm:table-cell" />
          <THead title="Bonús" />
          <THead title="Ações" />
        </tr>
      </thead>
      <tbody>
        {points.map((point) => {
          return <TRow key={point.id} point={point} />;
        })}
      </tbody>
    </table>
  );

  return (
    <table className="table-auto border-collapse rounded-lg w-full">
      <thead className="text-left m-2 bg-slate-700 text-slate-400 text-sm">
        <tr>
          <THead
            title="Data"
            classNameString={`${!isQuery2XL ? "w-[180px]" : "w-[295px]"} `}
          />
          <THead title="Entrada" classNameString="hidden lg:table-cell" />
          <THead
            title="Almoço"
            classNameString={`${
              isQueryXL ? "w-[250px]" : "w-[150px]"
            } hidden lg:table-cell`}
          />
          <THead title="Saída" classNameString="hidden md:table-cell" />
          <THead title="Total Horas" classNameString="hidden sm:table-cell" />
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
  );
}
