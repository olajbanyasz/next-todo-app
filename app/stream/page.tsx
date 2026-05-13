import React from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UploadSection from '@/app/components/UploadSection';
import VideoList from '@/app/components/VideoList';
import { getVideos } from '@/app/actions/videoActions';
import { Video, Play } from 'lucide-react';

export default async function StreamPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const videos = await getVideos();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <Video className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white mb-4">
            Video <span className="text-blue-600 dark:text-blue-400">Stream</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
            Upload and manage your personal video collection. Watch them anytime, anywhere.
          </p>
        </header>

        <section className="mb-16">
          <UploadSection />
        </section>

        <section>
          <div className="flex items-center justify-between mb-8 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Your Collection</h2>
            </div>
            <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {videos.length} {videos.length === 1 ? 'Video' : 'Videos'}
            </span>
          </div>
          
          <VideoList videos={videos} />
        </section>
      </div>
    </div>
  );
}
