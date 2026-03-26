import { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import liff from "@line/liff";
import { db } from "../lib/firebase";
import SeminarSelector from "./SeminarSelector";

interface Props {
  lineUserId: string;
  displayName: string;
}

export default function RegistrationForm({ lineUserId, displayName }: Props) {
  const [name, setName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [year, setYear] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [seminars, setSeminars] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !schoolName || !year || !faculty || !department) return;

    setSubmitting(true);
    try {
      await setDoc(doc(db, "members", lineUserId), {
        lineUserId,
        displayName,
        name,
        schoolName,
        year,
        faculty,
        department,
        seminars,
        status: "active",
        joinedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setDone(true);
    } catch (err) {
      console.error(err);
      alert("登録に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-lg">
          <div className="mb-4 text-4xl">&#10003;</div>
          <h2 className="mb-2 text-xl font-bold">入部完了!</h2>
          <p className="mb-6 text-gray-600">
            未来開拓倶楽部へようこそ！
          </p>
          <button
            onClick={() => {
              if (liff.isInClient()) liff.closeWindow();
            }}
            className="w-full rounded-lg bg-green-500 py-3 text-white hover:bg-green-600"
          >
            閉じる
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          入部申請
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              氏名
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 山田太郎"
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              学校名
            </label>
            <input
              type="text"
              required
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="例: 北海道大学"
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              学年
            </label>
            <select
              required
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            >
              <option value="">選択してください</option>
              <option value="1年">1年</option>
              <option value="2年">2年</option>
              <option value="3年">3年</option>
              <option value="4年">4年</option>
              <option value="修士1年">修士1年</option>
              <option value="修士2年">修士2年</option>
              <option value="博士">博士</option>
              <option value="その他">その他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              学部
            </label>
            <input
              type="text"
              required
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              placeholder="例: 経済学部"
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              学科
            </label>
            <input
              type="text"
              required
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="例: 経済学科"
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <SeminarSelector value={seminars} onChange={setSeminars} />

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-green-500 py-3 text-white hover:bg-green-600 disabled:bg-gray-400"
          >
            {submitting ? "送信中..." : "入部する"}
          </button>
        </form>
      </div>
    </div>
  );
}
