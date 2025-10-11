"use client";

import { supabaseBrowser } from "@/lib/supabaseBrowser";

export type UserSettings = {
  user_id: string;
  full_name: string | null;
};

const DEV_USER_ID = "00000000-0000-0000-0000-000000000000"; // en prod: auth.user.id

export async function getUserName(): Promise<string | null> {
  const supabase = supabaseBrowser();
  const { data, error } = await supabase
    .from("user_settings")
    .select("full_name")
    .eq("user_id", DEV_USER_ID)
    .maybeSingle();

  if (error) {
    console.error("getUserName error:", error);
    return null;
  }
  return (data?.full_name as string | null) ?? null;
}

export async function saveUserName(fullName: string): Promise<void> {
  const supabase = supabaseBrowser();
  const row = {
    user_id: DEV_USER_ID,
    full_name: fullName,
  };
  const { error } = await supabase.from("user_settings").upsert(row);
  if (error) throw error;
}
