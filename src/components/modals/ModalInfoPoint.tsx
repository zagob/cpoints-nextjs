import { ClipboardText } from "phosphor-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { InputMask } from "../InputMask";
import { ModalRadix } from "../ModalRadix";

interface ModalInfoPointProps {
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

export function ModalInfoPoint({ point }: ModalInfoPointProps) {
  const { register, handleSubmit, setValue } = useForm();
  const [modal, setModal] = useState(false);

  async function handleSubmitForm() {}

  return (
    <ModalRadix
      open={modal}
      onOpenModal={(open) => setModal(open)}
      title="Informações Geral do Ponto"
      buttonOpenModal={
        <>
          <ClipboardText
            size={20}
            className="text-gray-300 transition-all hover:text-gray-100 hover:cursor-pointer"
          />
        </>
      }
    >
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="flex flex-col gap-6 w-full px-2"
      >
        <div className="flex justify-center gap-10">
          <div>
            <label htmlFor="entryOne">Entrada 1:</label>
            <InputMask
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
              id="exitTwo"
              register={register("exitTwo")}
              onResetValue={() => {
                setValue("exitTwo", "");
              }}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="mt-8 bg-green-600 rounded w-[260px] p-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Enviar
          </button>
        </div>
      </form>
    </ModalRadix>
  );
}
