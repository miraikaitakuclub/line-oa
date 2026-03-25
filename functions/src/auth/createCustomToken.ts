import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import cors from "cors";
import { verifyAccessToken, getProfile } from "../utils/line";

const corsHandler = cors({ origin: true });

export const createCustomToken = onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
      }

      const { lineAccessToken } = req.body;
      if (!lineAccessToken) {
        res.status(400).json({ error: "lineAccessToken is required" });
        return;
      }

      const channelId = process.env.LINE_CHANNEL_ID;
      if (!channelId) {
        res.status(500).json({ error: "Server misconfigured" });
        return;
      }

      // Verify LINE access token
      await verifyAccessToken(lineAccessToken, channelId);

      // Get LINE user profile
      const profile = await getProfile(lineAccessToken);

      // Mint Firebase custom token
      const firebaseToken = await admin
        .auth()
        .createCustomToken(profile.userId);

      res.status(200).json({
        firebaseToken,
        displayName: profile.displayName,
        userId: profile.userId,
      });
    } catch (error) {
      console.error("createCustomToken error:", error);
      const message =
        error instanceof Error ? error.message : "Internal error";
      res.status(401).json({ error: message });
    }
  });
});
