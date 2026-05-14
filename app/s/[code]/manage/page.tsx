"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { PhotoRecord, SpacePublic } from "@/lib/types";
import { getHostSecret } from "@/lib/guest";

export default function ManagePage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = String(params.code ?? "").toUpperCase();
  const [space, setSpace] = useState<SpacePublic | null>(null);
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [secret, setSecret] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [sRes, pRes] = await Promise.all([
      fetch(`/api/spaces/${code}`),
      fetch(`/api/spaces/${code}/photos`),
    ]);
    const sJson = await sRes.json();
    const pJson = await pRes.json();
    if (sRes.ok) setSpace(sJson.space);
    if (pRes.ok) setPhotos(pJson.photos ?? []);
  }, [code]);

  useEffect(() => {
    const s = getHostSecret(code);
    setSecret(s);
    if (!s) {
      router.replace(`/s/${code}`);
      return;
    }
    void load();
  }, [code, load, router]);

  async function removePhoto(id: string) {
    if (!secret) return;
    const res = await fetch(`/api/spaces/${code}/photos/${id}`, {
      method: "DELETE",
      headers: { "x-grainly-host-secret": secret },
    });
    if (res.ok) void load();
  }

  if (!secret) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-cream text-sm text-charcoal/70">
        驗證中…
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-cream">
      <header className="flex items-center justify-between border-b border-borderline px-4 py-3">
        <button type="button" className="text-sm text-brown" onClick={() => router.push(`/s/${code}`)}>
          ← 返回
        </button>
        <h1 className="font-heading text-lg text-brown">管理</h1>
        <span className="w-10" />
      </header>
      <main className="flex-1 p-4 max-w-lg mx-auto w-full">
        <p className="text-sm text-charcoal/70 mb-4 font-noto-tc">
          {space?.name} · 共 {photos.length} 張
        </p>
        <ul className="space-y-3">
          {photos.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-[4px] border border-borderline bg-grain p-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.dataUrl} alt="" className="h-16 w-16 object-cover rounded film-frame" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono text-charcoal/50 truncate">{p.id}</p>
                <p className="text-[10px] font-mono text-charcoal/40">{p.guestTokenPrefix}…</p>
              </div>
              <button
                type="button"
                className="text-xs text-red-700 px-2 py-1"
                onClick={() => void removePhoto(p.id)}
              >
                刪除
              </button>
            </li>
          ))}
        </ul>
        {photos.length === 0 ? (
          <p className="text-center text-sm text-charcoal/50 mt-10">尚無照片</p>
        ) : null}
        <p className="text-[10px] text-charcoal/40 mt-8 text-center font-mono">
          下載解鎖與 Stripe 串接將在 Phase 2 啟用。
        </p>
        <Link href="/checkout" className="block text-center text-sm text-brown underline mt-4">
          前往付費頁（示意）
        </Link>
      </main>
    </div>
  );
}
