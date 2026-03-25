import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authApi.logout();
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <Link to="/dashboard" className="text-xl font-bold text-blue-600">
        TeamSync
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="text-sm text-gray-600 hover:text-blue-600">
          달력
        </Link>
        <Link to="/groups" className="text-sm text-gray-600 hover:text-blue-600">
          그룹
        </Link>
        <Link to="/schedule/new" className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">
          + 일정 추가
        </Link>
        <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-500"
        >
          로그아웃
        </button>
      </div>
    </nav>
  );
}
