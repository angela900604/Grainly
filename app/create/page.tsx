"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { FILTER_PRESETS } from "@/lib/filters";
import type { AspectRatio, Occasion } from "@/lib/types";
import { rememberHostSecret } from "@/lib/guest";

const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: "wedding", label: "婚禮" },
  { id: "travel", label: "旅遊" },
  { id: "party", label: "聚會" },
  { id: "graduation", label: "畢業" },
  { id: "birthday", label: "生日" },
  { id: "other", label: "其他" },
];

const RATIOS: { id: AspectRatio; label: string }[] = [
  { id: "3:2", label: "3:2" },
  { id: "1:1", label: "1:1" },
  { id: "4:3", label: "4:3" },
  { id: "9:16", label: "9:16" },
];

export default function CreateSpacePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [occasion, setOccasion] = useState<Occasion>("wedding");
  const [filterPreset, setFilterPreset] = useState(FILTER_PRESETS[0]!.id);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("3:2");
  const [isPrivate, setIsPrivate] = useState(false);
  const [coverDataUrl, setCoverDataUrl] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{
    code: string;
    joinPath: string;
  } | null>(null);

  const filterPreviewStyle = useMemo(() => {
    const f = FILTER_PRESETS.find((p) => p.id === filterPreset) ?? FILTER_PRESETS[0]!;
    return { filter: f.cssFilter } as React.CSSProperties;
  }, [filterPreset]);

  function onCoverFile(file: File | null) {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setCoverDataUrl(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/spaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          occasion,
          filterPreset,
          aspectRatio,
          isPrivate,
          coverDataUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "建立失敗");
      rememberHostSecret(data.space.inviteCode, data.hostSecret);
      setCreated({ code: data.space.inviteCode, joinPath: `/s/${data.space.inviteCode}` });
    } catch (err) {
      setError(err instanceof Error ? err.message : "建立失敗");
    } finally {
      setBusy(false);
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
      <main className="flex-1 px-5 py-10">
        <div className="max-w-[480px] mx-auto">
          <h1 className="font-heading text-3xl text-brown mb-2">建立空間</h1>
          <p className="text-sm text-charcoal/70 mb-2 font-noto-tc">
            設定活動資訊與膠卷風格，系統會產生邀請碼與 QR Code。
          </p>
          <p className="text-xs text-charcoal/55 mb-8 font-noto-tc leading-relaxed">
            資料僅存在此伺服器記憶體；開發伺服器重啟或重新部署後空間會消失，需重新建立。
          </p>

          {created ? (
            <div className="rounded-lg border border-borderline bg-grain p-6 shadow-card text-center">
              <p className="text-sm text-charcoal/80 mb-4 font-noto-tc">空間已建立</p>
              <p className="font-mono text-2xl tracking-[0.2em] text-brown mb-2">{created.code}</p>
              <Image
                src={`/api/qrcode/${created.code}`}
                alt="QR Code"
                width={200}
                height={200}
                unoptimized
                className="mx-auto my-4 rounded bg-cream p-2 border border-borderline"
              />
              <p className="text-xs text-charcoal/60 break-all mb-6">
                {typeof window !== "undefined" ? `${window.location.origin}${created.joinPath}` : created.joinPath}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  className="rounded-[4px] border border-brown/30 px-4 py-2 text-sm text-brown hover:bg-brown/5"
                  onClick={() => {
                    const url = `${window.location.origin}${created.joinPath}`;
                    void navigator.clipboard.writeText(url);
                  }}
                >
                  複製連結
                </button>
                <Link
                  href={created.joinPath}
                  className="inline-flex justify-center rounded-[4px] bg-brown px-4 py-3 text-cream text-sm"
                >
                  進入空間
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-mono text-brown/70 mb-1.5">空間名稱</label>
                <input
                  className="w-full rounded-[4px] border border-borderline bg-grain px-3 py-2.5 text-sm outline-none focus:border-gold"
                  placeholder="Tom & Jenny 的婚禮"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-brown/70 mb-1.5">封面照片</label>
                <label className="flex flex-col items-center justify-center rounded-[4px] border border-dashed border-borderline bg-grain px-4 py-8 cursor-pointer hover:border-gold/60 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onCoverFile(e.target.files?.[0] ?? null)}
                  />
                  {coverDataUrl ? (
                    <Image
                      src={coverDataUrl}
                      width={320}
                      height={200}
                      alt=""
                      unoptimized
                      className="max-h-40 w-auto rounded shadow-film object-contain"
                    />
                  ) : (
                    <span className="text-sm text-charcoal/60 font-noto-tc">拖放或點擊上傳</span>
                  )}
                </label>
              </div>
              <div>
                <label className="block text-xs font-mono text-brown/70 mb-1.5">空間說明（選填）</label>
                <textarea
                  className="w-full rounded-[4px] border border-borderline bg-grain px-3 py-2.5 text-sm outline-none focus:border-gold min-h-[88px] resize-y"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <span className="block text-xs font-mono text-brown/70 mb-2">活動類型</span>
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setOccasion(o.id)}
                      className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                        occasion === o.id
                          ? "border-brown bg-brown text-cream"
                          : "border-borderline text-brown/80 hover:border-brown/40"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="block text-xs font-mono text-brown/70 mb-2">預設濾鏡</span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {FILTER_PRESETS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFilterPreset(f.id)}
                      className={`shrink-0 rounded-[4px] border px-2 py-1 text-xs whitespace-nowrap ${
                        filterPreset === f.id ? "border-gold bg-gold/15 text-brown" : "border-borderline"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
                <div
                  className="mt-3 h-24 rounded-[4px] border border-borderline bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect fill=\'%23c9a89a\' width=\'60\' height=\'60\'/%3E%3C/svg%3E')] bg-cover"
                  style={filterPreviewStyle}
                />
              </div>
              <div>
                <span className="block text-xs font-mono text-brown/70 mb-2">照片比例</span>
                <div className="grid grid-cols-4 gap-2">
                  {RATIOS.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setAspectRatio(r.id)}
                      className={`rounded-[4px] border py-2 text-xs font-mono ${
                        aspectRatio === r.id
                          ? "border-brown bg-brown text-cream"
                          : "border-borderline text-brown/80"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-[4px] border border-borderline bg-grain px-3 py-3">
                <div>
                  <p className="text-sm text-brown font-noto-tc">私密空間</p>
                  <p className="text-xs text-charcoal/55">僅持有邀請碼者可瀏覽（MVP：連結即鑰匙）</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isPrivate}
                  onClick={() => setIsPrivate((v) => !v)}
                  className={`relative h-7 w-12 rounded-full transition-colors ${
                    isPrivate ? "bg-sage" : "bg-borderline"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-cream shadow transition-transform ${
                      isPrivate ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              {error ? <p className="text-sm text-red-700">{error}</p> : null}
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-[4px] bg-brown py-3.5 text-cream text-sm font-medium tracking-wide disabled:opacity-60"
              >
                {busy ? "建立中…" : "建立空間"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
