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
  return NextResponse.json({ space: getStore().toPublic(space) });
}
