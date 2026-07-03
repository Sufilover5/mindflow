/**
 * 压缩图片（限制最长边和品质）
 */
export function compressImage(file, maxWidth = 1200, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // 按比例缩放
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL(file.type || 'image/jpeg', quality);
        resolve({
          data: dataUrl,
          name: file.name,
          size: Math.round((dataUrl.length * 3) / 4), // 估算字节数
        });
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * 从剪贴板获取图片
 */
export async function getImageFromClipboard() {
  const items = navigator.clipboard?.read;
  if (!items) return null;

  try {
    const clipboardItems = await items();
    for (const item of clipboardItems) {
      for (const type of item.types) {
        if (type.startsWith('image/')) {
          const blob = await item.getType(type);
          return new File([blob], `clipboard-${Date.now()}.png`, { type });
        }
      }
    }
  } catch {
    return null;
  }
  return null;
}
