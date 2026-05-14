import Link from "next/link";
import { Logo } from "./Logo";

type SiteHeaderProps = {
  variant?: "default" | "onDark";
};

export function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const isDark = variant === "onDark";
  const navClass = isDark
    ? "text-coffee-foam/85 hover:text-coffee-foam"
    : "text-brown/80 hover:text-brown";

  return (
    <header className="flex items-center justify-between px-5 py-4 max-w-6xl mx-auto w-full">
      <Logo tone={isDark ? "light" : "default"} />
      <nav className={`flex items-center gap-5 text-sm transition-colors ${navClass}`}>
        <Link href="/join" className={isDark ? "hover:text-coffee-foam" : ""}>
          加入空間
        </Link>
        <Link href="/account" className={isDark ? "hover:text-coffee-foam" : ""}>
          帳號
        </Link>
      </nav>
    </header>
  );
}
