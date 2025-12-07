import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const date = formData.get("date") as string | null;

    if (!file || !date) {
      return NextResponse.json(
        { error: "Missing file or date" },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${date}_${file.name}`;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE!
    );

    const { data, error } = await supabase.storage
      .from("dashboards")
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true,
      });

    if (error) {
      console.error("Supabase upload error:", error.message);
      return NextResponse.json(
        { error: "Supabase upload failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      path: data?.path,
    });
  } catch (err) {
    console.error("Route error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
