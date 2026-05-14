import Link from "next/link";

type LogoProps = {
  className?: string;
  /** 用在深色底上 */
  tone?: "default" | "light";
};

export function Logo({ className = "", tone = "default" }: LogoProps) {
  const text = tone === "light" ? "text-coffee-foam" : "text-brown";
  return (
    <Link href="/" className={`inline-flex items-baseline gap-1 ${className}`}>
      <span className={`font-display text-2xl tracking-[0.2em] ${text}`}>◎</span>
      <span className={`font-display text-xl tracking-[0.35em] ${text}`}>GRAINLY</span>
    </Link>
  );
}
