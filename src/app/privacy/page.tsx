import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "隐私政策 - 课堂倒计时",
  description: "课堂倒计时隐私政策",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-800 mb-8 transition-colors"
        >
          &larr; 返回计时器
        </Link>

        <h1 className="text-2xl font-bold text-emerald-900 mb-6">隐私政策</h1>
        <div className="space-y-4 text-sm leading-relaxed text-emerald-800/80">
          <p>最后更新日期：2026年4月7日</p>

          <h2 className="text-lg font-semibold text-emerald-900 mt-6">
            信息收集
          </h2>
          <p>
            课堂倒计时（timer.toolboxlite.com）是一款纯前端工具，不会收集、存储或传输任何个人信息。所有计时器设置均保存在您的浏览器本地，不会上传到任何服务器。
          </p>

          <h2 className="text-lg font-semibold text-emerald-900 mt-6">
            Cookie 使用
          </h2>
          <p>
            本网站可能使用第三方广告服务（Google
            AdSense），这些服务可能会使用 Cookie
            来提供相关广告。您可以通过浏览器设置管理 Cookie 偏好。
          </p>

          <h2 className="text-lg font-semibold text-emerald-900 mt-6">
            第三方服务
          </h2>
          <p>本网站使用以下第三方服务：</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Google AdSense - 用于展示广告</li>
            <li>Google Fonts - 用于加载字体资源</li>
          </ul>

          <h2 className="text-lg font-semibold text-emerald-900 mt-6">
            数据安全
          </h2>
          <p>
            由于本工具不收集任何个人数据，因此不存在数据泄露的风险。所有功能均在您的浏览器本地运行。
          </p>

          <h2 className="text-lg font-semibold text-emerald-900 mt-6">
            联系我们
          </h2>
          <p>
            如果您对本隐私政策有任何疑问，请通过 ToolboxLite 网站与我们联系。
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
