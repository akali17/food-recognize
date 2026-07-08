"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { colors } from "@/lib/theme";

type Prediction = {
  class_name: string;
  vi_name: string | null;
  confidence: number;
};

type PredictResponse = {
  top1: Prediction;
  top3: Prediction[];
  ingredients: string[] | null;
  recipe_steps: string[] | null;
};

type Status = "idle" | "loading" | "done" | "error";

export default function RecognizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(selected: File | null) {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setErrorMsg("File phải là ảnh (jpg, png, ...)");
      return;
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setStatus("idle");
    setResult(null);
    setErrorMsg(null);
  }

  async function handleSubmit() {
    if (!file) return;
    setStatus("loading");
    setErrorMsg(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/predict", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error ?? "Có lỗi xảy ra, thử lại sau.");
      }
      setResult(data as PredictResponse);
      setStatus("done");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Có lỗi xảy ra, thử lại sau."
      );
      setStatus("error");
    }
  }

  function handleReset() {
    setFile(null);
    setPreviewUrl(null);
    setStatus("idle");
    setResult(null);
    setErrorMsg(null);
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 96px" }}>
      <Link
        href="/"
        style={{ color: colors.textSecondary, fontSize: 14, textDecoration: "none" }}
      >
        ← Về trang chủ
      </Link>

      <h1 style={{ fontSize: 28, fontWeight: 600, margin: "16px 0 32px" }}>
        Nhận diện món ăn
      </h1>

      {/* Upload zone */}
      {!previewUrl && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFile(e.dataTransfer.files?.[0] ?? null);
          }}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? colors.teal : colors.border}`,
            borderRadius: 16,
            padding: "64px 24px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: colors.surface,
            transition: "border-color 0.15s",
          }}
        >
          <p style={{ fontSize: 15, color: colors.textPrimary, margin: "0 0 6px" }}>
            Kéo thả ảnh vào đây, hoặc bấm để chọn file
          </p>
          <p style={{ fontSize: 13, color: colors.textSecondary, margin: 0 }}>
            JPG, PNG — ảnh một món ăn đã nấu xong
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
        </div>
      )}

      {errorMsg && (
        <p style={{ color: colors.danger, fontSize: 14, marginTop: 12 }}>
          {errorMsg}
        </p>
      )}

      {/* Preview + actions */}
      {previewUrl && (
        <div style={{ marginTop: 8 }}>
          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${colors.border}`,
              marginBottom: 16,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Ảnh món ăn đã chọn"
              style={{
                width: "100%",
                display: "block",
                maxHeight: 420,
                objectFit: "cover",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={handleSubmit}
              disabled={status === "loading"}
              style={{
                flex: 1,
                backgroundColor: colors.teal,
                color: "#04201c",
                fontWeight: 600,
                fontSize: 15,
                padding: "13px 0",
                borderRadius: 999,
                border: "none",
                cursor: status === "loading" ? "default" : "pointer",
                opacity: status === "loading" ? 0.7 : 1,
              }}
            >
              {status === "loading" ? "Đang nhận diện..." : "Nhận diện món ăn"}
            </button>
            <button
              onClick={handleReset}
              disabled={status === "loading"}
              style={{
                backgroundColor: "transparent",
                color: colors.textSecondary,
                fontSize: 14,
                padding: "13px 20px",
                borderRadius: 999,
                border: `1px solid ${colors.border}`,
                cursor: "pointer",
              }}
            >
              Chọn ảnh khác
            </button>
          </div>
        </div>
      )}

      {/* Result */}
      {status === "done" && result && (
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Top1 */}
          <div
            style={{
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              padding: 24,
            }}
          >
            <p style={{ fontSize: 13, color: colors.textSecondary, margin: "0 0 6px" }}>
              Nhận diện được
            </p>
            <h2
              style={{
                fontSize: 26,
                fontWeight: 600,
                margin: "0 0 4px",
                color: colors.teal,
              }}
            >
              {result.top1.vi_name ?? result.top1.class_name}
            </h2>
            <p style={{ fontSize: 14, color: colors.textSecondary, margin: 0 }}>
              Độ tin cậy: {Math.round(result.top1.confidence * 100)}%
            </p>
          </div>

          {/* Top3 */}
          <div>
            <h3
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: colors.textSecondary,
                marginBottom: 10,
              }}
            >
              Top 3 khả năng
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {result.top3.map((p) => (
                <div
                  key={p.class_name}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <span style={{ fontSize: 14, width: 140, flexShrink: 0 }}>
                    {p.vi_name ?? p.class_name}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 6,
                      backgroundColor: colors.surfaceRaised,
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.round(p.confidence * 100)}%`,
                        height: "100%",
                        backgroundColor: colors.teal,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      color: colors.textSecondary,
                      width: 40,
                      textAlign: "right",
                    }}
                  >
                    {Math.round(p.confidence * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          {result.ingredients && (
            <div>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: colors.textSecondary,
                  marginBottom: 10,
                }}
              >
                Nguyên liệu
              </h3>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {result.ingredients.map((ing, i) => (
                  <li key={i} style={{ fontSize: 14, lineHeight: 1.6 }}>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recipe steps */}
          {result.recipe_steps && (
            <div>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: colors.textSecondary,
                  marginBottom: 10,
                }}
              >
                Cách làm
              </h3>
              <ol
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {result.recipe_steps.map((step, i) => (
                  <li key={i} style={{ fontSize: 14, lineHeight: 1.7 }}>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </main>
  );
}