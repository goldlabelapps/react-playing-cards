'use server';

import { revalidatePath } from 'next/cache';
import { saveScene } from '../lib/db';

export async function createSceneAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const prompt = (formData.get('prompt') as string)?.trim();
  const title = (formData.get('title') as string)?.trim() || prompt.slice(0, 32);
  const movie = (formData.get('movie') as string)?.trim() || 'logo';
  const speed = parseFloat((formData.get('speed') as string) || '1.0');

  if (!prompt) {
    return { success: false, error: 'Prompt is required' };
  }

  try {
    await saveScene({
      title,
      prompt,
      movie,
      speed: isNaN(speed) ? 1.0 : speed,
    });

    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
