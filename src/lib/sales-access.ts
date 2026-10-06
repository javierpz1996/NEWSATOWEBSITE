import { cookies } from "next/headers";

const SALES_ACCESS_COOKIE = "sales_access";

export function getSalesAccessTokenEnv(): string | undefined {
  return process.env.SALES_ACCESS_TOKEN?.trim() || undefined;
}

export async function isSalesAccessGranted(): Promise<boolean> {
  const expected = getSalesAccessTokenEnv();
  if (!expected) return true;

  const cookieStore = await cookies();
  return cookieStore.get(SALES_ACCESS_COOKIE)?.value === expected;
}

export { SALES_ACCESS_COOKIE };
