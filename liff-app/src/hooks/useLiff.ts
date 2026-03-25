import { useState, useEffect } from "react";
import liff from "@line/liff";

interface LiffState {
  isReady: boolean;
  isLoggedIn: boolean;
  accessToken: string | null;
  error: string | null;
}

export function useLiff() {
  const [state, setState] = useState<LiffState>({
    isReady: false,
    isLoggedIn: false,
    accessToken: null,
    error: null,
  });

  useEffect(() => {
    const liffId = import.meta.env.VITE_LIFF_ID;
    if (!liffId) {
      setState((s) => ({ ...s, error: "LIFF ID is not configured" }));
      return;
    }

    liff
      .init({ liffId })
      .then(() => {
        if (!liff.isLoggedIn()) {
          liff.login();
          return;
        }
        const accessToken = liff.getAccessToken();
        setState({
          isReady: true,
          isLoggedIn: true,
          accessToken,
          error: null,
        });
      })
      .catch((err) => {
        setState((s) => ({
          ...s,
          error: `LIFF initialization failed: ${err.message}`,
        }));
      });
  }, []);

  return state;
}
