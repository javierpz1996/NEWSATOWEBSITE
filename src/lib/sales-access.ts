import { cookies } from "next/headers";

const SALES_ACCESS_COOKIE = "sales_access";

/** Fallback when `SALES_ACCESS_TOKEN` is unset (local / Vercel without env). */
const SALES_ACCESS_DEFAULT_TOKEN = "2020";

export function getSalesAccessTokenEnv(): string {
  return process.env.SALES_ACCESS_TOKEN?.trim() || SALES_ACCESS_DEFAULT_TOKEN;
}

export function isSalesAccessTokenConfiguredInEnv(): boolean {
  return Boolean(process.env.SALES_ACCESS_TOKEN?.trim());
}

export async function isSalesAccessGranted(): Promise<boolean> {
  const expected = getSalesAccessTokenEnv();
  const cookieStore = await cookies();
  return cookieStore.get(SALES_ACCESS_COOKIE)?.value === expected;
}

export { SALES_ACCESS_COOKIE };
