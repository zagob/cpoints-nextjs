import { doc, updateDoc } from "firebase/firestore";
import { Pencil, UserList } from "phosphor-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../services/api";
import { db } from "../../services/firebase/firestore";
import { Button } from "../Button";
import { InputMask } from "../InputMask";
import { ModalRadix } from "../ModalRadix";

interface ModalInfoUserProps {
  entryOne: string;
  entryTwo: string;
  exitOne: string;
  exitTwo: string;
  totalHours: string;
}

export function ModalInfoUser() {
  const { user, onSetUserInfo } = useAuth();
  const [modal, setModal] = useState(false);
  const { handleSubmit, register, setValue } = useForm<ModalInfoUserProps>({
    defaultValues: {
      entryOne: user?.infoUser?.entryOne,
      exitOne: user?.infoUser?.exitOne,
      entryTwo: user?.infoUser?.entryTwo,
      exitTwo: user?.infoUser?.exitTwo,
      totalHours: user?.infoUser?.totalHours,
    },
  });

  async function handleSubmitForm(data: ModalInfoUserProps) {
    await updateDoc(doc(db, `users`, user?.id!), {
      infoUser: data,
    });
    toast.success(
      `Informações ${
        user?.infoUser ? "atualizadas" : "adicionadas"
      } com sucesso!`
    );
    setModal(false);
    await onSetUserInfo(data);
  }

  return (
    <ModalRadix
      open={modal}
      onOpenModal={(open) => setModal(open)}
      title="User Info"
      buttonOpenModal={
        <>
          {user?.infoUser ? (
            <Pencil
              size={20}
              className="text-blue-200 transition-all hover:text-blue-300"
            />
          ) : (
            <UserList
              size={20}
              className="text-green-200 transition-all hover:text-green-300"
            />
          )}
        </>
      }
    >
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="flex flex-col w-full gap-2"
      >
        <div className="flex items-center gap-2">
          <label htmlFor="entryOne" className="w-[140px] text-right">
            Entrada 1:
          </label>
          <InputMask id="entryOne" register={register("entryOne")} />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="exitOne" className="w-[140px] text-right">
            Saída 1:
          </label>
          <InputMask id="exitOne" register={register("exitOne")} />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="entryTwo" className="w-[140px] text-right">
            Entrada 2:
          </label>
          <InputMask id="entryTwo" register={register("entryTwo")} />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="exitTwo" className="w-[140px] text-right">
            Saída 2:
          </label>
          <InputMask id="exitTwo" register={register("exitTwo")} />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="totalHours" className="w-[140px] text-right">
            Total Horas:
          </label>
          <InputMask id="totalHours" register={register("totalHours")} />
        </div>

        <Button statusColor="green" type="submit">
          {user?.infoUser ? "Atualizar" : "Adicionar"}
        </Button>
      </form>
    </ModalRadix>
  );
}
