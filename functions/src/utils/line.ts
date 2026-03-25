interface VerifyResult {
  scope: string;
  client_id: string;
  expires_in: number;
}

interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

export async function verifyAccessToken(
  accessToken: string,
  expectedChannelId: string
): Promise<void> {
  const res = await fetch(
    `https://api.line.me/oauth2/v2.1/verify?access_token=${encodeURIComponent(accessToken)}`
  );
  if (!res.ok) {
    throw new Error("Invalid LINE access token");
  }
  const data: VerifyResult = await res.json();
  if (data.client_id !== expectedChannelId) {
    throw new Error("Channel ID mismatch");
  }
  if (data.expires_in <= 0) {
    throw new Error("LINE access token expired");
  }
}

export async function getProfile(accessToken: string): Promise<LineProfile> {
  const res = await fetch("https://api.line.me/v2/profile", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error("Failed to get LINE profile");
  }
  return res.json();
}
