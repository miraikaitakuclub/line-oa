import * as admin from "firebase-admin";

admin.initializeApp();

export { createCustomToken } from "./auth/createCustomToken";
export { onMemberWrite } from "./triggers/syncToSheet";
