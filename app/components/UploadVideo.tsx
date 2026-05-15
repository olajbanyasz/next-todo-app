'use client';

import type {
  FileUploadHandlerEvent,
  FileUploadHeaderTemplateOptions,
  FileUploadSelectEvent,
} from 'primereact/fileupload';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import React, { useRef, useState } from 'react';

import { useLoading } from '@/app/contexts/LoadingProvider';

interface UploadVideoProps {
  onUpload: (
    file: File,
    onProgress?: (percent: number) => void,
  ) => Promise<void> | void;
}

const UploadVideo: React.FC<UploadVideoProps> = ({ onUpload }) => {
  const { show, hide } = useLoading();
  const [progress, setProgress] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  const fileUploadRef = useRef<FileUpload>(null);

  const customUpload = async (event: FileUploadHandlerEvent) => {
    if (!event.files || event.files.length === 0) return;
    const file = event.files[0] as File;

    show();
    setProgress(0);

    try {
      await onUpload(file, (percent: number) => {
        setProgress(percent);
      });
      event.options.clear();
      setFileSize(0);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      hide();
      setProgress(0);
    }
  };

  const onSelect = (event: FileUploadSelectEvent) => {
    const file = event.files?.[0];
    if (file) {
      setFileSize(file.size);
      setProgress(0);
    }
  };

  const onClear = () => {
    setFileSize(0);
    setProgress(0);
  };

  const chooseOptions = {
    icon: 'pi pi-fw pi-images',
    iconOnly: true,
    className: 'custom-choose-btn p-button-rounded p-button-outlined',
  };

  const uploadOptions = {
    icon: 'pi pi-fw pi-cloud-upload',
    iconOnly: true,
    className: `custom-upload-btn ${
      !fileSize ? 'p-button-secondary' : 'p-button-success'
    } p-button-rounded p-button-outlined`,
  };

  const cancelOptions = {
    icon: 'pi pi-fw pi-times',
    iconOnly: true,
    className: `custom-cancel-btn ${
      !fileSize ? 'p-button-secondary' : 'p-button-danger'
    } p-button-rounded p-button-outlined`,
  };

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
    const className = options.className;
    const chooseButton = options.chooseButton as React.ReactNode;
    const uploadButton = options.uploadButton as React.ReactNode;
    const cancelButton = options.cancelButton as React.ReactNode;
    const formattedValue = fileUploadRef.current?.formatSize(fileSize) ?? '0 B';

    return (
      <div
        className={className}
        style={{
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div className="flex gap-2">
          {chooseButton} {uploadButton} {cancelButton}
        </div>

        <div className="text-zinc-500 font-bold hidden md:block">Upload Video</div>

        <div className="flex align-items-center gap-3 ml-auto">
          <div style={{ textAlign: 'center' }}>{formattedValue}</div>
          <ProgressBar
            value={progress}
            showValue={false}
            style={{ width: '10rem', height: '12px' }}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-zinc-900 w-full max-w-3xl mx-auto"
    >
      <FileUpload
        ref={fileUploadRef}
        name="video"
        customUpload
        uploadHandler={(e) => void customUpload(e)}
        accept="video/*"
        maxFileSize={100 * 1024 * 1024}
        chooseOptions={chooseOptions}
        uploadOptions={uploadOptions}
        cancelOptions={cancelOptions}
        headerTemplate={headerTemplate}
        emptyTemplate={
          <div className="flex flex-col items-center justify-center py-4 text-zinc-400">
            <i className="pi pi-video text-2xl mb-1"></i>
            <p className="m-0 text-sm">No video selected. Drag and drop here or browse.</p>
          </div>
        }
        onSelect={onSelect}
        onClear={onClear}
      />
    </div>
  );
};

export default UploadVideo;
