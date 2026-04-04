'use client';

import { useState } from 'react';
import { uploadFile, uploadPublicFile } from '@/utils/adminApi';

export default function ImageUploadInput({ label, value, onChange, token, isPublic = false }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const data = isPublic 
        ? await uploadPublicFile(file)
        : await uploadFile(token, file);
      if (data.url) {
        onChange(data.url);
      } else {
        throw new Error('Upload failed - did not receive URL');
      }
    } catch (err) {
      setUploadError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
      // clear the file input
      e.target.value = '';
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Visual Feedback of current value */}
      {value ? (
        <div className="mb-3 relative group w-32 h-32 rounded-md overflow-hidden border border-gray-300 bg-gray-100 flex flex-col justify-center items-center">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="mb-3 flex items-center gap-3">
          <span className="text-gray-500 italic text-sm">No image selected</span>
        </div>
      )}

      {/* File Input */}
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading || (!token && !isPublic)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 text-sm"
        />
        {isUploading && (
          <div className="absolute inset-y-0 right-4 flex items-center text-blue-600 text-sm font-medium">
            Uploading...
          </div>
        )}
      </div>

      {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
    </div>
  );
}
