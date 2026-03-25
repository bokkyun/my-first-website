import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { scheduleApi, groupApi } from '../api';
import { Group } from '../types';
import ScheduleForm from '../components/ScheduleForm';

export default function ScheduleNew() {
  const [groups, setGroups] = useState<Group[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date') ?? '';

  useEffect(() => {
    groupApi.getAll().then((res) => setGroups(res.data));
  }, []);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    isAllDay: boolean;
    groupIds: string[];
  }) => {
    await scheduleApi.create(data);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">새 일정 추가</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <ScheduleForm
          groups={groups}
          initial={{ startDate: dateParam, endDate: dateParam }}
          onSubmit={handleSubmit}
          submitLabel="일정 추가"
        />
      </div>
    </div>
  );
}
