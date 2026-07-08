import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { error: "Chưa cấu hình NEXT_PUBLIC_API_URL trong .env.local" },
      { status: 500 }
    );
  }

  try {
    const incomingForm = await request.formData();
    const file = incomingForm.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "Không nhận được file ảnh" },
        { status: 400 }
      );
    }

    const forwardForm = new FormData();
    const fileName = file instanceof File ? file.name : "upload.jpg";
    forwardForm.append("file", file, fileName);

    const upstream = await fetch(`${apiUrl}/predict`, {
      method: "POST",
      body: forwardForm,
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      return NextResponse.json(
        { error: data?.detail ?? "Microservice trả về lỗi" },
        { status: upstream.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("predict proxy error:", err);
    return NextResponse.json(
      {
        error:
          "Không gọi được microservice. Kiểm tra lại NEXT_PUBLIC_API_URL trong .env.local hoặc xem microservice trên HuggingFace Spaces có đang Running không.",
      },
      { status: 502 }
    );
  }
}