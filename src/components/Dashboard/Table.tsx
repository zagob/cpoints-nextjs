import dayjs from "dayjs";
import { useTime } from "../../hooks/useTime";
import { useIs2XL, useIsXL } from "../../utils/mediaQueryHook";
import { TimeMinutesToString } from "../../utils/timeMinutesToString";
import { EmptyDataTable } from "../EmptyDataTable";
import { ModalDeletePoint } from "../modals/ModalDeletePoint";

interface THeadProps {
  title: string;
  classNameString?: string;
}

export interface TRowPointProps {
  point: {
    id: string;
    created_at: Date;
    dateTime: string;
    entryOne: number;
    exitOne: number;
    entryTwo: number;
    exitTwo: number;
    holiday: boolean;
    bankBalance: {
      bonus: number;
      status: "UP" | "DOWN" | "EQUAL";
      timeAffternoon: number;
      timeLunch: number;
      timeMorning: number;
      totalTime: number;
    };
  };
}

function THead({ title, classNameString }: THeadProps) {
  return <th className={`pl-6 py-1 ${classNameString}`}>{title}</th>;
}

function TRow({ point }: TRowPointProps) {
  const { pointSelected } = useTime();
  const isQuery2XL = useIs2XL();
  const isQueryXL = useIsXL();
  const {
    id,
    created_at,
    entryOne,
    entryTwo,
    exitOne,
    exitTwo,
    holiday,
    bankBalance: { bonus, status, timeLunch, totalTime },
  } = point;

  const entryOneTimeString = TimeMinutesToString(entryOne);
  const exitOneTimeString = TimeMinutesToString(exitOne);
  const entryTwoTimeString = TimeMinutesToString(entryTwo);
  const exitTwoTimeString = TimeMinutesToString(exitTwo);

  const bonusTimeString = TimeMinutesToString(bonus);
  const timeLunchTimeString = TimeMinutesToString(timeLunch);
  const totalTimeTimeString = TimeMinutesToString(totalTime);

  const dateLg = dayjs(created_at).format("DD [de] MMMM, dddd");
  const dateMd = dayjs(created_at).format("DD/MM/YYYY");

  const lunchTimeLg = `${exitOneTimeString} - ${entryTwoTimeString} (${timeLunchTimeString})`;
  const lunchTimeMd = `(${timeLunchTimeString})`;

  return (
    <tr
      className={`bg-slate-800 border-b border-b-slate-700 font-light ${
        !holiday && "hover:brightness-150 cursor-default"
      } ${holiday && "opacity-70 bg-slate-900"} ${
        pointSelected?.id === id && "brightness-150"
      }`}
    >
      <td className="py-1 px-6">{isQuery2XL ? dateLg : dateMd}</td>
      <td className="py-1 px-6 hidden lg:table-cell">{entryOneTimeString}</td>
      <td className="py-1 px-6 hidden lg:table-cell">
        {isQueryXL ? lunchTimeLg : lunchTimeMd}
      </td>
      <td className="py-1 px-6 hidden md:table-cell">{exitTwoTimeString}</td>
      <td className="py-1 px-6 hidden sm:table-cell">{totalTimeTimeString}</td>
      <td className="py-1 px-6 flex items-center gap-2">
        {bonusTimeString}
        <div
          className={`w-2 h-2 rounded-full ${
            status === "UP"
              ? "bg-green-400"
              : status === "DOWN" && !holiday
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
        </div>
      </td>
    </tr>
  );
}

export function Table() {
  const isQueryXL = useIsXL();
  const isQuery2XL = useIs2XL();
  const { dataByMonth, isLoadingPoints } = useTime();

  if (isLoadingPoints) {
    return <div>Loading...</div>;
  }

  if (dataByMonth?.points.length === 0) {
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
        {dataByMonth?.points.map((point) => {
          return <TRow key={point.id} point={point} />;
        })}
      </tbody>
    </table>
  );
}
