const COOKIE_NAME = "rozhn_admin_session";

async function hmac(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_PASSWORD ?? "";
  return hmac("rozhn-admin", secret);
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const expected = await createSessionToken();
  return token === expected;
}

export { COOKIE_NAME };
