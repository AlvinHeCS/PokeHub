"use client";

import { useState } from "react";

import { I, Icon } from "~/app/_components/editorial/placeholders";
import { api } from "~/trpc/react";

export function ImageUploader({
  value,
  onChange,
  prefix,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  prefix: "graded" | "sealed";
}) {
  const presign = api.upload.presign.useMutation();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const { uploadUrl, publicUrl } = await presign.mutateAsync({
        contentType: file.type,
        prefix,
      });
      const res = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      onChange(publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (value) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: 14,
          background: "var(--paper)",
          border: "1px solid var(--line)",
          borderRadius: 6,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={value}
          alt="Uploaded"
          style={{
            height: 100,
            width: "auto",
            objectFit: "contain",
            background: "var(--bg-alt)",
            borderRadius: 4,
            padding: 6,
          }}
        />
        <button
          type="button"
          onClick={() => onChange(null)}
          style={{
            background: "transparent",
            border: 0,
            color: "var(--danger)",
            fontSize: 12,
            cursor: "pointer",
            padding: 0,
            textDecoration: "underline",
          }}
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <label
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: 28,
          background: "var(--bg-alt)",
          border: "1.5px dashed var(--line)",
          borderRadius: 6,
          color: "var(--ink-mute)",
          cursor: uploading ? "wait" : "pointer",
          fontSize: 13,
        }}
      >
        <Icon d={I.plus} size={22} />
        {uploading ? "Uploading…" : "Click to upload a photo"}
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
          style={{ display: "none" }}
        />
      </label>
      {error ? (
        <div
          role="alert"
          style={{
            marginTop: 8,
            fontSize: 12,
            color: "var(--danger)",
          }}
        >
          {error}
        </div>
      ) : null}
    </div>
  );
}
