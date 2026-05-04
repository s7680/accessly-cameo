import { supabase } from "@/lib/supabaseClient";
import { getUserById } from "@/lib/db/users";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

let isOnboardedCache: boolean | null = null;

export async function requireOnboarding(router: AppRouterInstance) {
  // 0. Check cache first
  if (isOnboardedCache === true) {
    return true;
  }

  // 1. Check auth
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    router.push("/sign-in");
    return false;
  }

  // 2. Check onboarding
  const { data: existingUser } = await getUserById(user.id);

  if (!existingUser) {
    router.push("/sign-in/onboarding");
    isOnboardedCache = false;
    return false;
  }

  isOnboardedCache = true;

  // 3. Allowed
  return true;
}