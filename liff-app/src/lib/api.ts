interface TokenResponse {
  firebaseToken: string;
  displayName: string;
  userId: string;
}

export async function exchangeToken(
  lineAccessToken: string
): Promise<TokenResponse> {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const url = `https://createcustomtoken-${projectId}.cloudfunctions.net/createCustomToken`;

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
