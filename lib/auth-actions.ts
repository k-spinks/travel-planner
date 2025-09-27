"use server";

import { signIn, signOut } from "@/auth";

// export const login = async (provider: string) => {
//   await signIn(`${provider}`, { redirectTo: "/trips" });
// };

export const login = async () => {
  await signIn(`google`, { redirectTo: "/trips" });
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
