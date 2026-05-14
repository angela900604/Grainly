import { NextResponse } from "next/server";
import type { AspectRatio, Occasion } from "@/lib/types";
import { getStore } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "");
    const description = String(body.description ?? "");
    const occasion = (["wedding", "travel", "party", "graduation", "birthday", "other"].includes(
      body.occasion,
    )
      ? body.occasion
      : "other") as Occasion;
    const filterPreset = String(body.filterPreset ?? "kodak-gold-400");
    const aspectRatio = (["3:2", "1:1", "4:3", "9:16"].includes(body.aspectRatio)
      ? body.aspectRatio
      : "3:2") as AspectRatio;
    const isPrivate = Boolean(body.isPrivate);
    const coverDataUrl =
      typeof body.coverDataUrl === "string" && body.coverDataUrl.startsWith("data:")
        ? body.coverDataUrl
        : undefined;

    const space = getStore().createSpace({
      name,
      description,
      occasion,
      filterPreset,
      aspectRatio,
      isPrivate,
      coverDataUrl,
    });

    return NextResponse.json({
      space: getStore().toPublic(space),
      hostSecret: space.hostSecret,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "建立失敗";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
