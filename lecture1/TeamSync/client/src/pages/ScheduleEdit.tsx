import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { scheduleApi, groupApi } from '../api';
import { Group, Schedule } from '../types';
import ScheduleForm from '../components/ScheduleForm';

function toDatetimeLocal(iso: string) {
  return iso ? iso.slice(0, 16) : '';
}

export default function ScheduleEdit() {
  const { id } = useParams<{ id: string }>();
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([scheduleApi.getAll(), groupApi.getAll()]).then(([schedRes, groupRes]) => {
      const found = schedRes.data.find((s: Schedule) => s.id === id);
      setSchedule(found ?? null);
      setGroups(groupRes.data);
    });
  }, [id]);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    isAllDay: boolean;
    groupIds: string[];
  }) => {
    if (!id) return;
    await scheduleApi.update(id, data);
    navigate('/dashboard');
  };

  if (!schedule) return <div className="p-8 text-gray-500">로딩 중...</div>;

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">일정 수정</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <ScheduleForm
          groups={groups}
          initial={{
            title: schedule.title,
            description: schedule.description ?? '',
            startDate: toDatetimeLocal(schedule.startDate),
            endDate: toDatetimeLocal(schedule.endDate),
            isAllDay: schedule.isAllDay,
            groupIds: schedule.groups.map((g) => g.group.id),
          }}
          onSubmit={handleSubmit}
          submitLabel="일정 저장"
        />
      </div>
    </div>
  );
}
