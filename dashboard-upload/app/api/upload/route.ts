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


    // ------------------------------
    // INIT SUPABASE SERVICE CLIENT
    // ------------------------------
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE!
    );


    // ------------------------------
    // CHECK DUPLICATE IN DATABASE
    // ------------------------------
    const { data: existing, error: existingErr } = await supabase
      .from("dashboard_images")
      .select("id")
      .eq("dashboard_date", date)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        {
          error: "Duplicate entry",
          message: `A dashboard for ${date} already exists`,
        },
        { status: 409 }
      );
    }


    // ------------------------------
    // UPLOAD FILE (no overwrite)
    // ------------------------------
    const { data: uploaded, error: uploadErr } = await supabase.storage
      .from("dashboards")
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false, // ← DO NOT OVERWRITE
      });

    if (uploadErr) {
      console.error("Upload error:", uploadErr);
      return NextResponse.json({ error: "Supabase upload failed" }, { status: 500 });
    }


    // ------------------------------
    // INSERT INTO dashboard_images
    // ------------------------------
    const { data: newRow, error: insertErr } = await supabase
      .from("dashboard_images")
      .insert({
        filename: fileName,
        storage_path: uploaded?.path,
        dashboard_date: date,
        submitted_at: new Date(),
      })
      .select()
      .single();

    if (insertErr) {
      console.error("DB insert error:", insertErr);

      // Remove uploaded file if DB insert failed:
      await supabase.storage.from("dashboards").remove([fileName]);

      return NextResponse.json(
        { error: "Database insert failed" },
        { status: 500 }
      );
    }


    // ------------------------------
    // SEND TO N8N WEBHOOK
    // ------------------------------
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "upload_complete",
          dashboard_image_id: newRow.id,
          fileName,
          supabasePath: uploaded?.path,
          date,
        }),
      });
    }


    return NextResponse.json({
      success: true,
      dashboard_image_id: newRow.id,
      path: uploaded?.path,
      publicUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/dashboards/${uploaded?.path}`,
    });

  } catch (err) {
    console.error("Route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}