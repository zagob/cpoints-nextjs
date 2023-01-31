import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ArrowRight, Check } from "phosphor-react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import ptBr from "date-fns/locale/pt";
import { z } from "zod";
import { motion } from "framer-motion";

import { InputMask } from "../../components/InputMask";
import { Button } from "../Button";
import { useAuth } from "../../hooks/useAuth";
import { useTime } from "../../hooks/useTime";

const DataFormSchema = z.object({
  entryOne: z.string(),
  exitOne: z.string(),
  entryTwo: z.string(),
  exitTwo: z.string(),
});

export type DataFormProps = z.infer<typeof DataFormSchema>;
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
  const stylesClassBackground =
    bonusTotalMinutesStatus === 1
      ? "bg-green-400"
      : bonusTotalMinutesStatus === -1
      ? " bg-red-400"
      : " bg-slate-400";

  const stylesClassText =
    bonusTotalMinutesStatus === 1
      ? "text-green-400 border-green-400"
      : bonusTotalMinutesStatus === -1
      ? "text-red-400 border-red-400"
      : "text-slate-400 border-slate-400";
  return (
    <div
      className={`border-2 w-[80px] h-[38px] flex items-center justify-center gap-1 bg-zinc-900 rounded-md relative ${stylesClassText}`}
    >
      <motion.div
        animate={{ top: ["-6px", "-3px", "-6px"], height: [4, 2, 4] }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 5,
          times: [0, 0.2, 0.5, 0.8, 1],
        }}
        className={`absolute w-6 h-1 rounded-t-md right-2 ${stylesClassBackground}`}
      />
      <div
        className={`absolute w-2 h-[2px] left-3 top-1 rounded-l-sm rounded-r-sm ${stylesClassBackground}`}
      />
      <div
        className={`absolute w-2 h-[2px] left-6 top-1 rounded-l-sm rounded-r-sm ${stylesClassBackground}`}
      />
      <span className="text-lg">{hours}</span>
      <div className="flex flex-col items-center justify-center gap-1">
        <div className={`w-1 h-1 rounded ${stylesClassBackground}`} />
        <div className={`w-1 h-1 rounded ${stylesClassBackground}`} />
      </div>
      <span className="text-lg">{minutes}</span>
      <div
        className={`absolute w-full h-[1px] bottom-1 ${stylesClassBackground}`}
      />
      <div
        className={`absolute w-2 h-[5px] border-b rounded-b-[3px] -bottom-[5px] left-2 ${stylesClassBackground}`}
      />
      <div
        className={`absolute w-2 h-[5px] border-b rounded-b-[3px] -bottom-[5px] right-2 ${stylesClassBackground}`}
      />
    </div>
  );
}

export function AsideAddPoint() {
  const { user } = useAuth();
  const [holiday, setHoliday] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    dateSelected,
    onSetDateSelected,
    onSetMonthSelected,
    points,
    bonusTotalMinutes,
    onAddPointTime,
    pointSelected,
    onSetPointSelected,
  } = useTime();
  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { dirtyFields },
  } = useForm<DataFormProps>({
    defaultValues: {
      entryOne: "",
      entryTwo: "",
      exitOne: "",
      exitTwo: "",
    },
  });

  async function handleSubmitData(data: DataFormProps) {
    setLoading(true);
    let dataTimeFormat = {
      ...data,
    };

    if (holiday) {
      dataTimeFormat = {
        entryOne: "00:00",
        exitOne: "00:00",
        entryTwo: "00:00",
        exitTwo: "00:00",
      };
    }

    await onAddPointTime(dataTimeFormat, holiday);
    setLoading(false);
    reset();
  }

  const disabledDays = points.map((point) => new Date(point.created_at));

  const bonusTotalMinutesStatus = Math.sign(bonusTotalMinutes);

  const hours = Math.floor(bonusTotalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (bonusTotalMinutes % 60).toString().padStart(2, "0");

  const { entryOne, entryTwo, exitOne, exitTwo } = dirtyFields;
  const isValueHasString = entryOne && entryTwo && exitOne && exitTwo;

  const isHoliday = holiday;

  useEffect(() => {
    if (pointSelected) {
      setValue(
        "entryOne",
        pointSelected.entryOne === "00:00" ? "" : pointSelected.entryOne
      );
      setValue(
        "entryTwo",
        pointSelected.entryTwo === "00:00" ? "" : pointSelected.entryTwo
      );
      setValue(
        "exitOne",
        pointSelected.exitOne === "00:00" ? "" : pointSelected.exitOne
      );
      setValue(
        "exitTwo",
        pointSelected.exitTwo === "00:00" ? "" : pointSelected.exitTwo
      );
      setHoliday(pointSelected.holiday);
    }

    return () => {};
  }, [pointSelected]);

  return (
    <div className="flex flex-col h-full justify-center items-center">
      {!pointSelected && (
        <ClockTimeStatus
          bonusTotalMinutesStatus={bonusTotalMinutesStatus}
          hours={hours}
          minutes={minutes}
        />
      )}
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
        onMonthChange={(date) => {
          onSetPointSelected(null);
          onSetMonthSelected(date);
        }}
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
        className="flex flex-col gap-2 w-[290px]"
      >
        <div className="flex justify-between items-center">
          <div>
            <label htmlFor="entryOne">Entrada 1:</label>
            <InputMask
              disabled={!user?.infoUser}
              id="entryOne"
              register={register("entryOne")}
              disabledInput={isHoliday}
            />
          </div>
          <ArrowRight size={20} className="mt-[20px] text-zinc-400" />
          <div>
            <label htmlFor="exitOne">Saída 1:</label>
            <InputMask
              disabled={!user?.infoUser}
              id="exitOne"
              register={register("exitOne")}
              disabledInput={isHoliday}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <label htmlFor="entryTwo">Entrada 2:</label>
            <InputMask
              disabled={!user?.infoUser}
              id="entryTwo"
              register={register("entryTwo")}
              disabledInput={isHoliday}
            />
          </div>
          <ArrowRight size={20} className="mt-[20px] text-zinc-400" />
          <div>
            <label htmlFor="exitTwo">Saída 2:</label>
            <InputMask
              disabled={!user?.infoUser}
              id="exitTwo"
              register={register("exitTwo")}
              disabledInput={isHoliday}
            />
          </div>
        </div>
        <div className="flex items-center justify-between my-1">
          <div className="flex items-center gap-2">
            <Checkbox.Root
              id="holiday"
              className="bg-zinc-900 rounded-md w-3 h-3 p-3 flex justify-center items-center border border-zinc-700"
              checked={holiday}
              onCheckedChange={(e: boolean) => {
                setHoliday(e);
              }}
            >
              <Checkbox.Indicator>
                <Check size={18} className="text-green-500" weight="bold" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <label
              htmlFor="holiday"
              className="cursor-pointer text-zinc-200 font-bold text-md "
            >
              Feriado?
            </label>
          </div>

          {isValueHasString && isHoliday && (
            <div>
              <button
                className="text-red-600 hover:brightness-125 transition-all"
                type="button"
                onClick={() => reset()}
              >
                Limpar campos
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center w-full">
          <Button
            type="submit"
            disabled={loading}
            classNameStyle="w-full"
            statusColor="green"
          >
            {loading
              ? "Enviando..."
              : pointSelected
              ? "Editar ponto"
              : "Cadastrar novo ponto"}
          </Button>
        </div>
      </form>
    </div>
  );
}
