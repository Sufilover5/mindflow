import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { groupByDate } from '../utils/dateUtils';

export function useThoughts() {
  const [thoughts, setThoughts] = useLocalStorage('mindflow_thoughts', []);
  const [presetTags, setPresetTags] = useLocalStorage('mindflow_presets', []);

  const addThought = useCallback(({ content, tags = [], images = [], pinned = false }) => {
    const now = new Date().toISOString();
    const thought = {
      id: crypto.randomUUID(),
      content,
      tags,
      images,
      pinned,
      createdAt: now,
      updatedAt: now,
    };
    setThoughts((prev) => [thought, ...prev]);
    return thought;
  }, [setThoughts]);

  const updateThought = useCallback((id, updates) => {
    setThoughts((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      )
    );
  }, [setThoughts]);

  const deleteThought = useCallback((id) => {
    setThoughts((prev) => prev.filter((t) => t.id !== id));
  }, [setThoughts]);

  const togglePin = useCallback((id) => {
    setThoughts((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, pinned: !t.pinned, updatedAt: new Date().toISOString() } : t
      )
    );
  }, [setThoughts]);

  const getThought = useCallback(
    (id) => thoughts.find((t) => t.id === id) || null,
    [thoughts]
  );

  // 所有标签（预设 + 实际使用）
  const allTags = useMemo(() => {
    const tagSet = new Set(presetTags);
    thoughts.forEach((t) => t.tags?.forEach((tag) => tagSet.add(tag)));
    return [...tagSet].sort((a, b) => a.localeCompare(b, 'zh'));
  }, [thoughts, presetTags]);

  // 按日期分组（降序），置顶的提到最前面
  const groupedByDate = useMemo(() => {
    const pinnedThoughts = thoughts.filter((t) => t.pinned);
    const normalThoughts = thoughts.filter((t) => !t.pinned);
    const groups = groupByDate(normalThoughts);

    if (pinnedThoughts.length > 0) {
      groups.unshift({
        dateKey: '__pinned__',
        dateDisplay: '📌 置顶念头',
        thoughts: pinnedThoughts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
        isPinnedGroup: true,
      });
    }

    return groups;
  }, [thoughts]);

  // 按标签筛选
  const getFilteredGrouped = useCallback(
    (activeTags) => {
      if (!activeTags || activeTags.length === 0) return groupedByDate;

      const pinnedThoughts = thoughts.filter(
        (t) => t.pinned && activeTags.some((tag) => t.tags?.includes(tag))
      );
      const normalThoughts = thoughts.filter(
        (t) => !t.pinned && activeTags.some((tag) => t.tags?.includes(tag))
      );
      const groups = groupByDate(normalThoughts);

      if (pinnedThoughts.length > 0) {
        groups.unshift({
          dateKey: '__pinned__',
          dateDisplay: '📌 置顶念头',
          thoughts: pinnedThoughts.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          ),
          isPinnedGroup: true,
        });
      }

      return groups;
    },
    [thoughts, groupedByDate]
  );

  // 预设标签管理
  const addPresetTag = useCallback((tag) => {
    const trimmed = tag.trim();
    if (!trimmed || presetTags.includes(trimmed)) return;
    setPresetTags((prev) => [...prev, trimmed].sort((a, b) => a.localeCompare(b, 'zh')));
  }, [presetTags, setPresetTags]);

  const removePresetTag = useCallback((tag) => {
    setPresetTags((prev) => prev.filter((t) => t !== tag));
  }, [setPresetTags]);

  return {
    thoughts,
    groupedByDate,
    allTags,
    presetTags,
    addThought,
    updateThought,
    deleteThought,
    togglePin,
    getThought,
    getFilteredGrouped,
    addPresetTag,
    removePresetTag,
  };
}
