import type { TextareaHTMLAttributes } from "react";
import { Textarea as UITextarea } from "@/components/ui/textarea";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = ({ className = "", ...props }: Props) => {
  return <UITextarea className={className} {...props} />;
};
