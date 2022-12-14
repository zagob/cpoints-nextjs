import { Clock } from "phosphor-react";
import { InputHTMLAttributes, KeyboardEvent, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputMaskProps extends InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegisterReturn;
  onResetValue: () => void;
}

export function InputMask({ register, onResetValue, ...rest }: InputMaskProps) {
  const [value, setValue] = useState("");

  function handleKeyUpChange(event: KeyboardEvent<HTMLInputElement>) {
    event.currentTarget.maxLength = 5;
    let value = event.currentTarget.value;
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/, "$1:$2");
    event.currentTarget.value = value;
    setValue(value);
  }

  function handleResetValue() {
    setValue("");
    onResetValue();
  }

  console.log("value", value);
  return (
    <div className="text-gray-100 relative group-[disabled] w-[110px] flex items-center rounded">
      <input
        className={`bg-transparent w-full outline-none py-2 px-4 placeholder:opacity-50 bg-zinc-900 disabled:opacity-50 rounded`}
        placeholder="23:59"
        onKeyUp={handleKeyUpChange}
        {...register}
        {...rest}
      />
      <Clock
        className={`absolute right-1 ${
          value.length === 5
            ? "text-green-500"
            : value.length > 5
            ? "text-red-500"
            : "text-gray-700"
        }`}
        size={24}
        weight="bold"
        onClick={value.length >= 5 ? handleResetValue : () => {}}
      />
    </div>
  );
}
