import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: { code: string } },
) {
  const code = params.code.toUpperCase();
  const space = getStore().getByCode(code);
  if (!space) {
    return NextResponse.json({ error: "找不到此空間" }, { status: 404 });
  }
  const photos = getStore().listPhotos(code);
  return NextResponse.json({ photos });
}

export async function POST(
  request: Request,
  { params }: { params: { code: string } },
) {
  const code = params.code.toUpperCase();
  const space = getStore().getByCode(code);
  if (!space) {
    return NextResponse.json({ error: "找不到此空間" }, { status: 404 });
  }
  const guestToken = request.headers.get("x-grainly-guest")?.trim();
  if (!guestToken || guestToken.length < 8) {
    return NextResponse.json({ error: "需要訪客識別" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const imageDataUrl = String(body.imageDataUrl ?? "");
    if (!imageDataUrl.startsWith("data:image/")) {
      return NextResponse.json({ error: "圖片格式不正確" }, { status: 400 });
    }
    const photo = getStore().addPhoto(code, guestToken, imageDataUrl);
    if (!photo) {
      return NextResponse.json({ error: "上傳失敗" }, { status: 500 });
    }
    return NextResponse.json({ photo });
  } catch (e) {
    const message = e instanceof Error ? e.message : "上傳失敗";
    const status = message.includes("頻繁") ? 429 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
