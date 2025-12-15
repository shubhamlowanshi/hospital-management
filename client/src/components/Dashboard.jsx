import { useState, useEffect } from 'react';
import { appointmentAPI } from '../services/api';
import AppointmentList from './AppointmentList';
import BookAppointment from './BookAppointment';
import UserList from './UserList';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await appointmentAPI.getAppointments();
      setAppointments(data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const tabs = [
    { id: 'appointments', label: 'Appointments', icon: '📅' },
    ...(user.role === 'patient'
      ? [{ id: 'book', label: 'Book', icon: '➕' }]
      : []),
    { id: 'users', label: user.role === 'doctor' ? 'Patients' : 'Doctors', icon: '👥' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-indigo-600 tracking-tight">
              🏥 DR Appointment System
            </h1>

            <div className="flex items-center gap-4">
              <div className="text-sm text-right">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">
                  {user.role}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="rounded-xl bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 text-sm font-semibold transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="inline-flex bg-white rounded-2xl shadow border p-1 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition
                  ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {activeTab === 'appointments' && (
            <AppointmentList
              appointments={appointments}
              user={user}
              onAppointmentUpdate={fetchAppointments}
              loading={loading}
            />
          )}

          {activeTab === 'book' && user.role === 'patient' && (
            <BookAppointment onAppointmentBooked={fetchAppointments} />
          )}

          {activeTab === 'users' && <UserList userRole={user.role} />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
