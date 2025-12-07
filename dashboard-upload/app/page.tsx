"use client";

import "./markdown.css";
import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

// ------------------------- INLINE LAYOUT STYLES -------------------------

const styles = {
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
    fontWeight: "700",
    textAlign: "left",
  },
  markdown: {
    color: "#ddd",
  },

  // --- New Upload Button ---
  buttonWrapper: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
  },
  button: {
    padding: "12px 24px",
    background: "#4f46e5",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
  },
};

// ------------------------- RAW GITHUB README URL -------------------------

const README_URL =
  "https://raw.githubusercontent.com/pradervonsky/vdig/main/README.md";

// ------------------------- COMPONENT -------------------------

export default function HomePage() {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    async function loadReadme() {
      try {
        const res = await fetch(README_URL);
        const text = await res.text();
        setMarkdown(text);
      } catch (err) {
        setMarkdown("⚠️ Failed to load README.md");
      }
    }
    loadReadme();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>vdig</h1>

        <div className="markdown-body" style={styles.markdown}>
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>

        {/* Upload Button */}
        <div style={styles.buttonWrapper}>
          <Link href="/upload">
            <button
              style={styles.button}
              onMouseOver={(e) => (e.currentTarget.style.background = "#4338ca")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#4f46e5")}
            >
              Go to Upload Form
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}