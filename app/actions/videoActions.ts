'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function uploadVideo(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const file = formData.get('video') as File;
  if (!file) throw new Error('No file uploaded');

  const title = file.name;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Ensure upload directory exists
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
  await mkdir(uploadDir, { recursive: true });

  const fileName = `${uuidv4()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);
  const publicUrl = `/uploads/videos/${fileName}`;

  await writeFile(filePath, buffer);

  const video = await prisma.video.create({
    data: {
      title,
      url: publicUrl,
      userId: session.user.id,
    },
  });

  revalidatePath('/stream');
  return video;
}

export async function getVideos() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  return await prisma.video.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteVideo(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const video = await prisma.video.findUnique({
    where: { id },
  });

  if (!video || video.userId !== session.user.id) {
    throw new Error('Video not found or unauthorized');
  }

  // Delete physical file
  const filePath = path.join(process.cwd(), 'public', video.url);
  try {
    await unlink(filePath);
  } catch (error) {
    console.error('Failed to delete video file:', error);
  }

  await prisma.video.delete({
    where: { id },
  });

  revalidatePath('/stream');
}
