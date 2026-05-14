import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { getStore } from "@/lib/store";

function baseUrl(request: Request) {
  const env = process.env.NEXT_PUBLIC_APP_URL;
  if (env) return env.replace(/\/$/, "");
  const u = new URL(request.url);
  return `${u.protocol}//${u.host}`;
}

export async function GET(
  request: Request,
  { params }: { params: { code: string } },
) {
  const upper = params.code.toUpperCase();
  if (!getStore().getByCode(upper)) {
    return NextResponse.json({ error: "找不到此空間" }, { status: 404 });
  }
  const joinUrl = `${baseUrl(request)}/s/${upper}`;
  const png = await QRCode.toBuffer(joinUrl, {
    type: "png",
    width: 360,
    margin: 2,
    color: { dark: "#5C3D2EFF", light: "#FAF6F0FF" },
  });
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=60",
    },
  });
}
