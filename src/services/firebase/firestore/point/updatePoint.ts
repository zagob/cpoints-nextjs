import dayjs from "dayjs";
import { z } from "zod";
import { BankBalanceTime } from "../../../../utils/transformBankBalanceTime";
import { doc, updateDoc, db } from "../index";
import { existUserIdById } from "../user/existUserById";

const DataPointSchema = z.object({
  entryOne: z.number().max(480, { message: "Número maior que o permitido" }),
  exitOne: z.number().max(480, { message: "Número maior que o permitido" }),
  entryTwo: z.number().max(480, { message: "Número maior que o permitido" }),
  exitTwo: z.number().max(480, { message: "Número maior que o permitido" }),
  dateTime: z.string(),
  created_at: z.string(),
  holiday: z.boolean(),
});

type UpdatePointProps = z.infer<typeof DataPointSchema>;

export async function updatePoint(
  idUser: string,
  idPoint: string,
  dataPoint: UpdatePointProps,
  totalHours: number
) {
  const {
    entryOne,
    entryTwo,
    exitOne,
    exitTwo,
    created_at,
    dateTime,
    holiday,
  } = dataPoint;

  const user = await existUserIdById(idUser);

  if (!user.success) {
    return user.message;
  }

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

  const dataPointForm = {
    entryOne,
    exitOne,
    entryTwo,
    exitTwo,
    dateTime: dayjs(dateTime).format("YYYY/MM"),
    created_at: dayjs(created_at).toISOString(),
    bankBalance,
    holiday,
  };

  await updateDoc(doc(db, `users/${idUser}/points`, idPoint), dataPointForm);

  return {
    success: true,
    message: "Ponto alterado com sucesso!",
    dataPointForm,
  };
}
