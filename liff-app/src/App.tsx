import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./lib/firebase";
import { useLiff } from "./hooks/useLiff";
import { useAuth } from "./hooks/useAuth";
import { Member } from "./types/member";
import Loading from "./components/Loading";
import RegistrationForm from "./components/RegistrationForm";
import MemberView from "./components/MemberView";

export default function App() {
  const liff = useLiff();
  const auth = useAuth(liff.accessToken);
  const [member, setMember] = useState<Member | null>(null);
  const [checkingMember, setCheckingMember] = useState(true);

  useEffect(() => {
    if (!auth.lineUserId) return;

    getDoc(doc(db, "members", auth.lineUserId))
      .then((snap) => {
        if (snap.exists()) {
          const data = snap.data() as Member;
          if (data.status === "active") {
            setMember(data);
          }
        }
      })
      .catch(console.error)
      .finally(() => setCheckingMember(false));
  }, [auth.lineUserId]);

  // Error states
  if (liff.error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="rounded-xl bg-white p-6 text-center shadow-lg">
          <p className="text-red-500">{liff.error}</p>
          <p className="mt-2 text-sm text-gray-500">
            LINEアプリから開いてください
          </p>
        </div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="rounded-xl bg-white p-6 text-center shadow-lg">
          <p className="text-red-500">認証エラー: {auth.error}</p>
        </div>
      </div>
    );
  }

  // Loading states
  if (!liff.isReady || auth.loading || checkingMember) {
    return <Loading />;
  }

  // Show registration or member view
  if (member) {
    return <MemberView member={member} lineUserId={auth.lineUserId!} />;
  }

  return (
    <RegistrationForm
      lineUserId={auth.lineUserId!}
      displayName={auth.displayName || ""}
    />
  );
}
