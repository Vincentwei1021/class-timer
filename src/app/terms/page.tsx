import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "服务条款 - 课堂倒计时",
  description: "课堂倒计时服务条款",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800 mb-8 transition-colors"
        >
          &larr; 返回计时器
        </Link>

        <h1 className="text-2xl font-bold text-emerald-900 mb-6">服务条款</h1>
        <div className="space-y-4 text-sm leading-relaxed text-emerald-800/80">
          <p>最后更新日期：2026年4月7日</p>

          <h2 className="text-lg font-semibold text-emerald-900 mt-6">
            服务说明
          </h2>
          <p>
            课堂倒计时（timer.toolboxlite.com）是一款免费的在线计时工具，专为课堂教学场景设计。本工具完全在浏览器端运行，无需注册或登录。
          </p>

          <h2 className="text-lg font-semibold text-emerald-900 mt-6">
            使用条款
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>本工具仅供合法的教学和个人使用</li>
            <li>您可以自由使用本工具的所有功能</li>
            <li>请勿对本网站进行恶意攻击或滥用</li>
          </ul>

          <h2 className="text-lg font-semibold text-emerald-900 mt-6">
            免责声明
          </h2>
          <p>
            本工具按"原样"提供，不做任何明示或暗示的保证。我们不对因使用本工具而产生的任何直接或间接损失承担责任。计时器的准确性取决于您的设备和浏览器性能。
          </p>

          <h2 className="text-lg font-semibold text-emerald-900 mt-6">
            知识产权
          </h2>
          <p>
            本网站的设计、代码和内容均受知识产权法保护。未经授权，不得复制、修改或分发本网站的任何部分。
          </p>

          <h2 className="text-lg font-semibold text-emerald-900 mt-6">
            条款变更
          </h2>
          <p>
            我们保留随时修改本服务条款的权利。修改后的条款将在本页面发布后立即生效。继续使用本服务即表示您同意修改后的条款。
          </p>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-emerald-700/40">
        <div className="flex items-center justify-center gap-3">
          <span>&copy; 2026 ToolboxLite</span>
          <span className="text-emerald-300">|</span>
          <Link
            href="/privacy"
            className="hover:text-emerald-600 transition-colors"
          >
            隐私政策
          </Link>
          <span className="text-emerald-300">|</span>
          <Link
            href="/terms"
            className="hover:text-emerald-600 transition-colors"
          >
            服务条款
          </Link>
        </div>
      </footer>
    </div>
  );
}
