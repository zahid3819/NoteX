import type { InputHTMLAttributes } from "react";
import { Input as UIInput } from "@/components/ui/input";

type Props = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className = "", ...props }: Props) => {
  return <UIInput className={className} {...props} />;
};
