"use client";
import React, { useState, useRef } from 'react';

export default function Home() {
  const providers = ["Cloudflare R2", "AWS S3", "Minio", "Digital Ocean"];
  const [provider, setProvider] = useState<string>(providers[0]);

  const [file, setFile] = useState<File | null>(null);
  type UploadedItem = {
    name: string;
    fileUrl?: string;
    presignedUrl?: string;
    contentType?: string;
    size?: number;
  };
  const [uploaded, setUploaded] = useState<UploadedItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  }

  // map endpoints (currently same, but ready to customize per provider)
  const endpointMap: Record<string, string> = {
    "Cloudflare R2": 'http://localhost:4001/api/bucketmate/create-presigned-url',
    "AWS S3": 'http://localhost:4001/api/bucketmate-s3/create-presigned-url',
    "Minio": 'http://localhost:4001/api/bucketmate-minio/create-presigned-url',
    "Digital Ocean": 'http://localhost:4001/api/bucketmate-do/create-presigned-url',
  };

  async function upload() {
    if (!file) return;
    try {
      const endpoint = endpointMap[provider] ?? 'http://localhost:4001/api/bucketmate/create-presigned-url';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: file.name, provider })
      });
      if (!res.ok) {
        alert('Failed to obtain presigned URL');
        return;
      }
      const data = await res.json();
      const presignedUrl = (data?.presignedUrl ?? data?.url) as string | undefined;
      const fileUrl = (data?.fileUrl ?? data?.fileUrl) as string | undefined;
      const name = (data?.name ?? file.name) as string;
      const contentType = (data?.contentType ?? 'application/octet-stream') as string;
      const size = (data?.size ?? 0) as number;
      if (!presignedUrl) {
        alert('Invalid presigned URL');
        return;
      }
      const put = await fetch(presignedUrl, { method: 'PUT', body: file });
      if (!put.ok) {
        console.log(put)
        alert('Upload failed');
        return;
      }
      setUploaded((u) => [{ name, fileUrl, presignedUrl, contentType, size }, ...u]);
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      console.error(err);
      alert('Upload error');
    }
  }

  async function deleteItem(name: string) {
    // call API to delete by key; not strictly required to display now
    try {
      const res = await fetch('http://localhost:4001/api/bucketmate/delete-object', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: name })
      });
      if (res.ok) {
        setUploaded((u) => u.filter((it) => it.name !== name));
      } else {
        console.warn('Delete request failed');
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='w-full max-w-md p-6 bg-white rounded-md shadow-md'>
        <h1 className='text-2xl font-semibold text-gray-800 mb-3'>Upload File</h1>

        <div className='mb-4' aria-label='Storage provider' role='group'>
          <div className='flex gap-1 bg-gray-100 rounded-md p-1 mb-2' aria-label='Provider options'>
            {providers.map((p) => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                className={`px-3 py-2 rounded-md text-sm font-medium
                  ${provider === p ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                aria-pressed={provider === p}
              >
                {p}
              </button>
            ))}
          </div>
          <div className='text-sm text-gray-600'>Selected: {provider}</div>
        </div>

        <div className='mb-4'>
          <input
            ref={inputRef}
            type='file'
            onChange={onFileChange}
            className='block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          />
        </div>

        <div className='flex items-center gap-2 mb-4'>
          <button
            onClick={upload}
            disabled={!file}
            className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Upload
          </button>
          {file && (
            <span className='text-sm text-gray-600 truncate' style={{ maxWidth: '60%' }}>
              {file.name}
            </span>
          )}
        </div>

        <h2 className='text-lg font-medium text-gray-700 mb-2'>Uploaded files</h2>
        <ul className='space-y-2'>
          {uploaded.map((it) => (
            <li key={it.name} className='bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 flex items-center'>
              {it.fileUrl && it.contentType?.startsWith('image/') ? (
                <img src={it.fileUrl} alt={it.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, marginRight: 8 }} />
              ) : (
                <span className='w-8 h-6 inline-block bg-gray-200 rounded mr-2' />
              )}
              <span className='flex-1'>{it.name}</span>
              <button
                onClick={() => deleteItem(it.name)}
                className='text-red-600 hover:underline ml-2'
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
