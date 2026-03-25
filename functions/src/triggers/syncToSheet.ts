import { onDocumentWritten } from "firebase-functions/v2/firestore";
import { appendRow, findRowByUserId, updateRow } from "../utils/sheets";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID || "";

function memberToRow(data: FirebaseFirestore.DocumentData): string[] {
  return [
    data.lineUserId || "",
    data.displayName || "",
    data.schoolName || "",
    data.year || "",
    data.faculty || "",
    data.department || "",
    Array.isArray(data.seminars) ? data.seminars.join("、") : "",
    data.status || "",
    data.joinedAt?.toDate?.()?.toISOString?.() || "",
    data.updatedAt?.toDate?.()?.toISOString?.() || "",
  ];
}

export const onMemberWrite = onDocumentWritten(
  "members/{memberId}",
  async (event) => {
    if (!SPREADSHEET_ID) {
      console.warn("GOOGLE_SHEET_ID is not set, skipping sheet sync");
      return;
    }

    const after = event.data?.after?.data();
    if (!after) {
      // Document was deleted (shouldn't happen with our rules, but handle it)
      return;
    }

    const userId = after.lineUserId as string;
    const row = memberToRow(after);

    try {
      const existingRow = await findRowByUserId(SPREADSHEET_ID, userId);
      if (existingRow) {
        await updateRow(SPREADSHEET_ID, existingRow, row);
      } else {
        await appendRow(SPREADSHEET_ID, row);
      }
    } catch (error) {
      console.error("Sheet sync error:", error);
    }
  }
);
