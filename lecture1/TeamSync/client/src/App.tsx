import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import GroupNew from './pages/GroupNew';
import GroupJoin from './pages/GroupJoin';
import GroupDetail from './pages/GroupDetail';
import ScheduleNew from './pages/ScheduleNew';
import ScheduleEdit from './pages/ScheduleEdit';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename="/my-first-website">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <><Navbar /><Dashboard /></>
              </PrivateRoute>
            }
          />
          <Route
            path="/groups"
            element={
              <PrivateRoute>
                <><Navbar /><Groups /></>
              </PrivateRoute>
            }
          />
          <Route
            path="/groups/new"
            element={
              <PrivateRoute>
                <><Navbar /><GroupNew /></>
              </PrivateRoute>
            }
          />
          <Route
            path="/groups/join"
            element={
              <PrivateRoute>
                <><Navbar /><GroupJoin /></>
              </PrivateRoute>
            }
          />
          <Route
            path="/groups/:id"
            element={
              <PrivateRoute>
                <><Navbar /><GroupDetail /></>
              </PrivateRoute>
            }
          />
          <Route
            path="/schedule/new"
            element={
              <PrivateRoute>
                <><Navbar /><ScheduleNew /></>
              </PrivateRoute>
            }
          />
          <Route
            path="/schedule/:id/edit"
            element={
              <PrivateRoute>
                <><Navbar /><ScheduleEdit /></>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
