"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import type { PhotoRecord, SpacePublic } from "@/lib/types";
import { getHostSecret } from "@/lib/guest";

export default function SpacePage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = String(params.code ?? "").toUpperCase();
  const [space, setSpace] = useState<SpacePublic | null>(null);
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!code) return;
    setError(null);
    try {
      const [sRes, pRes] = await Promise.all([
        fetch(`/api/spaces/${code}`),
        fetch(`/api/spaces/${code}/photos`),
      ]);
      const sJson = await sRes.json();
      const pJson = await pRes.json();
      if (!sRes.ok) throw new Error(sJson.error ?? "載入失敗");
      if (!pRes.ok) throw new Error(pJson.error ?? "照片載入失敗");
      setSpace(sJson.space);
      setPhotos(pJson.photos ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "載入失敗");
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    function onVis() {
      if (document.visibilityState === "visible") void load();
    }
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [load]);

  const isHost = Boolean(code && getHostSecret(code));

  if (!code) {
    return null;
  }

  return (
    <div className="min-h-dvh flex flex-col bg-cream pb-28">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-borderline bg-cream/95 backdrop-blur px-3 py-3">
        <button
          type="button"
          className="p-2 text-brown/80 hover:text-brown"
          aria-label="返回"
          onClick={() => router.back()}
        >
          ←
        </button>
        <h1 className="flex-1 text-center font-heading text-lg text-brown truncate px-2">
          {space?.name ?? "…"}
        </h1>
        <div className="flex items-center gap-1">
          {isHost ? (
            <Link
              href={`/s/${code}/manage`}
              className="p-2 text-xs font-mono text-brown/70 hover:text-brown"
            >
              管理
            </Link>
          ) : null}
          <button
            type="button"
            className="p-2 text-brown/80 hover:text-brown"
            title="分享"
            onClick={() => {
              const url = `${window.location.origin}/s/${code}`;
              void navigator.clipboard.writeText(url);
            }}
          >
            ⧉
          </button>
        </div>
      </header>

      {loading ? (
        <div className="p-6 space-y-3 max-w-3xl mx-auto w-full">
          <div className="h-40 rounded-lg bg-grain animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded bg-grain animate-pulse" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-charcoal/80 mb-4">{error}</p>
          <Link href="/join" className="text-brown underline text-sm">
            重新加入
          </Link>
        </div>
      ) : space ? (
        <>
          <section className="relative aspect-[16/9] w-full overflow-hidden bg-grain">
            {space.coverDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={space.coverDataUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-rose/40 to-cream" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-cream">
              <p className="font-heading text-2xl drop-shadow-sm">{space.name}</p>
              {space.description ? (
                <p className="text-sm text-cream/90 mt-1 max-w-prose font-noto-tc">{space.description}</p>
              ) : null}
              <p className="text-xs font-mono mt-3 text-cream/80">
                {photos.length} 張照片 · 邀請碼 {space.inviteCode}
              </p>
            </div>
          </section>

          <section className="px-2 pt-4 max-w-5xl mx-auto w-full">
            {photos.length === 0 ? (
              <div className="text-center py-16 px-4">
                <p className="text-4xl mb-3">◎</p>
                <p className="font-noto-tc text-charcoal/75">按下快門，開始記錄吧</p>
              </div>
            ) : (
              <div className="columns-2 sm:columns-3 gap-2 space-y-2">
                {photos.map((p) => (
                  <figure key={p.id} className="break-inside-avoid mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.dataUrl}
                      alt=""
                      className="w-full rounded-[4px] film-frame bg-charcoal/5"
                    />
                    <figcaption className="mt-1 flex justify-between text-[10px] font-mono text-charcoal/45 px-1">
                      <span>{p.guestTokenPrefix}…</span>
                      <span>{new Date(p.createdAt).toLocaleTimeString()}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </section>
        </>
      ) : null}

      <Link
        href={`/s/${code}/camera`}
        className="fixed bottom-6 left-1/2 z-40 flex h-16 w-16 -translate-x-1/2 items-center justify-center rounded-full bg-brown text-cream shadow-card text-2xl hover:bg-brown/90 transition-transform active:scale-95"
        aria-label="拍照"
      >
        ◎
      </Link>

      <div className="fixed bottom-6 right-5 z-40">
        <Link href="/" className="text-xs font-mono text-brown/50 hover:text-brown">
          <Logo className="opacity-60 scale-90" />
        </Link>
      </div>
    </div>
  );
}
