import { Schedule } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { scheduleApi } from '../api';

interface Props {
  schedule: Schedule;
  onClose: () => void;
  onDeleted: () => void;
}

export default function ScheduleModal({ schedule, onClose, onDeleted }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwner = user?.id === schedule.userId;

  const handleDelete = async () => {
    if (!confirm('이 일정을 삭제하시겠습니까?')) return;
    await scheduleApi.delete(schedule.id);
    onDeleted();
    onClose();
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

  const firstGroup = schedule.groups[0]?.group;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {firstGroup && (
              <div
                className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                style={{ backgroundColor: firstGroup.color }}
              />
            )}
            <h2 className="text-xl font-bold text-gray-900">{schedule.title}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ×
          </button>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <div>
            <span className="font-medium text-gray-700">작성자:</span>{' '}
            {schedule.user.name}
          </div>
          <div>
            <span className="font-medium text-gray-700">기간:</span>{' '}
            {formatDate(schedule.startDate)} ~ {formatDate(schedule.endDate)}
          </div>
          {schedule.isAllDay && (
            <div className="text-blue-600 font-medium">하루 종일</div>
          )}
          {schedule.description && (
            <div>
              <span className="font-medium text-gray-700">메모:</span>{' '}
              {schedule.description}
            </div>
          )}
          {schedule.groups.length > 0 && (
            <div>
              <span className="font-medium text-gray-700">공개 그룹:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {schedule.groups.map(({ group }) => (
                  <span
                    key={group.id}
                    className="px-2 py-0.5 rounded-full text-white text-xs"
                    style={{ backgroundColor: group.color }}
                  >
                    {group.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {isOwner && (
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => navigate(`/schedule/${schedule.id}/edit`)}
              className="flex-1 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
