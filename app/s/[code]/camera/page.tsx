"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FILTER_PRESETS, getFilterById } from "@/lib/filters";
import type { AspectRatio, SpacePublic } from "@/lib/types";

function aspectBoxClass(ratio: AspectRatio): string {
  switch (ratio) {
    case "1:1":
      return "aspect-square max-h-[min(72vh,520px)]";
    case "4:3":
      return "aspect-[4/3] max-h-[min(72vh,520px)]";
    case "9:16":
      return "aspect-[9/16] max-h-[min(80vh,640px)]";
    case "3:2":
    default:
      return "aspect-[3/2] max-h-[min(72vh,520px)]";
  }
}

function playShutter() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 720;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    osc.start(t);
    osc.stop(t + 0.1);
    void ctx.resume().finally(() => {
      setTimeout(() => void ctx.close(), 200);
    });
  } catch {
    /* ignore */
  }
}

export default function CameraPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();
  const code = String(params.code ?? "").toUpperCase();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [space, setSpace] = useState<SpacePublic | null>(null);
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [filterId, setFilterId] = useState(FILTER_PRESETS[0]!.id);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [flash, setFlash] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(true);

  const preset = getFilterById(filterId);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startStream = useCallback(async () => {
    setStarting(true);
    setError(null);
    stopStream();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      const v = videoRef.current;
      if (v) {
        v.srcObject = stream;
        await v.play();
      }
    } catch {
      setError("無法啟動相機，請確認瀏覽器權限。");
    } finally {
      setStarting(false);
    }
  }, [facing, stopStream]);

  useEffect(() => {
    void (async () => {
      if (!code) return;
      const res = await fetch(`/api/spaces/${code}`);
      const data = await res.json();
      if (res.ok && data.space) {
        setSpace(data.space);
        setFilterId(data.space.filterPreset || FILTER_PRESETS[0]!.id);
      }
    })();
  }, [code]);

  useEffect(() => {
    void startStream();
    return () => stopStream();
  }, [startStream, stopStream]);

  function captureFrame(): string | null {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return null;
    const w = video.videoWidth;
    const h = video.videoHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.filter = preset.cssFilter;
    ctx.drawImage(video, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.88);
  }

  function onShutter() {
    const dataUrl = captureFrame();
    if (!dataUrl) return;
    playShutter();
    setFlash(true);
    window.setTimeout(() => setFlash(false), 120);
    try {
      sessionStorage.setItem(
        "grainly_pending",
        JSON.stringify({ code, dataUrl, filterId, ts: Date.now() }),
      );
    } catch {
      /* quota */
    }
    router.push(`/s/${code}/preview`);
  }

  const ratio = (space?.aspectRatio ?? "3:2") as AspectRatio;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {flash ? (
        <div className="pointer-events-none absolute inset-0 z-[60] bg-white animate-shutter-flash" />
      ) : null}

      <div className="relative flex-1 flex items-center justify-center bg-black">
        {error ? (
          <div className="text-cream text-center px-6 max-w-sm">
            <p className="mb-4 font-noto-tc">{error}</p>
            <Link href={`/s/${code}`} className="text-gold underline text-sm">
              返回空間
            </Link>
          </div>
        ) : (
          <div
            className={`relative w-full max-w-lg mx-auto overflow-hidden rounded-sm bg-charcoal ${aspectBoxClass(
              ratio,
            )}`}
          >
            <video
              ref={videoRef}
              playsInline
              muted
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: preset.cssFilter }}
            />
            {starting ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-cream text-sm gap-2">
                <span className="h-8 w-8 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                正在啟動相機…
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-2 py-2 bg-gradient-to-b from-black/70 to-transparent">
        <Link href={`/s/${code}`} className="rounded px-3 py-2 text-cream text-sm">
          返回
        </Link>
        <button
          type="button"
          className="rounded px-3 py-2 text-cream text-sm"
          onClick={() => setFacing((f) => (f === "environment" ? "user" : "environment"))}
        >
          翻轉鏡頭
        </button>
        <button type="button" className="rounded px-3 py-2 text-cream text-sm" onClick={() => setSheetOpen(true)}>
          濾鏡
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-end justify-center gap-10 pb-8 pt-10 bg-gradient-to-t from-black/80 to-transparent">
        <button
          type="button"
          aria-label="快門"
          onClick={onShutter}
          className="h-20 w-20 rounded-full border-[5px] border-brown bg-white shadow-lg active:scale-95 transition-transform"
        />
      </div>

      {sheetOpen ? (
        <div className="absolute inset-x-0 bottom-0 z-40 animate-sheet-up rounded-t-2xl bg-cream border-t border-borderline p-4 max-h-[45vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="font-heading text-lg text-brown">濾鏡</span>
            <button type="button" className="text-sm text-brown/70" onClick={() => setSheetOpen(false)}>
              完成
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {FILTER_PRESETS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilterId(f.id)}
                className={`shrink-0 rounded-[4px] border px-3 py-2 text-xs ${
                  filterId === f.id ? "border-gold bg-gold/20 text-brown" : "border-borderline"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
