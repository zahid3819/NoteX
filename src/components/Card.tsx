import type { PropsWithChildren } from "react";
import { Card as UICard } from "@/components/ui/card";

export const Card = ({ children }: PropsWithChildren) => {
  return <UICard>{children}</UICard>;
};
