"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
};

function getTokenFromCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const redirectedRef = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || getTokenFromCookie();

    if (!token) {
      if (!redirectedRef.current) {
        redirectedRef.current = true;
        // Clear any partial state
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/login");
      }
      return;
    }

    // Sync localStorage from cookie if only the cookie exists (direct navigation)
    if (!localStorage.getItem("token") && getTokenFromCookie()) {
      localStorage.setItem("token", getTokenFromCookie()!);
    }

    setChecking(false);
  }, [router]);

  if (checking) {
    return <div>Memuat...</div>;
  }

  return <>{children}</>;
}