"use client";

import { useState } from "react";

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

  return (
    <div>
      {value ? (
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded" className="h-32 rounded border" />
          <button
            type="button"
            className="text-sm text-red-600 underline"
            onClick={() => onChange(null)}
          >
            Remove
          </button>
        </div>
      ) : (
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
        />
      )}
      {uploading ? (
        <div className="mt-1 text-sm text-gray-500">Uploading…</div>
      ) : null}
      {error ? <div className="mt-1 text-sm text-red-600">{error}</div> : null}
    </div>
  );
}
