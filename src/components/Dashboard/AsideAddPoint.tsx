import { InputMask } from "../../components/InputMask";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";

import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import ptBr from "date-fns/locale/pt";
import { useTime } from "../../hooks/useTime";
import { TimeMinutesToString } from "../../utils/timeMinutesToString";
import { Clock } from "phosphor-react";
import { Button } from "../Button";

export interface DataFormProps {
  entryOne: string;
  exitOne: string;
  entryTwo: string;
  exitTwo: string;
  holiday: boolean;
}

interface ClockTimeStatusProps {
  bonusTotalMinutesStatus: number;
  hours: string;
  minutes: string;
}

function ClockTimeStatus({
  bonusTotalMinutesStatus,
  hours,
  minutes,
}: ClockTimeStatusProps) {
  return (
    <div
      className={`border-2 border-green-400 ${
        bonusTotalMinutesStatus === 1
          ? "border-green-700 text-green-400"
          : bonusTotalMinutesStatus === -1
          ? "border-red-700 text-red-400"
          : "border-slate-700 text-slate-400"
      } relative w-16 h-8 flex z-10 justify-center gap-1 items-center bg-zinc-900`}
    >
      <div
        className={`absolute w-2 h-1 -top-1 left-2 ${
          bonusTotalMinutesStatus === 1
            ? "bg-green-400"
            : bonusTotalMinutesStatus === -1
            ? " bg-red-400"
            : " bg-slate-400"
        }`}
      />
      <span className="text-center">{hours}</span>
      <div className="flex flex-col gap-1">
        <div
          className={`w-1 h-1 rounded-full animate-pulse ${
            bonusTotalMinutesStatus === 1
              ? "bg-green-400"
              : bonusTotalMinutesStatus === -1
              ? " bg-red-400"
              : " bg-slate-400"
          }`}
        />
        <div
          className={`w-1 h-1 rounded-full animate-pulse ${
            bonusTotalMinutesStatus === 1
              ? "bg-green-400"
              : bonusTotalMinutesStatus === -1
              ? " bg-red-400"
              : " bg-slate-400"
          }`}
        />
      </div>
      <span className="text-center">{minutes}</span>
      <div
        className={`absolute w-[10px] h-[1px] -rotate-45 left-0 -bottom-[6px] z-0 ${
          bonusTotalMinutesStatus === 1
            ? "bg-green-400"
            : bonusTotalMinutesStatus === -1
            ? " bg-red-400"
            : " bg-slate-400"
        }`}
      />
      <div
        className={`absolute w-[10px] h-[1px] rotate-45 right-0 -bottom-[6px] z-0 ${
          bonusTotalMinutesStatus === 1
            ? "bg-green-400"
            : bonusTotalMinutesStatus === -1
            ? " bg-red-400"
            : " bg-slate-400"
        }`}
      />
    </div>
  );
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
  const { handleSubmit, register, setValue, reset, watch } =
    useForm<DataFormProps>({
      defaultValues: {
        entryOne: "",
        entryTwo: "",
        exitOne: "",
        exitTwo: "",
        holiday: false,
      },
    });

  async function handleSubmitData(data: DataFormProps) {
    const { holiday } = data;
    if (holiday) {
      const dataTimeFormat = {
        entryOne: "00:00",
        exitOne: "00:00",
        entryTwo: "00:00",
        exitTwo: "00:00",
        holiday,
      };
      await onAddPointTime(dataTimeFormat);
      reset();
      return;
    }

    await onAddPointTime(data);
    reset();
  }

  const disabledDays = points.map((point) => new Date(point.created_at));

  const bonusTotalMinutesStatus = Math.sign(bonusTotalMinutes);

  const hours = Math.floor(bonusTotalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (bonusTotalMinutes % 60).toString().padStart(2, "0");

  const isValueHasString =
    watch("entryOne").length === 5 &&
    watch("entryTwo").length === 5 &&
    watch("exitOne").length === 5 &&
    watch("exitTwo").length === 5;

  return (
    <div className="bg-zinc-800 w-[380px] flex flex-col items-center pt-4">
      <ClockTimeStatus
        bonusTotalMinutesStatus={bonusTotalMinutesStatus}
        hours={hours}
        minutes={minutes}
      />
      {/* <span
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
      </span> */}
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
          "dd/MM/yyyy"
        )}`}
        styles={{
          tfoot: {
            height: "30px",
            fontSize: "0.85rem",
          },
        }}
      />
      <form
        onSubmit={handleSubmit(handleSubmitData)}
        className="flex flex-col gap-6 px-2 w-[290px]"
      >
        <div className="flex justify-center gap-10">
          <div>
            <label htmlFor="entryOne">Entrada 1:</label>
            <InputMask
              disabled={!user?.infoUser}
              id="entryOne"
              register={register("entryOne")}
              onResetValue={() => {
                setValue("entryOne", "");
              }}
            />
          </div>
          <div>
            <label htmlFor="exitOne">Saída 1:</label>
            <InputMask
              disabled={!user?.infoUser}
              id="exitOne"
              register={register("exitOne")}
              onResetValue={() => {
                setValue("exitOne", "");
              }}
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
              onResetValue={() => {
                setValue("entryTwo", "");
              }}
            />
          </div>
          <div>
            <label htmlFor="exitTwo">Saída 2:</label>
            <InputMask
              disabled={!user?.infoUser}
              id="exitTwo"
              register={register("exitTwo")}
              onResetValue={() => {
                setValue("exitTwo", "");
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input id="holiday" type="checkbox" {...register("holiday")} />
          <label htmlFor="holiday">Feriado?</label>
        </div>

        <div className="flex justify-center w-full">
          <Button
            type="submit"
            disabled={
              !user?.infoUser || (!isValueHasString && !watch("holiday"))
            }
            classNameStyle="w-full"
            statusColor="green"
          >
            Enviar
          </Button>
        </div>
      </form>
    </div>
  );
}
