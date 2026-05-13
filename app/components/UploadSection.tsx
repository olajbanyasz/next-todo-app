'use client';

import React from 'react';
import UploadVideo from './UploadVideo';
import { uploadVideo } from '@/app/actions/videoActions';

export default function UploadSection() {
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('video', file);
    await uploadVideo(formData);
  };

  return <UploadVideo onUpload={handleUpload} />;
}
