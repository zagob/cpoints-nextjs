import { useState } from "react";
import { ModalRadix } from "../ModalRadix";
import { CircleNotch, Trash } from "phosphor-react";
import { useTime } from "../../hooks/useTime";

interface ModalDeletePointsSelectedProps {
  idPoints: string[];
}

export function ModalDeletePointsSelected({
  idPoints,
}: ModalDeletePointsSelectedProps) {
  const { onDeletePoint } = useTime();
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDeletePoints() {
    try {
      setLoading(true);
      idPoints.map(async (point) => {
        await onDeletePoint(point);
      });
    } finally {
      setLoading(false);
      setModal(false);
    }
  }

  return (
    <ModalRadix
      open={modal}
      onOpenModal={(open) => setModal(open)}
      title={`Deseja Deletes todos os ${idPoints.length} pontos selecionados?`}
      classNameStyles="w-[460px]"
      buttonOpenModal={
        <>
          <button
            type="button"
            className="py-1 px-2 border text-center bg-zinc-900 rounded-md border-zinc-600 text-sm hover:brightness-125 transition-all"
          >
            Excluir Selecionados
          </button>
        </>
      }
    >
      <div className="w-full h-full flex items-center gap-2">
        <button
          type="button"
          onClick={handleDeletePoints}
          className="w-full rounded bg-green-600 h-6 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
          disabled={loading}
        >
          {loading ? (
            <CircleNotch
              size={20}
              weight="bold"
              className="text-center animate-spin"
            />
          ) : (
            "Deletar"
          )}
        </button>
        <button
          type="button"
          className="border border-zinc-500 bg-zinc-900 w-full rounded hover:brightness-110 transition-all"
          onClick={() => setModal(false)}
        >
          Cancelar
        </button>
      </div>
    </ModalRadix>
  );
}
