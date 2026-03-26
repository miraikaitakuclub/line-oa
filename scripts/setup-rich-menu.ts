/**
 * リッチメニュー設定スクリプト
 *
 * 使い方:
 * 1. .env に以下を設定:
 *    LINE_CHANNEL_ACCESS_TOKEN=your_token
 *    LIFF_ID=your_liff_id
 * 2. scripts/ に rich-menu-image.png (2500x843px) を配置
 * 3. npx ts-node scripts/setup-rich-menu.ts
 */

import * as fs from "fs";
import * as path from "path";

const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || "";
const LIFF_ID = process.env.LIFF_ID || "";
const WEBSITE_URL = "https://miraikaitaku.com/";

const headers = {
  Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
  "Content-Type": "application/json",
};

async function createRichMenu(): Promise<string> {
  const body = {
    size: { width: 2500, height: 843 },
    selected: true,
    name: "未来開拓倶楽部メニュー",
    chatBarText: "メニュー",
    areas: [
      {
        bounds: { x: 0, y: 0, width: 1250, height: 843 },
        action: {
          type: "uri",
          label: "入退部",
          uri: `https://liff.line.me/${LIFF_ID}`,
        },
      },
      {
        bounds: { x: 1250, y: 0, width: 1250, height: 843 },
        action: {
          type: "uri",
          label: "公式ウェブサイト",
          uri: WEBSITE_URL,
        },
      },
    ],
  };

  const res = await fetch("https://api.line.me/v2/bot/richmenu", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to create rich menu: ${error}`);
  }

  const data = (await res.json()) as { richMenuId: string };
  console.log("Rich menu created:", data.richMenuId);
  return data.richMenuId;
}

async function uploadImage(richMenuId: string): Promise<void> {
  const imagePath = path.join(__dirname, "rich-menu-image.png");
  if (!fs.existsSync(imagePath)) {
    console.warn(
      "Warning: rich-menu-image.png not found. Please upload the image manually."
    );
    console.warn(
      "Image requirements: 2500x843px PNG, two sections: 入退部 | 公式ウェブサイト"
    );
    return;
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const res = await fetch(
    `https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        "Content-Type": "image/png",
      },
      body: imageBuffer,
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to upload image: ${error}`);
  }
  console.log("Image uploaded successfully");
}

async function setDefault(richMenuId: string): Promise<void> {
  const res = await fetch(
    `https://api.line.me/v2/bot/user/all/richmenu/${richMenuId}`,
    {
      method: "POST",
      headers,
    }
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to set default rich menu: ${error}`);
  }
  console.log("Rich menu set as default");
}

async function main() {
  if (!CHANNEL_ACCESS_TOKEN || !LIFF_ID) {
    console.error(
      "Error: LINE_CHANNEL_ACCESS_TOKEN and LIFF_ID must be set in environment variables"
    );
    process.exit(1);
  }

  console.log("Creating rich menu...");
  const richMenuId = await createRichMenu();

  console.log("Uploading image...");
  await uploadImage(richMenuId);

  console.log("Setting as default...");
  await setDefault(richMenuId);

  console.log("\nDone! Rich menu ID:", richMenuId);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
