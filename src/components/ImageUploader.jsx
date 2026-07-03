import { useRef, useCallback } from 'react';
import { ImagePlus, X, Upload } from 'lucide-react';
import { compressImage, getImageFromClipboard } from '../utils/imageUtils';
import './ImageUploader.css';

export function ImageUploader({ images, onChange }) {
  const inputRef = useRef(null);

  const handleFiles = useCallback(async (files) => {
    const newImages = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      try {
        const compressed = await compressImage(file);
        newImages.push({
          id: crypto.randomUUID(),
          ...compressed,
        });
      } catch {
        // 跳过无法处理的图片
      }
    }
    if (newImages.length > 0) {
      onChange([...images, ...newImages]);
    }
  }, [images, onChange]);

  const handleFileSelect = (e) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handlePaste = useCallback(async (e) => {
    const file = await getImageFromClipboard();
    if (file) handleFiles([file]);
  }, [handleFiles]);

  const removeImage = (id) => {
    onChange(images.filter((img) => img.id !== id));
  };

  return (
    <div className="image-uploader">
      {images.length > 0 && (
        <div className="image-previews">
          {images.map((img) => (
            <div key={img.id} className="image-preview-item">
              <img src={img.data} alt={img.name} />
              <button className="image-remove" onClick={() => removeImage(img.id)}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className="image-dropzone"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onPaste={handlePaste}
        tabIndex={0}
      >
        <Upload size={18} />
        <span>点击上传、拖拽图片或 Ctrl+V 粘贴</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="image-input-hidden"
        />
      </div>
    </div>
  );
}
