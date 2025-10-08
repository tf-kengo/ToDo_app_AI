import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "user-session";

export async function getSession() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value);
  } catch {
    return null;
  }
}

export async function createSession(userId: string, userName: string) {
  const sessionData = {
    userId,
    userName,
    createdAt: new Date().toISOString(),
  };

  cookies().set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function deleteSession() {
  cookies().delete(SESSION_COOKIE_NAME);
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
