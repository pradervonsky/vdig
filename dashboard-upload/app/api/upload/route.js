import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  try {
    // Parse incoming multipart form-data
    const form = await req.formData();
    const file = form.get("file");
    const date = form.get("date");

    if (!file || !date) {
      return NextResponse.json({ error: "Missing file or date" }, { status: 400 });
    }

    // Convert file into a buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // -------------------------------
    // Supabase client (server-side)
    // -------------------------------
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // OK on server-side ONLY
    );

    const BUCKET = "dashboards";
    const filePath = `${date}_${file.name}`;

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("SUPABASE ERROR:", uploadError);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`;

    // -------------------------------
    // Notify n8n webhook
    // -------------------------------
    await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        file_url: publicUrl
      }),
    });

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}