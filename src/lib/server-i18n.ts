import { cookies } from "next/headers";
import { getT, type AppLang } from "@/lib/i18n";

export async function getServerLang(): Promise<AppLang> {
  const value = (await cookies()).get("ka-lang")?.value;
  return value === "id" ? "id" : "en";
}

export async function getServerT() {
  return getT(await getServerLang());
}
