"use client";
import { useState } from "react";

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const date = formData.get("date");

    // ------------- CHECK DATE BEFORE UPLOAD -------------
    const check = await fetch("/api/check-date", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date }),
    });

    const checkJson = await check.json();

    if (checkJson.exists) {
      setLoading(false);
      alert(`A dashboard for ${date} already exists in storage, choose another file.`);
      return;
    }

    // ------------- PROCEED WITH UPLOAD -------------
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    setLoading(false);

    if (!res.ok) {
      alert("Upload failed!");
      return;
    }

    setSubmitted(true);
  };

  // -----------------------------------------------------
  // SUCCESS SCREEN
  // -----------------------------------------------------
  if (submitted) {
    return (
      <div style={styles.container}>
        <div
          style={{
            ...styles.card,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2 style={styles.title}>Submission Received!</h2>
          <p style={{ ...styles.paragraph, textAlign: "center" }}>
            Your dashboard screenshot has been successfully uploaded.
          </p>

          <button
            style={styles.button}
            onMouseOver={(e) => (e.currentTarget.style.background = "#23499d")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#3a6ad6")}
            onClick={() => {
              setSubmitted(false);
              setFileName("No file chosen");
            }}
          >
            Submit another response
          </button>

          <button
            style={{
              ...styles.button,
              marginTop: "10px",
              background: "#333",
            }}
            onClick={() => (window.location.href = "/")}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------------------
  // UPLOAD FORM
  // -----------------------------------------------------
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Mockup Daily Dashboard</h2>

        <p style={styles.paragraph}>
          Temporary upload form for the dashboard screenshot. The plan is to
          automatically capture the KPI Superstore Sales dashboard from previous
          day at 05.00 AM daily and run it through the agentic workflow.
        </p>

        <form onSubmit={handleUpload} style={styles.form}>
          <label style={styles.label}>Select PNG File</label>

          <div style={styles.fileWrapper}>
            <input
              id="fileInput"
              type="file"
              name="file"
              accept="image/png"
              required
              style={styles.hiddenFile}
              onChange={(e) =>
                setFileName(e.target.files[0]?.name || "No file chosen")
              }
            />

            <button
              type="button"
              onClick={() => document.getElementById("fileInput").click()}
              style={styles.fileButton}
            >
              Choose File
            </button>

            <span style={styles.fileName}>{fileName}</span>
          </div>

          <label style={styles.label}>Date</label>
          <input type="date" name="date" required style={styles.input} />

          <button type="submit" disabled={loading} style={styles.button}
              onMouseOver={(e) => (e.currentTarget.style.background = "#23499d")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#3a6ad6")}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}

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
    maxWidth: "380px",
    background: "#1c1c1c",
    padding: "28px",
    borderRadius: "12px",
    color: "#fff",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: "15px",
  },
  paragraph: {
    fontSize: "16px",
    textAlign: "justify",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
  },
  input: {
    padding: "10px",
    background: "#222",
    borderRadius: "6px",
    border: "1px solid #444",
    color: "#fff",
  },
  fileWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#222",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #444",
  },
  hiddenFile: { display: "none" },
  fileButton: {
    background: "#444",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  fileName: {
    color: "#bbb",
    fontSize: "14px",
    overflow: "hidden",
  },
  button: {
    padding: "12px",
    background: "#3a6ad6",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
  },
};