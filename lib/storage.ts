// @ts-nocheck
import { supabase } from './supabase';

export async function uploadProfileImage(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/profile.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('profile-images')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('profile-images')
    .getPublicUrl(filePath);

  // Update user profile with new image URL
  const { error: updateError } = await (supabase
    .from('users')
    .update({ avatar_url: publicUrl } as any) as any)
    .eq('id', userId);

  if (updateError) throw updateError;

  return publicUrl;
}

export function getPublicUrl(bucket: string, path: string) {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  return publicUrl;
}

export async function uploadReport(fileName: string, content: Blob) {
  const { data, error } = await supabase.storage
    .from('security-reports')
    .upload(fileName, content);
  
  if (error) throw error;
  return data;
}
