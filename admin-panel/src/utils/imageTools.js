// Compresses a chosen photo in the browser before upload: scales it down to
// at most `maxDim` pixels and re-encodes as JPEG. Keeps stored images small
// (typically 50-300 KB instead of several MB), which matters because images
// are stored in the database and served by the API.
export async function compressImage(file, maxDim = 1400, quality = 0.85) {
  // Tiny files and animated GIFs are sent unchanged — re-encoding would
  // flatten transparency (PNG logos) or animation for no real gain.
  if (file.size <= 150 * 1024 || file.type === 'image/gif') return file;

  const img = await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const i = new Image();
    i.onload = () => { URL.revokeObjectURL(url); resolve(i); };
    i.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read image file')); };
    i.src = url;
  });

  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; // flatten any transparency onto white for JPEG
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
  if (!blob || blob.size >= file.size) return file; // compression didn't help
  return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
}
