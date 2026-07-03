import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Save, Pin, PinOff } from 'lucide-react';
import { useThoughts } from '../hooks/useThoughts';
import { ImageUploader } from '../components/ImageUploader';
import './ThoughtForm.css';

export function ThoughtForm({ initialData, onSave, onCancel }) {
  const { presetTags } = useThoughts();
  const [content, setContent] = useState(initialData?.content || '');
  const [selectedTags, setSelectedTags] = useState(initialData?.tags || []);
  const [customTagInput, setCustomTagInput] = useState('');
  const [images, setImages] = useState(initialData?.images || []);
  const [pinned, setPinned] = useState(initialData?.pinned || false);
  const textareaRef = useRef(null);

  // 合并预设标签和当前选中标签（排除预设中已有的）
  const allAvailableTags = [...new Set([...presetTags, ...selectedTags])];

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
      autoResize(el);
    }
  }, []);

  const autoResize = (el) => {
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addCustomTag = () => {
    const tag = customTagInput.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
    setCustomTagInput('');
  };

  const handleCustomTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTag();
    }
  };

  const handleSave = useCallback(() => {
    if (!content.trim()) return;
    onSave({
      content: content.trim(),
      tags: selectedTags,
      images,
      pinned,
    });
  }, [content, selectedTags, images, pinned, onSave]);

  return (
    <div className="thought-form">
      <div className="form-header">
        <button className="form-back" onClick={onCancel}>
          <ArrowLeft size={20} />
        </button>
        <h2 className="form-title">
          {initialData ? '编辑念头' : '记录新念头'}
        </h2>
        <button
          className="form-save"
          onClick={handleSave}
          disabled={!content.trim()}
        >
          <Save size={18} />
          <span>保存</span>
        </button>
      </div>

      <div className="form-body">
        <textarea
          ref={textareaRef}
          className="form-textarea"
          placeholder="此刻，你的意识中浮现了什么？"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            autoResize(e.target);
          }}
          onKeyDown={handleKeyDown}
          rows={6}
        />

        <div className="form-meta">
          {/* 置顶开关 */}
          <div className="form-field">
            <button
              className={`pin-toggle ${pinned ? 'pin-active' : ''}`}
              onClick={() => setPinned(!pinned)}
              type="button"
            >
              {pinned ? (
                <>
                  <Pin size={16} className="pin-icon-filled" />
                  <span>已置顶 — 点击取消</span>
                </>
              ) : (
                <>
                  <PinOff size={16} />
                  <span>置顶此念头</span>
                </>
              )}
            </button>
          </div>

          {/* 标签选择 */}
          <div className="form-field">
            <label className="form-label">标签</label>
            {allAvailableTags.length > 0 && (
              <div className="tag-selector">
                {allAvailableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  const isPreset = presetTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={`tag-chip ${isSelected ? 'tag-chip-active' : ''} ${isPreset ? 'tag-chip-preset' : ''}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="custom-tag-input-wrap">
              <input
                type="text"
                className="form-tags-input"
                placeholder="输入自定义标签后按回车..."
                value={customTagInput}
                onChange={(e) => setCustomTagInput(e.target.value)}
                onKeyDown={handleCustomTagKeyDown}
              />
              <button
                type="button"
                className="custom-tag-add"
                onClick={addCustomTag}
                disabled={!customTagInput.trim()}
              >
                +添加
              </button>
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">图片</label>
            <ImageUploader images={images} onChange={setImages} />
          </div>
        </div>
      </div>

      <div className="form-hint">
        <kbd>Ctrl</kbd> + <kbd>Enter</kbd> 快速保存
      </div>
    </div>
  );
}
