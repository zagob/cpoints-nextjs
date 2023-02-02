import { doc, db, collection, setDoc } from "../index";
import { z } from "zod";
import { BankBalanceTime } from "../../../../utils/transformBankBalanceTime";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const DataPointSchema = z.object({
  entryOne: z.number().max(480, { message: "Número maior que o permitido" }),
  exitOne: z.number().max(480, { message: "Número maior que o permitido" }),
  entryTwo: z.number().max(480, { message: "Número maior que o permitido" }),
  exitTwo: z.number().max(480, { message: "Número maior que o permitido" }),
  dateTime: z.string(),
  created_at: z.string(),
  holiday: z.boolean(),
});

type CreatePointProps = z.infer<typeof DataPointSchema>;

export async function createPoint(
  idUser: string,
  point: CreatePointProps,
  totalHours: number
) {
  const {
    entryOne,
    exitOne,
    entryTwo,
    exitTwo,
    created_at,
    dateTime,
    holiday,
  } = point;

  const validadeDate = Date.parse(created_at);

  if (isNaN(validadeDate)) {
    return toast.error("Data inválida");
  }

  if (!holiday) {
    if (entryOne >= exitOne || entryOne >= entryTwo || entryOne >= exitTwo) {
      return toast.error("Preencha corretamente os valores");
    }
    if (exitOne >= entryTwo || exitOne >= exitTwo) {
      return toast.error("Preencha corretamente os valores");
    }
    if (entryTwo >= exitTwo) {
      return toast.error("Preencha corretamente os valores");
    }

    // number in minutes
    const endHour = 1439; // 23:59

    if (
      entryTwo > endHour ||
      exitOne > endHour ||
      entryTwo > endHour ||
      exitTwo > endHour
    ) {
      return toast.error("é permitido horários de até 23:59");
    }
  }

  const bankBalance = BankBalanceTime(totalHours, {
    entryOne,
    exitOne,
    entryTwo,
    exitTwo,
  });

  const dataPoint = {
    entryOne,
    exitOne,
    entryTwo,
    exitTwo,
    dateTime,
    created_at,
    bankBalance,
    holiday,
  };

  const newDataPointRef = doc(collection(db, `users/${idUser}/points`));

  await setDoc(newDataPointRef, {
    ...dataPoint,
    id: newDataPointRef.id,
  });

  toast.success("Ponto cadastrada com sucesso!");
}
