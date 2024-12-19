import { MicIcon as MicrophoneIcon, BarChartIcon as ChartBarIcon } from "lucide-react";
import Link from "next/link";
import { FeatureCardProps } from "./types";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <main>
        <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-extrabold mb-4">ラッパーのフィーチャリングと歌詞を分析</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            ヒップホップの世界をデータで可視化。あなたの好きなラッパーのコラボレーションと歌詞の傾向を探索しよう。
          </p>
          <Link href="/network" passHref>
            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
              始める
            </Button>
          </Link>
        </section>

        <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="container mx-auto">
            <h3 className="text-3xl font-bold mb-12 text-center">機能</h3>
            <div className="grid md:grid-cols-2 gap-12">
              <FeatureCard
                icon={<MicrophoneIcon className="w-12 h-12 mb-4" />}
                title="フィーチャリングの可視化"
                description="ラッパー同士のコラボレーションをネットワークグラフで表示。誰が誰とよく組むのか一目で分かります。"
              />
              <FeatureCard
                icon={<ChartBarIcon className="w-12 h-12 mb-4" />}
                title="歌詞分析"
                description="使用頻度の高い単語など、歌詞を多角的に分析&視覚化します。"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  const linkPath = title === "フィーチャリングの可視化" ? "/network" : "/artists";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      {icon}
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="mb-4">{description}</p>
      <Link href={linkPath} passHref>
        <Button variant="outline" className="mt-2">
          見る
        </Button>
      </Link>
    </div>
  );
}
