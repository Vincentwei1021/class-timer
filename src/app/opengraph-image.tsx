import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "课堂倒计时 - 在线教学计时器";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(135deg, #047857 0%, #059669 50%, #34d399 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 80, fontWeight: 900, marginBottom: 16 }}>⏱️</div>
        <div style={{ fontSize: 64, fontWeight: 800, marginBottom: 12 }}>课堂倒计时</div>
        <div style={{ fontSize: 28, opacity: 0.85 }}>在线教学计时器 · 全屏投影模式</div>
        <div
          style={{
            marginTop: 40,
            fontSize: 20,
            opacity: 0.6,
            letterSpacing: 2,
          }}
        >
          timer.toolboxlite.com
        </div>
      </div>
    ),
    { ...size }
  );
}
