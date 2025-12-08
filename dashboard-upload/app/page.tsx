"use client";

import "./markdown.css";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import type { CSSProperties } from "react";

// ------------------------- INLINE LAYOUT STYLES -------------------------

const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#111",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "700px",
    background: "#1c1c1c",
    padding: "32px",
    borderRadius: "16px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
    color: "#fff",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: 700,
    textAlign: "left",
  },
  markdown: {
    color: "#ddd",
  },
  buttonWrapper: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
  },
  button: {
    padding: "12px 24px",
    background: "#3a6ad6",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
};

// ------------------------- RAW README -------------------------

const README_URL =
  "https://raw.githubusercontent.com/pradervonsky/vbig/main/README.md";

// ------------------------- COMPONENT -------------------------

export default function HomePage() {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    async function loadReadme() {
      try {
        const res = await fetch(README_URL);
        const text = await res.text();
        setMarkdown(text);
      } catch {
        setMarkdown("⚠️ Failed to load README.md");
      }
    }
    loadReadme();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div className="markdown-body" style={styles.markdown}>
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>

        <div style={styles.buttonWrapper}>
          <Link href="/upload">
            <button
              style={styles.button}
              onMouseOver={(e) => (e.currentTarget.style.background = "#23499d")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#3a6ad6")}
            >
              Go to Upload Form
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}