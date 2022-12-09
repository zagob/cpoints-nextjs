import { InputMask } from "../../components/InputMask";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";

import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import ptBr from "date-fns/locale/pt";
import { useTime } from "../../hooks/useTime";
import { TimeMinutesToString } from "../../utils/timeMinutesToString";
import { Clock } from "phosphor-react";

export interface DataFormProps {
  entryOne: string;
  exitOne: string;
  entryTwo: string;
  exitTwo: string;
}

export function AsideAddPoint() {
  const { user } = useAuth();
  const {
    dateSelected,
    onSetDateSelected,
    onSetMonthSelected,
    points,
    bonusTotalMinutes,
    onAddPointTime,
  } = useTime();
  const { handleSubmit, register, reset } = useForm<DataFormProps>();

  async function handleSubmitData(data: DataFormProps) {
    await onAddPointTime(data);
    reset();
  }

  const disabledDays = points.map((point) => new Date(point.created_at));

  const bonusTotalMinutesStatus = Math.sign(bonusTotalMinutes);

  return (
    <div className="bg-zinc-800 w-[380px] flex flex-col items-center">
      <span
        className={`border mt-4 p-1 px-3 rounded bg-zinc-900 text-md flex items-center gap-2 ${
          bonusTotalMinutesStatus === 1
            ? "border-green-700 text-green-400"
            : bonusTotalMinutesStatus === -1
            ? "border-red-700 text-red-400"
            : "border-slate-700 text-slate-400"
        }`}
      >
        {bonusTotalMinutesStatus === -1 && "- "}
        {TimeMinutesToString(Math.abs(bonusTotalMinutes))}
        <Clock size={18} />
      </span>
      <DayPicker
        locale={ptBr}
        mode="single"
        selected={dateSelected}
        onSelect={(date) => {
          if (!date) {
            return;
          }
          onSetDateSelected(date);
        }}
        disabled={[{ dayOfWeek: [0, 6] }, ...disabledDays]}
        modifiers={{
          available: { dayOfWeek: [1, 2, 3, 4, 5] },
        }}
        captionLayout="dropdown"
        modifiersStyles={{
          disabled: {
            fontSize: "75%",
            cursor: "not-allowed",
            opacity: 0.4,
          },
        }}
        onMonthChange={(date) => onSetMonthSelected(date)}
        toYear={new Date().getFullYear()}
        fromYear={2020}
        footer={`Data Selecionada: ${format(
          new Date(dateSelected),
          "yyyy/MM/dd"
        )}`}
        styles={{
          tfoot: {
            height: "30px",
            fontSize: "14px",
          },
        }}
      />
      <form
        onSubmit={handleSubmit(handleSubmitData)}
        className="flex flex-col gap-6 w-full px-2"
      >
        <div className="flex justify-center gap-10">
          <div>
            <label htmlFor="entryOne">Entrada 1:</label>
            <InputMask
              disabled={!user?.infoUser}
              id="entryOne"
              register={register("entryOne")}
            />
          </div>
          <div>
            <label htmlFor="exitOne">Saída 1:</label>
            <InputMask
              disabled={!user?.infoUser}
              id="exitOne"
              register={register("exitOne")}
            />
          </div>
        </div>

        <div className="flex justify-center gap-10">
          <div>
            <label htmlFor="entryTwo">Entrada 2:</label>
            <InputMask
              disabled={!user?.infoUser}
              id="entryTwo"
              register={register("entryTwo")}
            />
          </div>
          <div>
            <label htmlFor="exitTwo">Saída 2:</label>
            <InputMask
              disabled={!user?.infoUser}
              id="exitTwo"
              register={register("exitTwo")}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={!user?.infoUser}
            className="mt-8 bg-green-600 rounded w-[260px] p-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
