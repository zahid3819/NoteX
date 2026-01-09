import type { ButtonHTMLAttributes, ComponentProps } from "react";
import { Button as UIButton } from "@/components/ui/button";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export const Button = ({ className = "", variant = "primary", ...props }: Props) => {
  type UIButtonProps = ComponentProps<typeof UIButton>;

  const mappedVariant: UIButtonProps["variant"] =
    variant === "primary" ? "default" : variant === "danger" ? "destructive" : variant;

  return <UIButton className={className} variant={mappedVariant} {...props} />;
};
