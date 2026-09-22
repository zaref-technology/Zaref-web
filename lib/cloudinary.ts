/**
 * Uploads a single file to Cloudinary using the unsigned upload preset.
 * Returns the secure URL of the uploaded image.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary environment variables are not configured.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message ?? 'Cloudinary upload failed');
  }

  return data.secure_url as string;
}

/**
 * Uploads multiple files concurrently.
 * Returns an array of secure URLs in the same order as the input files.
 */
export async function uploadMultipleToCloudinary(
  files: File[],
  onProgress?: (uploaded: number, total: number) => void
): Promise<string[]> {
  const urls: string[] = [];
  let uploaded = 0;

  // Upload concurrently in batches of 3 to avoid overwhelming the API
  const batchSize = 3;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const batchUrls = await Promise.all(batch.map(f => uploadToCloudinary(f)));
    urls.push(...batchUrls);
    uploaded += batch.length;
    onProgress?.(uploaded, files.length);
  }

  return urls;
}
