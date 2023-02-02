import { Clock } from "phosphor-react";
import { InputHTMLAttributes, KeyboardEvent } from "react";
import clsx from "clsx";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputMaskProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegisterReturn;
  disabledInput?: boolean;
  watchValue?: string;
}

export function InputMask({
  register,
  disabledInput = false,
  watchValue,
  ...rest
}: InputMaskProps) {
  function handleKeyUpChange(event: KeyboardEvent<HTMLInputElement>) {
    event.currentTarget.maxLength = 5;
    let value = event.currentTarget.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/, "$1:$2");
    event.currentTarget.value = value;
  }

  return (
    <div
      className={`text-gray-100 relative group-[disabled] w-[110px] flex items-center rounded`}
    >
      <fieldset disabled={disabledInput}>
        <input
          className={`bg-transparent w-full outline-none py-2 px-4 placeholder:opacity-30 bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed rounded`}
          placeholder="23:59"
          onKeyUp={handleKeyUpChange}
          {...register}
          {...rest}
        />
      </fieldset>
      <Clock
        className={clsx("absolute right-1", {
          ["opacity-50 text-gray-700"]: disabledInput,
          ["text-green-500"]: watchValue?.length === 5 && watchValue <= "23:59",
          ["text-red-500"]: watchValue?.length! > 5 || watchValue! > "23:59",
          ["text-gray-500"]: watchValue?.length! === 0,
        })}
        size={24}
        weight="bold"
      />
    </div>
  );
}
