import { useState } from 'react';
import axios from 'axios';

export default function ImageUploader({ onUpload, folder = 'general', multiple = true, maxImages = Infinity }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('Your admin session has expired. Please log in again before uploading images.');
      return;
    }

    if (maxImages !== Infinity && files.length > maxImages) {
      alert(`Maximum ${maxImages} image(s) allowed`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const form = new FormData();
      files.forEach((f) => form.append('images', f));

      const { data } = await axios.post('/api/v1/upload/images', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      onUpload && onUpload(data);
    } catch (err) {
      console.error('Upload error', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('accessToken');
        alert('Upload failed because your session is no longer valid. Please log in again and retry.');
      } else {
        alert('Upload failed: ' + (err.response?.data?.message || err.message));
      }
      onUpload && onUpload([]);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="image-uploader">
      <label className="relative cursor-pointer">
        <input
          type="file"
          multiple={multiple && maxImages !== 1}
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
        <div className="w-full rounded-2xl border-2 border-dashed border-gray-300 px-5 py-4 text-center hover:border-gray-400 transition disabled:opacity-50">
          <span className="text-gray-600">
            {uploading ? `Uploading... ${uploadProgress}%` : `Click to upload ${maxImages === 1 ? 'image' : maxImages === Infinity ? 'images' : `up to ${maxImages} images`}`}
          </span>
        </div>
      </label>
    </div>
  );
}
