import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function AccountPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-cream">
      <header className="flex items-center justify-between px-5 py-4 border-b border-borderline">
        <Logo />
        <Link href="/" className="text-sm text-brown/70">
          回首頁
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto">
        <h1 className="font-heading text-3xl text-brown mb-3">帳號</h1>
        <p className="text-sm text-charcoal/75 leading-relaxed font-noto-tc mb-6">
          Host 登入（Email / Google）將透過 Supabase Auth 實作。目前 MVP 以本機瀏覽器儲存主辦者密鑰管理空間。
        </p>
        <Link href="/create" className="rounded-[4px] border border-brown/30 px-6 py-3 text-brown text-sm">
          建立空間
        </Link>
      </main>
    </div>
  );
}
