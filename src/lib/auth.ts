import { cookies } from "next/headers";

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "socialclub2026";
const COOKIE_NAME = "sc_admin_token";

export async function verifyAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return token === ADMIN_SECRET;
}

export function verifyAdminTokenSync(token?: string | null): boolean {
  if (!token) return false;
  return token === ADMIN_SECRET;
}

export async function setAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, ADMIN_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
