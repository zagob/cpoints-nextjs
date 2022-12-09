import { useState } from "react";
import { ModalRadix } from "../ModalRadix";
import { CircleNotch, Trash } from "phosphor-react";
import { useTime } from "../../hooks/useTime";

interface ModalDeletePointProps {
  idPoint: string;
}

export function ModalDeletePoint({ idPoint }: ModalDeletePointProps) {
  const { onDeletePoint } = useTime();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDeletePoint() {
    try {
      setLoading(true);
      await onDeletePoint(idPoint);
    } finally {
      setLoading(false);
      setModal(false);
    }
  }

  return (
    <ModalRadix
      open={modal}
      onOpenModal={(open) => setModal(open)}
      title="Deseja Deletar esse ponto?"
      classNameStyles="w-[460px]"
      buttonOpenModal={
        <>
          <Trash
            size={20}
            className="text-red-200 transition-all hover:text-red-300 hover:cursor-pointer"
          />
        </>
      }
    >
      <div className="w-full h-full flex items-center gap-2">
        <button
          type="button"
          onClick={handleDeletePoint}
          className="w-full bg-green-600 h-6 flex items-center justify-center uppercase disabled:opacity-40 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <CircleNotch
              size={20}
              weight="bold"
              className="text-center animate-spin"
            />
          ) : (
            "Sim"
          )}
        </button>
        <button
          type="button"
          className="border border-slate-500 w-full uppercase"
          onClick={() => setModal(false)}
        >
          Não
        </button>
      </div>
    </ModalRadix>
  );
}
