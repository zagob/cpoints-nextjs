import dayjs from "dayjs";
import { useTime } from "../../hooks/useTime";
import { useIs2XL, useIsXL } from "../../utils/mediaQueryHook";
import { TimeMinutesToString } from "../../utils/timeMinutesToString";
import { EmptyDataTable } from "../EmptyDataTable";
import { ModalDeletePoint } from "../modals/ModalDeletePoint";
import * as Checkbox from "@radix-ui/react-checkbox";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { ModalDeletePointsSelected } from "../modals/ModalDeletePointsSelected";

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

export function Table() {
  const isQueryXL = useIsXL();
  const isQuery2XL = useIs2XL();
  const { dataByMonth, isLoadingPoints } = useTime();
  const [checkAllPoints, setCheckAllPoints] = useState(false);
  const [checkPoints, setCheckPoints] = useState<string[]>([]);

  if (isLoadingPoints) {
    return <div>Loading...</div>;
  }

  if (dataByMonth?.points.length === 0) {
    return <EmptyDataTable />;
  }

  return (
    <div className="bg-zinc-800 h-[65%] flex flex-col justify-end">
      <div className="flex items-center justify-between m-2">
        <h4 className="text-lg font-bold py-1">Tabela de Pontos</h4>
        {checkPoints.length > 0 && (
          <ModalDeletePointsSelected idPoints={checkPoints} />
        )}
      </div>
      <section className="h-[100%] overflow-auto rounded relative">
        <table className="table-auto w-full border-collapse rounded-lg text-sm">
          <thead className="bg-slate-700 text-slate-400">
            <tr className="text-left">
              <th className="px-2 py-1">
                <Checkbox.Root
                  id="holiday"
                  className="bg-zinc-900 rounded-md w-3 h-[10px] p-[10px] flex justify-center items-center border border-zinc-700 data-[state=checked]:bg-green-500"
                  checked={checkAllPoints}
                  onCheckedChange={(e: boolean) => {
                    if (e) {
                      setCheckPoints(
                        dataByMonth?.points.map((point) => point.id)!
                      );
                      setCheckAllPoints(true);
                    } else {
                      setCheckPoints([]);
                      setCheckAllPoints(false);
                    }
                  }}
                ></Checkbox.Root>
              </th>
              <th className="px-2 py-1">Data</th>
              <th className="px-2 py-1">Entrada</th>
              <th className="px-2 py-1">Almoço</th>
              <th className="px-2 py-1">Saída</th>
              <th className="px-2 py-1">Total Horas</th>
              <th className="px-2 py-1">Bonús</th>
              <th className="px-2 py-1">Ações</th>
            </tr>
          </thead>
          <tbody>
            {dataByMonth?.points.map((point) => {
              const entryOneTimeString = TimeMinutesToString(point.entryOne);
              const exitOneTimeString = TimeMinutesToString(point.exitOne);
              const entryTwoTimeString = TimeMinutesToString(point.entryTwo);
              const exitTwoTimeString = TimeMinutesToString(point.exitTwo);

              const bonusTimeString = TimeMinutesToString(
                point.bankBalance.bonus
              );
              const timeLunchTimeString = TimeMinutesToString(
                point.bankBalance.timeLunch
              );
              const totalTimeTimeString = TimeMinutesToString(
                point.bankBalance.totalTime
              );

              const dateLg = dayjs(point.created_at).format(
                "DD [de] MMMM, dddd"
              );
              const dateMd = dayjs(point.created_at).format("DD/MM/YYYY");

              const lunchTimeLg = `${exitOneTimeString} - ${entryTwoTimeString} (${timeLunchTimeString})`;
              const lunchTimeMd = `(${timeLunchTimeString})`;
              return (
                <tr
                  key={point.id}
                  className={clsx(
                    "bg-slate-800 border-b border-b-slate-700 font-light",
                    {
                      ["hover:brightness-150 cursor-default"]: !point.holiday,
                      ["opacity-70 bg-slate-900"]: point.holiday,
                    }
                  )}
                >
                  <td className="px-2">
                    <Checkbox.Root
                      id="holiday"
                      className="bg-zinc-900 rounded-md w-3 h-[10px] p-[10px] flex justify-center items-center border border-zinc-700 data-[state=checked]:bg-green-500"
                      checked={checkPoints.includes(point.id)}
                      onCheckedChange={(e: boolean) => {
                        if (e) {
                          setCheckPoints((old) => [...old, point.id]);
                          setCheckAllPoints(
                            checkPoints.length + 1 === dataByMonth.points.length
                          );
                        } else {
                          setCheckPoints((old) =>
                            old.filter((checkPoint) => checkPoint !== point.id)
                          );
                          setCheckAllPoints(false);
                        }
                      }}
                    ></Checkbox.Root>
                  </td>
                  <td className="px-2">{isQuery2XL ? dateLg : dateMd}</td>
                  <td className="px-2">{entryOneTimeString}</td>
                  <td className="px-2">
                    {isQueryXL ? lunchTimeLg : lunchTimeMd}
                  </td>
                  <td className="px-2">{exitTwoTimeString}</td>
                  <td className="px-2">{totalTimeTimeString}</td>
                  <td className="px-2 flex items-center gap-2">
                    {bonusTimeString}
                    <div
                      className={clsx("w-2 h-2 rounded-full", {
                        ["bg-green-400"]: point.bankBalance.status === "UP",
                        ["bg-red-400"]:
                          point.bankBalance.status === "DOWN" && !point.holiday,
                        ["bg-gray-400"]: point.bankBalance.status === "EQUAL",
                        ["bg-blue-600"]:
                          point.bankBalance.status === "DOWN" && point.holiday,
                      })}
                    />
                  </td>
                  <td className="px-2">
                    <ModalDeletePoint idPoint={point.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}
