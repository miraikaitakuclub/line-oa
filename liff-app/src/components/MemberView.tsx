import { useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import liff from "@line/liff";
import { db } from "../lib/firebase";
import { Member } from "../types/member";
import SeminarSelector from "./SeminarSelector";

interface Props {
  member: Member;
  lineUserId: string;
}

export default function MemberView({ member, lineUserId }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(member.name);
  const [schoolName, setSchoolName] = useState(member.schoolName);
  const [year, setYear] = useState(member.year);
  const [faculty, setFaculty] = useState(member.faculty);
  const [department, setDepartment] = useState(member.department);
  const [seminars, setSeminars] = useState<string[]>(member.seminars);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateDoc(doc(db, "members", lineUserId), {
        name,
        schoolName,
        year,
        faculty,
        department,
        seminars,
        updatedAt: serverTimestamp(),
      });
      setMessage("更新しました！");
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("更新に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm("本当に退部しますか？")) return;
    setSubmitting(true);
    try {
      await updateDoc(doc(db, "members", lineUserId), {
        status: "left",
        updatedAt: serverTimestamp(),
      });
      setMessage("退部処理が完了しました。");
    } catch (err) {
      console.error(err);
      alert("退部処理に失敗しました。");
    } finally {
      setSubmitting(false);
    }
  };

  if (message) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-lg">
          <p className="mb-6 text-lg">{message}</p>
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

  if (!editing) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="mx-auto max-w-md">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
            部員情報
          </h1>
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <div className="space-y-3">
              <InfoRow label="氏名" value={member.name} />
              <InfoRow label="学校名" value={member.schoolName} />
              <InfoRow label="学年" value={member.year} />
              <InfoRow label="学部" value={member.faculty} />
              <InfoRow label="学科" value={member.department} />
              <div>
                <span className="text-sm text-gray-500">
                  興味あるゼミ・PJ
                </span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {member.seminars.length > 0 ? (
                    member.seminars.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800"
                      >
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">未選択</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() => setEditing(true)}
                className="w-full rounded-lg bg-green-500 py-3 text-white hover:bg-green-600"
              >
                編集する
              </button>
              <button
                onClick={handleLeave}
                disabled={submitting}
                className="w-full rounded-lg border border-red-500 py-3 text-red-500 hover:bg-red-50 disabled:opacity-50"
              >
                退部する
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          情報を編集
        </h1>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              氏名
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              className="mt-1 w-full rounded-lg border border-gray-300 p-3 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          <SeminarSelector value={seminars} onChange={setSeminars} />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex-1 rounded-lg border border-gray-300 py-3 text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-green-500 py-3 text-white hover:bg-green-600 disabled:bg-gray-400"
            >
              {submitting ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-sm text-gray-500">{label}</span>
      <p className="font-medium">{value}</p>
    </div>
  );
}
