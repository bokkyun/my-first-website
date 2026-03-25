import { useState } from 'react';
import { Group } from '../types';

interface FormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  isAllDay: boolean;
  groupIds: string[];
}

interface Props {
  groups: Group[];
  initial?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  submitLabel: string;
}

export default function ScheduleForm({ groups, initial, onSubmit, submitLabel }: Props) {
  const [form, setForm] = useState<FormData>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    startDate: initial?.startDate ?? '',
    endDate: initial?.endDate ?? '',
    isAllDay: initial?.isAllDay ?? false,
    groupIds: initial?.groupIds ?? [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleGroup = (id: string) => {
    setForm((f) => ({
      ...f,
      groupIds: f.groupIds.includes(id)
        ? f.groupIds.filter((g) => g !== id)
        : [...f.groupIds, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.startDate || !form.endDate) {
      setError('제목, 시작일, 종료일은 필수입니다.');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '오류가 발생했습니다.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="일정 제목"
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isAllDay"
          checked={form.isAllDay}
          onChange={(e) => setForm((f) => ({ ...f, isAllDay: e.target.checked }))}
          className="w-4 h-4"
        />
        <label htmlFor="isAllDay" className="text-sm text-gray-700">하루 종일</label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">시작일 *</label>
          <input
            type={form.isAllDay ? 'date' : 'datetime-local'}
            value={form.startDate}
            onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">종료일 *</label>
          <input
            type={form.isAllDay ? 'date' : 'datetime-local'}
            value={form.endDate}
            onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">메모</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          placeholder="메모를 입력하세요 (선택)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">공개 그룹 선택</label>
        {groups.length === 0 ? (
          <p className="text-sm text-gray-400">가입한 그룹이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {groups.map((group) => (
              <label key={group.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.groupIds.includes(group.id)}
                  onChange={() => toggleGroup(group.id)}
                  className="w-4 h-4"
                />
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <span className="text-sm text-gray-700">{group.name}</span>
              </label>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-2">
          선택하지 않으면 나만 볼 수 있는 비공개 일정입니다.
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
      >
        {loading ? '저장 중...' : submitLabel}
      </button>
    </form>
  );
}
