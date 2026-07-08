import Link from "next/link";
import { colors } from "@/lib/theme";

const SUPPORTED_DISHES = [
  "Pizza", "Hamburger", "Sushi", "Mì ramen", "Phở bò",
  "Cơm chiên", "Chả giò / gỏi cuốn", "Mì Ý sốt bò bằm", "Taco", "Sủi cảo / bánh xếp",
  "Bánh pancake", "Bánh waffle", "Bánh donut", "Kem", "Hot dog",
  "Khoai tây chiên", "Cánh gà chiên/nướng", "Bít tết", "Sashimi", "Trứng ốp lết",
  "Bánh táo", "Bánh Baklava", "Cơm trộn Hàn Quốc", "Burrito ăn sáng", "Bruschetta",
  "Salad Caesar", "Salad Caprese", "Bánh cà rốt", "Cheesecake", "Cà ri gà",
  "Quesadilla gà", "Bánh socola", "Churros", "Sandwich club", "Crème brûlée",
  "Trứng Benedict", "Falafel", "Cá chiên khoai tây kiểu Anh", "Súp hành Pháp", "Bánh mì chiên trứng",
  "Bánh mì bơ tỏi", "Salad Hy Lạp", "Sandwich phô mai nướng", "Cá hồi nướng", "Guacamole",
  "Gyoza", "Lasagna", "Mì ống phô mai", "Súp miso", "Nachos",
];

const STEPS = [
  {
    n: "01",
    title: "Chụp hoặc tải ảnh món ăn",
    desc: "Một món ăn đã nấu xong, hoàn chỉnh — không phải nguyên liệu rời.",
  },
  {
    n: "02",
    title: "Model tự huấn luyện phân tích",
    desc: "EfficientNetB0 fine-tune trên Food-101 nhận diện món với độ tin cậy kèm theo.",
  },
  {
    n: "03",
    title: "Nhận nguyên liệu & công thức",
    desc: "Hệ thống tra cứu và hiển thị danh sách nguyên liệu cùng các bước nấu chi tiết.",
  },
];

function ScanCorners() {
  // Motif viewfinder — gợi nhắc việc "quét" ảnh món ăn bằng computer vision
  const bracket = (transform: string) => (
    <path
      d="M0 16V4a4 4 0 0 1 4-4h12"
      stroke={colors.teal}
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
      transform={transform}
    />
  );
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" style={{ opacity: 0.9 }}>
      <g transform="translate(2,2)">{bracket("")}</g>
      <g transform="translate(118,2) scale(-1,1)">{bracket("")}</g>
      <g transform="translate(2,118) scale(1,-1)">{bracket("")}</g>
      <g transform="translate(118,118) scale(-1,-1)">{bracket("")}</g>
    </svg>
  );
}

export default function HomePage() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>
      {/* Hero */}
      <section
        style={{
          paddingTop: 96,
          paddingBottom: 64,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 24,
        }}
      >
        <ScanCorners />
        <h1
          style={{
            fontSize: 44,
            fontWeight: 600,
            lineHeight: 1.15,
            margin: 0,
            maxWidth: 640,
          }}
        >
          Nhận diện món ăn bằng AI,{" "}
          <span style={{ color: colors.teal }}>gợi ý công thức</span> nấu lại
        </h1>
        <p
          style={{
            fontSize: 17,
            color: colors.textSecondary,
            maxWidth: 560,
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Đồ án tốt nghiệp — model CNN tự fine-tune trên Food-101 (50 món),
          không chỉ gọi API có sẵn. Tải ảnh một món ăn hoàn chỉnh, hệ thống sẽ
          gọi tên món và đưa ra công thức nấu.
        </p>
        <Link
          href="/recognize"
          style={{
            marginTop: 8,
            backgroundColor: colors.teal,
            color: "#04201c",
            fontWeight: 600,
            fontSize: 15,
            padding: "13px 28px",
            borderRadius: 999,
            textDecoration: "none",
          }}
        >
          Thử nhận diện món ăn →
        </Link>
      </section>

      {/* How it works */}
      <section style={{ padding: "48px 0" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
          }}
        >
          {STEPS.map((step) => (
            <div
              key={step.n}
              style={{
                backgroundColor: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: 16,
                padding: 24,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: colors.teal,
                  letterSpacing: 1,
                  marginBottom: 12,
                }}
              >
                {step.n}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 8px" }}>
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Supported dishes */}
      <section style={{ padding: "16px 0 96px" }}>
        <h2
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: colors.textSecondary,
            marginBottom: 16,
          }}
        >
          Hệ thống hiện nhận diện được {SUPPORTED_DISHES.length} món sau:
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {SUPPORTED_DISHES.map((dish) => (
            <span
              key={dish}
              style={{
                backgroundColor: colors.surfaceRaised,
                border: `1px solid ${colors.border}`,
                color: colors.textPrimary,
                fontSize: 13,
                padding: "7px 14px",
                borderRadius: 999,
              }}
            >
              {dish}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
