import { Clock } from "phosphor-react";
import { InputHTMLAttributes, KeyboardEvent } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputMaskProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegisterReturn;
}

export function InputMask({ register, ...rest }: InputMaskProps) {
  function handleKeyUpChange(event: KeyboardEvent<HTMLInputElement>) {
    event.currentTarget.maxLength = 5;
    let value = event.currentTarget.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/, "$1:$2");
    event.currentTarget.value = value;
  }
  return (
    <div className="text-gray-100 relative group-[disabled] w-[110px] flex items-center rounded">
      <input
        className="bg-transparent w-full outline-none py-2 px-4 placeholder:opacity-50 bg-zinc-900 disabled:opacity-50 rounded"
        placeholder="23:59"
        onKeyUp={handleKeyUpChange}
        {...register}
        {...rest}
      />
      <Clock
        className="text-gray-700 absolute right-1"
        size={24}
        weight="bold"
      />
    </div>
  );
}
