import { format, parseISO, isToday, isYesterday } from 'date-fns';
import { zhCN } from 'date-fns/locale';

/**
 * 格式化日期为友好的中文展示
 */
export function formatDateDisplay(dateStr) {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;

  if (isToday(date)) return '今天';
  if (isYesterday(date)) return '昨天';

  return format(date, 'yyyy年M月d日 EEEE', { locale: zhCN });
}

/**
 * 格式化为简短日期（用于分组 key）
 */
export function formatDateKey(dateStr) {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'yyyy-MM-dd');
}

/**
 * 格式化时间
 */
export function formatTime(dateStr) {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'HH:mm');
}

/**
 * 格式化完整日期时间
 */
export function formatDateTime(dateStr) {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return format(date, 'yyyy年M月d日 HH:mm', { locale: zhCN });
}

/**
 * 按日期分组念头，返回有序的日期分组
 */
export function groupByDate(thoughts) {
  const groups = {};

  // 按创建时间降序排列
  const sorted = [...thoughts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  sorted.forEach((thought) => {
    const key = formatDateKey(thought.createdAt);
    if (!groups[key]) {
      groups[key] = {
        dateKey: key,
        dateDisplay: formatDateDisplay(thought.createdAt),
        thoughts: [],
      };
    }
    groups[key].thoughts.push(thought);
  });

  // 按日期降序返回
  return Object.values(groups).sort(
    (a, b) => b.dateKey.localeCompare(a.dateKey)
  );
}
