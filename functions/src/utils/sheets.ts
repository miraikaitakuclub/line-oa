import { google } from "googleapis";

function getAuthClient() {
  return new google.auth.GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetsClient() {
  const auth = getAuthClient();
  return google.sheets({ version: "v4", auth });
}

export async function appendRow(
  spreadsheetId: string,
  values: string[]
): Promise<void> {
  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:K",
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

export async function findRowByUserId(
  spreadsheetId: string,
  userId: string
): Promise<number | null> {
  const sheets = getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Sheet1!A:A",
  });
  const rows = res.data.values;
  if (!rows) return null;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === userId) {
      return i + 1; // 1-indexed
    }
  }
  return null;
}

export async function updateRow(
  spreadsheetId: string,
  rowIndex: number,
  values: string[]
): Promise<void> {
  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `Sheet1!A${rowIndex}:K${rowIndex}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}
