import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { User } from "@supabase/supabase-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getUserPlanDetails(user: User | null) {
  const plan = user?.user_metadata?.plan || "starter";
  let docLimit = 5;
  let name = "Starter";
  let isFreeTier = true;

  if (plan === "student") {
    docLimit = 15;
    name = "Student";
    isFreeTier = false;
  } else if (plan === "pro") {
    docLimit = 50;
    name = "Pro";
    isFreeTier = false;
  } else if (plan === "team") {
    docLimit = 200;
    name = "Team";
    isFreeTier = false;
  }

  return { plan, name, docLimit, isFreeTier };
}
