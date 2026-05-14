import { NextResponse } from "next/server";
import { getStore } from "@/lib/store";

export async function DELETE(
  request: Request,
  { params }: { params: { code: string; photoId: string } },
) {
  const code = params.code.toUpperCase();
  const { photoId } = params;
  const hostSecret = request.headers.get("x-grainly-host-secret")?.trim();
  if (!hostSecret) {
    return NextResponse.json({ error: "需要主辦者授權" }, { status: 401 });
  }
  const ok = getStore().deletePhoto(code, photoId, hostSecret);
  if (!ok) {
    return NextResponse.json({ error: "無法刪除" }, { status: 403 });
  }
  return NextResponse.json({ ok: true });
}
