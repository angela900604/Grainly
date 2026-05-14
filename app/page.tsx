import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";

const occasions = ["婚禮", "旅遊", "聚會", "畢業", "生日"];

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <div className="border-b border-coffee/10 bg-gradient-to-r from-coffee-deep/92 via-coffee/88 to-coffee-mist/90 text-coffee-foam">
        <SiteHeader variant="onDark" />
      </div>
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-coffee/10">
          <div
            className="absolute inset-0 bg-gradient-to-b from-coffee-deep/20 via-cream/75 to-coffee-latte/90 z-10"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(212,184,150,0.35),transparent_60%)] opacity-90"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_100%,rgba(74,50,39,0.08),transparent)]"
            aria-hidden
          />
          <div className="relative z-20 max-w-4xl mx-auto px-6 pt-16 pb-24 text-center">
            <p className="text-sm tracking-[0.25em] text-coffee-mist uppercase mb-4 font-mono">
              膠卷記憶 × 共享時光
            </p>
            <h1 className="font-display text-4xl sm:text-6xl text-coffee-deep leading-tight mb-6 drop-shadow-sm">
              每個快門，
              <br />
              都是一段共同記憶。
            </h1>
            <p className="font-noto-tc text-charcoal/85 max-w-xl mx-auto mb-10 text-base leading-relaxed">
              復古膠卷風格的共享相機 Web App。聚會、婚禮、旅途——每個人都能拍照，一起留下有溫度的相片空間。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
              <Link
                href="/create"
                className="inline-flex justify-center rounded-[4px] bg-coffee-deep px-8 py-3.5 text-coffee-foam text-sm font-medium tracking-wide shadow-card hover:bg-coffee transition-colors duration-200 ease-out-soft"
              >
                建立空間
              </Link>
              <Link
                href="/join"
                className="inline-flex justify-center rounded-[4px] border border-coffee/35 bg-cream/40 backdrop-blur-sm px-8 py-3.5 text-coffee-deep text-sm font-medium tracking-wide hover:border-coffee hover:bg-cream/70 transition-colors"
              >
                加入空間
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-b from-coffee-latte/50 to-grain py-16 px-5 border-b border-borderline/60">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8">
            {[
              {
                title: "復古相機濾鏡",
                body: "Kodak、Fuji、Ilford 等多款膠卷風格，顆粒與色偏都是溫度的痕跡。",
              },
              {
                title: "即時共享空間",
                body: "QR Code 與邀請碼，賓客免註冊即可加入，一起填滿這卷底片。",
              },
              {
                title: "印刷成冊（即將）",
                body: "精選相片製作實體相簿，把共同記憶帶回家。",
              },
            ].map((f) => (
              <article
                key={f.title}
                className="rounded-lg border border-coffee/10 bg-cream/90 p-6 shadow-card ring-1 ring-coffee-crema/20"
              >
                <h3 className="font-heading text-xl text-coffee-deep mb-2">{f.title}</h3>
                <p className="text-sm text-charcoal/75 leading-relaxed font-noto-tc">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-14 px-5 bg-cream/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-heading text-2xl text-coffee-deep text-center mb-8">適合的場合</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 justify-center flex-wrap">
              {occasions.map((o) => (
                <span
                  key={o}
                  className="shrink-0 rounded-full border border-coffee/15 bg-coffee-foam/90 px-4 py-2 text-sm text-coffee-mist shadow-sm"
                >
                  {o}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-coffee/20 bg-coffee-deep py-8 text-center text-xs text-coffee-crema/90 font-mono">
        Grainly PRD v1.0 · Progressive Web App
      </footer>
    </div>
  );
}
