import { NextResponse } from "next/server";

export const runtime = "nodejs"; 

export async function POST(req) {
  const form = await req.formData();
  const file = form.get("file");
  const date = form.get("date");

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const filePath = `${date}_${file.name}`;

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;
  const N8N_WEBHOOK = process.env.N8N_WEBHOOK_URL;

  // upload file to supabase
  const uploadRes = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filePath}`,
    {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": file.type,
      },
      body: fileBuffer,
    }
  );

  if (!uploadRes.ok) {
    return NextResponse.json(
      { error: "Upload error", message: await uploadRes.text() },
      { status: 500 }
    );
  }

  // Notify n8n webhook
  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`;

  await fetch(N8N_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, file_url: publicUrl }),
  });

  return NextResponse.json({
    success: true,
    uploaded_to: publicUrl,
  });
}