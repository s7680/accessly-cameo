"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        router.replace("/sign-in");
        return;
      }

      if (data.session) {
        // decide onboarding vs home
        router.replace("/sign-in/onboarding");
      } else {
        router.replace("/sign-in");
      }
    };

    handleAuth();
  }, []);

  return <p>Signing you in...</p>;
}