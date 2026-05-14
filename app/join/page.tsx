"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

export default function JoinSpacePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const normalized = code.trim().toUpperCase();
    if (normalized.length < 4) {
      setError("請輸入邀請碼");
      return;
    }
    setChecking(true);
    try {
      const res = await fetch(`/api/spaces/${normalized}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "找不到空間");
      router.push(`/s/${data.space.inviteCode}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "無法加入");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="min-h-dvh flex flex-col bg-cream">
      <header className="flex items-center justify-between px-5 py-4 border-b border-borderline">
        <Logo />
        <Link href="/" className="text-sm text-brown/70 hover:text-brown">
          回首頁
        </Link>
      </header>
      <main className="flex-1 flex items-center px-5 py-16">
        <div className="max-w-md mx-auto w-full">
          <h1 className="font-heading text-3xl text-brown mb-2 text-center">加入空間</h1>
          <p className="text-sm text-charcoal/70 mb-2 text-center font-noto-tc">
            輸入 6 位邀請碼，或請主辦者分享連結。
          </p>
          <p className="text-xs text-charcoal/55 mb-8 text-center font-noto-tc leading-relaxed">
            若顯示找不到空間，可能是伺服器已重啟，請主辦者重新建立空間。
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              className="w-full rounded-[4px] border border-borderline bg-grain px-3 py-3 text-center font-mono text-2xl tracking-[0.35em] outline-none focus:border-gold uppercase"
              placeholder="XXXXXX"
              maxLength={8}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              autoCapitalize="characters"
            />
            {error ? <p className="text-sm text-red-700 text-center">{error}</p> : null}
            <button
              type="submit"
              disabled={checking}
              className="w-full rounded-[4px] bg-brown py-3 text-cream text-sm disabled:opacity-60"
            >
              {checking ? "確認中…" : "進入空間"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
