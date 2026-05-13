import imageCompression from 'browser-image-compression';

export async function compressImage(file, maxSizeMB = 0.5) {
  // Skip compression for non‑image files
  if (!file.type.startsWith('image/')) {
    return file;
  }

  const options = {
    maxSizeMB: maxSizeMB,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.warn('Image compression failed, using original file:', error);
    return file;
  }
}