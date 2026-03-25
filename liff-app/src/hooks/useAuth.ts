import { useState, useEffect } from "react";
import { signInWithCustomToken, User } from "firebase/auth";
import { auth } from "../lib/firebase";
import { exchangeToken } from "../lib/api";

interface AuthState {
  user: User | null;
  displayName: string | null;
  lineUserId: string | null;
  loading: boolean;
  error: string | null;
}

export function useAuth(lineAccessToken: string | null) {
  const [state, setState] = useState<AuthState>({
    user: null,
    displayName: null,
    lineUserId: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!lineAccessToken) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }

    exchangeToken(lineAccessToken)
      .then(async ({ firebaseToken, displayName, userId }) => {
        const credential = await signInWithCustomToken(auth, firebaseToken);
        setState({
          user: credential.user,
          displayName,
          lineUserId: userId,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        setState({
          user: null,
          displayName: null,
          lineUserId: null,
          loading: false,
          error: err.message,
        });
      });
  }, [lineAccessToken]);

  return state;
}
