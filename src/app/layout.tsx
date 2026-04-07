import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "课堂倒计时 - 在线教学计时器",
  description:
    "免费在线课堂倒计时工具，支持全屏投影模式、预设时长、自定义计时。适用于课堂教学、考试计时、课间休息倒计时。",
  keywords:
    "课堂倒计时, 教学计时器, 考试倒计时在线, 全屏倒计时, 课堂计时工具",
  openGraph: {
    title: "课堂倒计时 - 在线教学计时器",
    description:
      "免费在线课堂倒计时工具，支持全屏投影模式、预设时长、自定义计时。",
    url: "https://timer.toolboxlite.com",
    siteName: "课堂倒计时",
    locale: "zh_CN",
    type: "website",
  },
  alternates: {
    canonical: "https://timer.toolboxlite.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "课堂倒计时",
  alternateName: "Classroom Timer",
  description:
    "免费在线课堂倒计时工具，支持全屏投影模式、预设时长、自定义计时。适用于课堂教学、考试计时、课间休息倒计时。",
  url: "https://timer.toolboxlite.com",
  applicationCategory: "EducationalApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CNY",
  },
  inLanguage: "zh-CN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
