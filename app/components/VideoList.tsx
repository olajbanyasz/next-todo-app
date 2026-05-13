'use client';

import React from 'react';
import { deleteVideo } from '@/app/actions/videoActions';
import { useLoading } from '@/app/contexts/LoadingProvider';
import { Trash2, Play, Calendar } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  url: string;
  createdAt: Date;
}

interface VideoListProps {
  videos: Video[];
}

const VideoList: React.FC<VideoListProps> = ({ videos }) => {
  const { show, hide } = useLoading();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    show();
    try {
      await deleteVideo(id);
    } catch (error) {
      console.error('Failed to delete video:', error);
      alert('Failed to delete video');
    } finally {
      hide();
    }
  };

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Play className="w-8 h-8 text-zinc-400" />
        </div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No videos yet</h3>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">Upload your first video above to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      {videos.map((video) => (
        <div 
          key={video.id} 
          className="group relative bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50"
        >
          <div className="aspect-video bg-black relative">
            <video 
              src={video.url} 
              className="w-full h-full object-contain" 
              controls
            />
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(video.id)}
                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                title="Delete video"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
