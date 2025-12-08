import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { date } = await req.json();

    if (!date) {
      return NextResponse.json({ exists: false });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE!
    );

    // ⚡ FAST: check database instead of storage
    const { data, error } = await supabase
      .from("dashboard_images")
      .select("id")
      .eq("dashboard_date", date)
      .maybeSingle(); // returns null if not found

    if (error) {
      console.error("DB check error:", error);
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({ exists: !!data }); // true if row found
  } catch (err) {
    console.error("Route error:", err);
    return NextResponse.json({ exists: false });
  }
}