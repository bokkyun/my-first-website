import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { groupApi } from '../api';
import { Group, GroupMember } from '../types';
import { useAuth } from '../contexts/AuthContext';

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    groupApi.getOne(id).then((res) => {
      setGroup(res.data);
      setLoading(false);
    });
  }, [id]);

  const copyInviteCode = () => {
    if (!group) return;
    navigator.clipboard.writeText(group.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = async () => {
    if (!id || !confirm('그룹에서 탈퇴하시겠습니까?')) return;
    await groupApi.leave(id);
    navigate('/groups');
  };

  if (loading) return <div className="p-8 text-gray-500">로딩 중...</div>;
  if (!group) return <div className="p-8 text-gray-500">그룹을 찾을 수 없습니다.</div>;

  const myRole = group.members?.find((m) => m.userId === user?.id)?.role;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="flex items-center gap-4 mb-6">
        <div
          className="w-14 h-14 rounded-2xl"
          style={{ backgroundColor: group.color }}
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
          {group.description && (
            <p className="text-gray-500 text-sm mt-1">{group.description}</p>
          )}
        </div>
      </div>

      {/* 초대 코드 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">초대 코드</h2>
        <div className="flex items-center gap-3">
          <code className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm font-mono text-gray-700 break-all">
            {group.inviteCode}
          </code>
          <button
            onClick={copyInviteCode}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm whitespace-nowrap"
          >
            {copied ? '복사됨!' : '복사'}
          </button>
        </div>
      </div>

      {/* 멤버 목록 */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          멤버 ({group.members?.length ?? 0}명)
        </h2>
        <div className="space-y-3">
          {group.members?.map((member: GroupMember) => (
            <div key={member.id} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                {member.user?.name?.[0]}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{member.user?.name}</p>
                <p className="text-xs text-gray-400">{member.user?.email}</p>
              </div>
              {member.role === 'owner' && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  오너
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 탈퇴 버튼 */}
      {myRole === 'member' && (
        <button
          onClick={handleLeave}
          className="w-full py-2.5 border border-red-300 text-red-500 rounded-xl hover:bg-red-50 text-sm"
        >
          그룹 탈퇴
        </button>
      )}
    </div>
  );
}
