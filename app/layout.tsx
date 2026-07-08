import type { Metadata } from "next";
import "./globals.css";
import { colors } from "@/lib/theme";

export const metadata: Metadata = {
  title: "AI Food Recognition — Nhận diện món ăn, gợi ý công thức",
  description:
    "Chụp ảnh một món ăn đã nấu xong, AI tự huấn luyện sẽ nhận diện món và gợi ý công thức nấu lại từ đầu.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body
        style={{
          backgroundColor: colors.bg,
          color: colors.textPrimary,
          margin: 0,
          minHeight: "100vh",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
