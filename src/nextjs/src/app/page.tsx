"use client";
import React, { useState, useRef } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }

  async function upload() {
    if (!file) return;
    try {
      const res = await fetch('/api/s3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: file.name })
      });
      if (!res.ok) {
        alert('Failed to obtain presigned URL');
        return;
      }
      const data = await res.json();
      const url = data?.url as string | undefined;
      if (!url) {
        alert('Invalid presigned URL');
        return;
      }
      const put = await fetch(url, { method: 'PUT', body: file });
      if (!put.ok) {
        alert('Upload failed');
        return;
      }
      setUploaded((u) => [file!.name, ...u]);
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      console.error(err);
      alert('Upload error');
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Upload File</h1>
      <input ref={inputRef} type="file" onChange={onFileChange} />
      <button onClick={upload} disabled={!file} style={{ marginLeft: 8 }}>
        Upload
      </button>
      <h2 style={{ marginTop: 20 }}>Uploaded files</h2>
      <ul>
        {uploaded.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
