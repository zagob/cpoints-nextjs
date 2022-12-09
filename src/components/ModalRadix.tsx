import * as Dialog from "@radix-ui/react-dialog";
import { X } from "phosphor-react";
import { ReactNode } from "react";

interface ModalRadixProps {
  open: boolean;
  onOpenModal: (open: boolean) => void;
  classNameStyles?: string;
  buttonOpenModal?: ReactNode;
  title: string;
  children: ReactNode;
}

export function ModalRadix({
  open,
  onOpenModal,
  title,
  buttonOpenModal,
  classNameStyles,
  children,
}: ModalRadixProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenModal}>
      <Dialog.Trigger asChild>
        <button type="button">{buttonOpenModal}</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black opacity-50 inset-0 fixed z-20 " />
        <Dialog.Content
          className={`fixed z-30 rounded gap-4 p-4 bg-zinc-700 shadow-md shadow-zinc-700 top-[50%] left-[50%] w-[400px] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center animateModal ${classNameStyles}`}
        >
          <Dialog.Title className="text-2xl mt-2">{title}</Dialog.Title>
          <div className="w-full flex-1 flex flex-col items-center">
            {children}
          </div>
          <Dialog.Close className="absolute right-2 top-2">
            <X
              size={20}
              className="text-red-200 hover:text-red-400 transition-all"
            />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
