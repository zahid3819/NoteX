import { getAuthedUser } from "@/lib/auth";

export const getServerUser = async () => {
  return getAuthedUser();
};
