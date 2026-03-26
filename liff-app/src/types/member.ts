import { Timestamp } from "firebase/firestore";

export interface Member {
  lineUserId: string;
  displayName: string;
  name: string;
  schoolName: string;
  year: string;
  faculty: string;
  department: string;
  seminars: string[];
  joinedAt: Timestamp;
  updatedAt: Timestamp;
  status: "active" | "left";
}
