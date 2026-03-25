import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) navigate('/dashboard');
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-blue-600 mb-4">TeamSync</h1>
        <p className="text-xl text-gray-600 mb-2">
          그룹과 함께 스케줄을 공유하세요
        </p>
        <p className="text-gray-500 mb-10">
          팀원들의 일정을 한 눈에 확인하고, 원하는 그룹에만 공개할 수 있습니다.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 text-lg"
          >
            시작하기
          </Link>
          <Link
            to="/login"
            className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 text-lg"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
