"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function OAuthRedirectHandler() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash;
    // If Supabase redirected OAuth hash to home page (/#access_token=... or /#error=...)
    if (hash && (hash.includes("access_token=") || hash.includes("error=") || hash.includes("type=recovery"))) {
      router.replace(`/admin${hash}`);
      return;
    }

    // Check if session exists from OAuth
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user?.email) {
        // Automatically redirect logged-in admin to /admin dashboard
        router.replace("/admin");
      }
    };

    if (hash.includes("access_token=")) {
      checkSession();
    }
  }, [router]);

  return null;
}
