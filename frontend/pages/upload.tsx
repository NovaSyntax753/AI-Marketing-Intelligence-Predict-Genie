import React, { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { uploadDataset } from "@/lib/api";
import {
  FiUploadCloud,
  FiCheck,
  FiAlertCircle,
  FiFile,
  FiX,
} from "react-icons/fi";

interface UploadResult {
  success: boolean;
  records_added: number;
  total_rows: number;
  errors?: string[];
}

const SCHEMA = [
  { col: "user_id", type: "string", note: "Unique user ID (e.g. U1)" },
  { col: "Followers_count", type: "integer", note: "Number of followers" },
  { col: "Post_ID", type: "integer", note: "Post identifier" },
  { col: "Post_Date", type: "date", note: "YYYY-MM-DD or YYYY-MM-DD HH:MM:SS" },
  { col: "Post_type", type: "string", note: "image | video | reel | text" },
  { col: "Likes", type: "integer", note: "Number of likes" },
  { col: "Comments", type: "integer", note: "Number of comments" },
  { col: "Reposts", type: "integer", note: "Number of reposts / shares" },
  {
    col: "Engagement_score",
    type: "float",
    note: "Pre-calculated engagement score",
  },
];

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.name.endsWith(".csv")) {
      setError("Only CSV files are supported.");
      return;
    }
    setFile(f);
    setResult(null);
    setError(null);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const data = await uploadDataset(file);
      setResult(data);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "Upload failed. Please check your file and try again.";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout
      title="Upload"
      subtitle="Import your social media CSV to begin analysis"
      recordCount={0}
    >
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        {/* Dropzone */}
        {!file && !result && (
          <div
            className={`dropzone ${dragging ? "drag-over" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            style={{ marginBottom: "24px" }}
          >
            <input
              ref={inputRef}
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={onInputChange}
              style={{ display: "none" }}
            />
            <div className="dropzone-icon">
              <FiUploadCloud size={24} />
            </div>
            <div className="dropzone-title">
              Drop your CSV here, or click to browse
            </div>
            <div className="dropzone-sub">Supports .csv files · Max 50 MB</div>
          </div>
        )}

        {/* File Selected */}
        {file && (
          <div
            className="card"
            style={{
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                background: "#ede9fe",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FiFile size={20} color="#6c3bfe" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#0f172a",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {file.name}
              </div>
              <div
                style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}
              >
                {(file.size / 1024).toFixed(1)} KB
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={clearFile}
              aria-label="Remove file"
            >
              <FiX size={14} />
            </button>
          </div>
        )}

        {/* Upload Button */}
        {file && (
          <button
            className="btn btn-primary"
            style={{ width: "100%", marginBottom: "24px" }}
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <div
                  className="spinner"
                  style={{ width: "14px", height: "14px" }}
                />
                Uploading…
              </>
            ) : (
              <>
                <FiUploadCloud size={14} />
                Upload Dataset
              </>
            )}
          </button>
        )}

        {/* Success Alert */}
        {result?.success && (
          <div className="alert alert-success" style={{ marginBottom: "24px" }}>
            <FiCheck size={18} />
            <div>
              <div className="alert-title">Upload successful!</div>
              <div className="alert-body">
                {result.records_added} records imported from {result.total_rows}{" "}
                rows
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: "24px" }}>
            <FiAlertCircle size={18} />
            <div>
              <div className="alert-title">Upload failed</div>
              <div className="alert-body">{error}</div>
            </div>
          </div>
        )}

        {/* Schema Info */}
        <div className="card">
          <div className="card-title">Expected CSV Format</div>
          <div className="card-subtitle">
            Your file should include these columns:
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #eef1f7" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px 0",
                      fontWeight: 600,
                      color: "#94a3b8",
                      fontSize: "11px",
                    }}
                  >
                    Column
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px 0",
                      fontWeight: 600,
                      color: "#94a3b8",
                      fontSize: "11px",
                    }}
                  >
                    Type
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "8px 0",
                      fontWeight: 600,
                      color: "#94a3b8",
                      fontSize: "11px",
                    }}
                  >
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {SCHEMA.map((row) => (
                  <tr
                    key={row.col}
                    style={{ borderBottom: "1px solid #f8fafc" }}
                  >
                    <td
                      style={{
                        padding: "10px 0",
                        fontFamily: "monospace",
                        color: "#6c3bfe",
                        fontWeight: 500,
                      }}
                    >
                      {row.col}
                    </td>
                    <td style={{ padding: "10px 0" }}>
                      <span
                        className="pill"
                        style={{
                          background: "#f1f5f9",
                          color: "#475569",
                          fontSize: "10px",
                        }}
                      >
                        {row.type}
                      </span>
                    </td>
                    <td style={{ padding: "10px 0", color: "#64748b" }}>
                      {row.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
