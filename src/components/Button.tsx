import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  statusColor: "red" | "green" | "gray";
  isLoading?: boolean;
  titleLoading?: string;
}

export function Button({
  children,
  statusColor,
  isLoading,
  titleLoading,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`flex items-center justify-center py-2 ${
        statusColor === "red" && "bg-red-500"
      } ${statusColor === "green" && "bg-green-500"} ${
        statusColor === "gray" && "bg-gray-500"
      } transition-all hover:brightness-75 rounded disabled:brightness-50 disabled:cursor-not-allowed`}
      {...rest}
    >
     {isLoading ? <>
        <div className="flex items-center gap-2">
        <div className="w-[18px] h-[18px] bg-transparent border-4 border-t-0 border-l-0 rounded-full animate-spin" />
        <span>{titleLoading}...</span>
        </div>
     </> : children}
    </button>
  );
}
