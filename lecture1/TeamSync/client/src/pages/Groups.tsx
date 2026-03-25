import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { groupApi } from '../api';
import { Group } from '../types';

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    groupApi.getAll().then((res) => {
      setGroups(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8 text-gray-500">로딩 중...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">내 그룹</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/groups/join')}
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm"
          >
            그룹 참여
          </button>
          <button
            onClick={() => navigate('/groups/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            + 그룹 생성
          </button>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-4">아직 가입한 그룹이 없습니다.</p>
          <p className="text-sm">그룹을 생성하거나 초대 코드로 참여해보세요.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {groups.map((group) => (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex items-center gap-4"
            >
              <div
                className="w-12 h-12 rounded-xl flex-shrink-0"
                style={{ backgroundColor: group.color }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{group.name}</h3>
                {group.description && (
                  <p className="text-sm text-gray-500 truncate">{group.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  멤버 {group._count?.members ?? 0}명
                </p>
              </div>
              <span className="text-gray-400">›</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
