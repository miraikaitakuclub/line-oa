interface TokenResponse {
  firebaseToken: string;
  displayName: string;
  userId: string;
}

export async function exchangeToken(
  lineAccessToken: string
): Promise<TokenResponse> {
  const url = import.meta.env.VITE_CREATE_TOKEN_URL;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lineAccessToken }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Token exchange failed");
  }

  return res.json();
}
