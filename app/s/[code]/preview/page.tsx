"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getGuestToken } from "@/lib/guest";

export default function PreviewPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = String(params.code ?? "").toUpperCase();
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("grainly_pending");
      if (!raw) {
        setDataUrl(null);
        return;
      }
      const parsed = JSON.parse(raw) as { code?: string; dataUrl?: string };
      if (parsed.code?.toUpperCase() !== code || !parsed.dataUrl) {
        setDataUrl(null);
        return;
      }
      setDataUrl(parsed.dataUrl);
    } catch {
      setDataUrl(null);
    }
    setReady(true);
  }, [code]);

  async function upload() {
    if (!dataUrl) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/spaces/${code}/photos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-grainly-guest": getGuestToken(),
        },
        body: JSON.stringify({ imageDataUrl: dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "上傳失敗");
      sessionStorage.removeItem("grainly_pending");
      setMsg("已上傳");
      window.setTimeout(() => router.replace(`/s/${code}`), 600);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "上傳失敗");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-black text-cream text-sm">
        載入中…
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-black">
      <header className="flex items-center justify-between px-3 py-3 text-cream/90">
        <button type="button" onClick={() => router.push(`/s/${code}/camera`)} className="text-sm">
          重拍
        </button>
        <span className="text-xs font-mono opacity-70">預覽</span>
        <Link href={`/s/${code}`} className="text-sm">
          關閉
        </Link>
      </header>
      <div className="flex-1 flex items-center justify-center p-3">
        {dataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dataUrl} alt="" className="max-h-[min(78vh,720px)] w-auto max-w-full object-contain film-frame rounded-sm" />
        ) : (
          <p className="text-cream/70 text-sm font-noto-tc">沒有可預覽的相片，請回到相機拍攝。</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 p-4 pb-8 bg-gradient-to-t from-black via-black/90 to-transparent">
        <button
          type="button"
          className="rounded-[4px] border border-cream/25 py-3 text-sm text-cream"
          onClick={() => {
            if (!dataUrl) return;
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = `grainly-${code}.jpg`;
            a.click();
          }}
          disabled={!dataUrl}
        >
          保存
        </button>
        <button
          type="button"
          disabled={!dataUrl || busy}
          onClick={() => void upload()}
          className="rounded-[4px] bg-brown py-3 text-sm text-cream disabled:opacity-50"
        >
          {busy ? "上傳中…" : "上傳到空間"}
        </button>
      </div>
      {msg ? <p className="text-center text-xs text-rose pb-4">{msg}</p> : null}
    </div>
  );
}
