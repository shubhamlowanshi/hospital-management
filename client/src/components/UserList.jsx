import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const UserList = ({ userRole }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [userRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let data;
      if (userRole === 'doctor') {
        data = await userAPI.getPatients();
        setUsers(data.patients || []);
      } else {
        data = await userAPI.getDoctors();
        setUsers(data.doctors || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const title = userRole === 'doctor' ? 'Registered Patients' : 'Available Doctors';
  const targetRole = userRole === 'doctor' ? 'patient' : 'doctor';

  const getBadgeStyle = (role) =>
    role === 'doctor'
      ? 'bg-indigo-100 text-indigo-700'
      : 'bg-emerald-100 text-emerald-700';

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center gap-3 text-gray-600">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600" />
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 text-sm font-medium">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Total {users.length} {targetRole}
            {users.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Empty State */}
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No {targetRole}s found
          </h3>
          <p className="text-gray-500 text-sm">
            There are no registered {targetRole}s in the system yet.
          </p>
        </div>
      ) : (
        /* Cards */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <div
              key={user._id}
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-xl">
                  {user.role === 'doctor' ? '👨‍⚕️' : '👤'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {user.role === 'doctor' ? 'Dr. ' : ''}
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">{user.phone}</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getBadgeStyle(
                    user.role
                  )}`}
                >
                  {user.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;
