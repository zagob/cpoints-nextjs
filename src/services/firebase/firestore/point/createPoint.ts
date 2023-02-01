import { doc, db, collection, setDoc } from "../index";
import { z } from "zod";
import { BankBalanceTime } from "../../../../utils/transformBankBalanceTime";

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
    return { success: false, message: "Data invalida" };
  }

  if (entryOne > exitOne || exitOne > entryTwo) {
    return { success: false, message: "Preencha corretamente os valores" };
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

  const newDataPointRef = doc(collection(db, `users/${idUser}/pTest`));

  await setDoc(newDataPointRef, {
    ...dataPoint,
    id: newDataPointRef.id,
  });
}
