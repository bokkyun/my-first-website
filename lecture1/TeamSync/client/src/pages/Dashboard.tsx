import { useEffect, useState, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { scheduleApi, groupApi } from '../api';
import { Schedule, Group } from '../types';
import ScheduleModal from '../components/ScheduleModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set(['all']));
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    const [schedRes, groupRes] = await Promise.all([
      scheduleApi.getAll(),
      groupApi.getAll(),
    ]);
    setSchedules(schedRes.data);
    setGroups(groupRes.data);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleGroup = (id: string) => {
    setSelectedGroupIds((prev) => {
      const next = new Set(prev);
      if (id === 'all') {
        return new Set(['all']);
      }
      next.delete('all');
      if (next.has(id)) {
        next.delete(id);
        if (next.size === 0) next.add('all');
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => setSelectedGroupIds(new Set(['all']));

  const filteredEvents = schedules
    .filter((s) => {
      if (selectedGroupIds.has('all')) return true;
      if (s.userId === user?.id && s.groups.length === 0) return true;
      return s.groups.some((g) => selectedGroupIds.has(g.group.id));
    })
    .map((s) => {
      const color = s.groups[0]?.group.color || '#6B7280';
      return {
        id: s.id,
        title: `${s.user.name}: ${s.title}`,
        start: s.startDate,
        end: s.endDate,
        allDay: s.isAllDay,
        backgroundColor: color,
        borderColor: color,
        extendedProps: { schedule: s },
      };
    });

  const handleEventClick = (info: EventClickArg) => {
    const schedule = info.event.extendedProps.schedule as Schedule;
    setSelectedSchedule(schedule);
  };

  const handleDateClick = (info: { dateStr: string }) => {
    navigate(`/schedule/new?date=${info.dateStr}`);
  };

  return (
    <div className="flex h-[calc(100vh-57px)]">
      {/* 사이드바 */}
      <aside className="w-56 bg-white border-r border-gray-200 p-4 flex flex-col gap-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          그룹 필터
        </h3>
        <label className="flex items-center gap-2 cursor-pointer py-1">
          <input
            type="checkbox"
            checked={selectedGroupIds.has('all')}
            onChange={selectAll}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-700 font-medium">전체 보기</span>
        </label>
        {groups.map((group) => (
          <label key={group.id} className="flex items-center gap-2 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={selectedGroupIds.has(group.id)}
              onChange={() => toggleGroup(group.id)}
              className="w-4 h-4"
            />
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: group.color }}
            />
            <span className="text-sm text-gray-700 truncate">{group.name}</span>
          </label>
        ))}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={() => navigate('/schedule/new')}
            className="w-full text-sm bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            + 일정 추가
          </button>
        </div>
      </aside>

      {/* 달력 */}
      <main className="flex-1 p-4 overflow-auto">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="ko"
          events={filteredEvents}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth',
          }}
          height="100%"
          eventDisplay="block"
          dayMaxEvents={3}
        />
      </main>

      {selectedSchedule && (
        <ScheduleModal
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
          onDeleted={fetchData}
        />
      )}
    </div>
  );
}
