import Link from "next/link";

export default function ErrorPage({
  searchParams,
}: {
  searchParams?: { m?: string };
}) {
  const msg = searchParams?.m;
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-cream px-6 text-center">
      <p className="font-display text-4xl text-brown mb-2">◎</p>
      <h1 className="font-heading text-2xl text-brown mb-2">出了點問題</h1>
      <p className="text-sm text-charcoal/70 mb-8 max-w-sm font-noto-tc">
        {msg ?? "此空間暫時不開放，請向主辦者確認邀請碼。"}
      </p>
      <Link href="/" className="rounded-[4px] bg-brown px-6 py-3 text-cream text-sm">
        回首頁
      </Link>
    </div>
  );
}
