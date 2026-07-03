import { useState, useRef } from 'react';
import { ArrowLeft, Download, Upload, Trash2, HardDrive, Tag, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useThoughts } from '../hooks/useThoughts';
import { exportData, importData, getStorageUsage } from '../utils/storage';
import { ConfirmDialog } from '../components/ConfirmDialog';
import './SettingsPage.css';

export function SettingsPage() {
  const navigate = useNavigate();
  const { thoughts, presetTags, addPresetTag, removePresetTag } = useThoughts();
  const fileInputRef = useRef(null);
  const [showClear, setShowClear] = useState(false);
  const [message, setMessage] = useState(null);
  const [newPresetTag, setNewPresetTag] = useState('');
  const storage = getStorageUsage();

  const handleExport = () => {
    const data = { version: 1, exportedAt: new Date().toISOString(), thoughts, presetTags };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setMessage({ type: 'success', text: '数据已导出' });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importData(file);
      const existingIds = new Set(thoughts.map((t) => t.id));
      const newThoughts = data.thoughts.filter((t) => !existingIds.has(t.id));
      const merged = [...thoughts, ...newThoughts];
      localStorage.setItem('mindflow_thoughts', JSON.stringify(merged));
      if (data.presetTags?.length) {
        const mergedPresets = [...new Set([...presetTags, ...data.presetTags])];
        localStorage.setItem('mindflow_presets', JSON.stringify(mergedPresets));
      }
      setMessage({ type: 'success', text: `导入成功！新增 ${newThoughts.length} 条记录` });
      window.location.reload();
    } catch (err) {
      setMessage({ type: 'error', text: `导入失败：${err.message}` });
    }
    e.target.value = '';
    setTimeout(() => setMessage(null), 3000);
  };

  const handleClearAll = () => {
    localStorage.removeItem('mindflow_thoughts');
    localStorage.removeItem('mindflow_presets');
    setShowClear(false);
    window.location.reload();
  };

  const handleAddPreset = () => {
    const tag = newPresetTag.trim();
    if (!tag) return;
    addPresetTag(tag);
    setNewPresetTag('');
  };

  const handlePresetKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPreset();
    }
  };

  return (
    <div className="settings-page container">
      <div className="settings-header">
        <button className="form-back" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
        </button>
        <h2 className="settings-title">设置</h2>
      </div>

      {message && (
        <div className={`settings-message settings-message-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* 预设标签管理 */}
      <div className="settings-section">
        <h3 className="section-title">预设标签</h3>
        <div className="settings-card">
          <div className="settings-preset-list">
            {presetTags.length === 0 && (
              <p className="preset-empty">暂无预设标签，添加一些常用标签方便快速选择</p>
            )}
            {presetTags.map((tag) => (
              <div key={tag} className="preset-tag-item">
                <Tag size={14} />
                <span>{tag}</span>
                <button
                  className="preset-tag-remove"
                  onClick={() => removePresetTag(tag)}
                  title="删除此预设标签"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          <div className="preset-add-row">
            <input
              type="text"
              className="preset-add-input"
              placeholder="输入新预设标签..."
              value={newPresetTag}
              onChange={(e) => setNewPresetTag(e.target.value)}
              onKeyDown={handlePresetKeyDown}
            />
            <button
              className="preset-add-btn"
              onClick={handleAddPreset}
              disabled={!newPresetTag.trim()}
            >
              <Plus size={16} />
              <span>添加</span>
            </button>
          </div>
        </div>
      </div>

      {/* 数据管理 */}
      <div className="settings-section">
        <h3 className="section-title">数据管理</h3>

        <div className="settings-card">
          <div className="settings-row">
            <div className="settings-row-icon">
              <Download size={20} />
            </div>
            <div className="settings-row-text">
              <div className="settings-row-title">导出数据</div>
              <div className="settings-row-desc">将所有念头和设置导出为 JSON 文件备份</div>
            </div>
            <button className="settings-btn" onClick={handleExport}>
              导出
            </button>
          </div>

          <div className="settings-row">
            <div className="settings-row-icon">
              <Upload size={20} />
            </div>
            <div className="settings-row-text">
              <div className="settings-row-title">导入数据</div>
              <div className="settings-row-desc">从之前导出的 JSON 文件恢复数据</div>
            </div>
            <button className="settings-btn" onClick={() => fileInputRef.current?.click()}>
              导入
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              style={{ display: 'none' }}
            />
          </div>

          <div className="settings-row">
            <div className="settings-row-icon">
              <HardDrive size={20} />
            </div>
            <div className="settings-row-text">
              <div className="settings-row-title">存储使用</div>
              <div className="settings-row-desc">
                已用 {storage.usedMB} MB / 约 5 MB（{thoughts.length} 条记录）
              </div>
            </div>
            <div className="storage-bar-wrap">
              <div className="storage-bar">
                <div
                  className="storage-bar-fill"
                  style={{ width: `${Math.min((storage.used / storage.limit) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title section-title-danger">危险操作</h3>

        <div className="settings-card">
          <div className="settings-row">
            <div className="settings-row-icon" style={{ color: 'var(--spark-rose)' }}>
              <Trash2 size={20} />
            </div>
            <div className="settings-row-text">
              <div className="settings-row-title">清空所有数据</div>
              <div className="settings-row-desc">删除所有念头记录和预设标签，此操作不可恢复</div>
            </div>
            <button
              className="settings-btn settings-btn-danger"
              onClick={() => setShowClear(true)}
            >
              清空
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showClear}
        title="清空所有数据？"
        message="这将永久删除所有念头记录和预设标签。建议先导出一份备份。确定要继续吗？"
        confirmLabel="确认清空"
        danger
        onConfirm={handleClearAll}
        onCancel={() => setShowClear(false)}
      />
    </div>
  );
}
