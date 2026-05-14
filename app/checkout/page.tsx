import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function CheckoutPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-cream">
      <header className="flex items-center justify-between px-5 py-4 border-b border-borderline">
        <Logo />
        <Link href="/" className="text-sm text-brown/70">
          回首頁
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto">
        <h1 className="font-heading text-3xl text-brown mb-3">付費與下載</h1>
        <p className="text-sm text-charcoal/75 leading-relaxed font-noto-tc mb-6">
          Phase 2 將串接 Stripe Checkout：解鎖無限下載、實體相簿訂購與訂閱 Pro。此頁為佔位介面。
        </p>
        <Link
          href="/"
          className="rounded-[4px] bg-brown px-6 py-3 text-cream text-sm"
        >
          返回首頁
        </Link>
      </main>
    </div>
  );
}
