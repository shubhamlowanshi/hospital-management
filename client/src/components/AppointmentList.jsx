import { useState } from 'react';
import { appointmentAPI } from '../services/api';

const AppointmentList = ({ appointments, user, onAppointmentUpdate, loading }) => {
  const [cancelling, setCancelling] = useState(null);

  const handleCancelAppointment = async (appointmentId) => {
    setCancelling(appointmentId);
    try {
      await appointmentAPI.cancelAppointment(appointmentId);
      onAppointmentUpdate();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert(error.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setCancelling(null);
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-emerald-100 text-emerald-700';
      case 'cancelled':
        return 'bg-rose-100 text-rose-700';
      case 'completed':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin h-10 w-10 rounded-full border-4 border-indigo-300 border-t-indigo-600"></div>
          <span className="text-gray-600 font-medium">Fetching appointments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          {user.role === 'doctor' ? 'Patient Appointments' : 'My Appointments'}
        </h2>
        <span className="px-3 py-1 text-sm rounded-full bg-indigo-50 text-indigo-600 font-semibold">
          {appointments.length} Total
        </span>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🩺</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No appointments yet
          </h3>
          <p className="text-gray-500">
            {user.role === 'patient'
              ? 'Book your first appointment and stay healthy.'
              : 'Patients will appear here once booked.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {user.role === 'doctor'
                        ? appointment.patientId?.name
                        : `Dr. ${appointment.doctorId?.name}`}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold text-gray-700">📅 Date:</span>{' '}
                      {formatDate(appointment.date)}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">⏰ Time:</span>{' '}
                      {appointment.time}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-700">📝 Reason:</span>{' '}
                      {appointment.reason}
                    </p>
                    {user.role === 'doctor' && appointment.patientId && (
                      <p>
                        <span className="font-semibold text-gray-700">📞 Contact:</span>{' '}
                        {appointment.patientId.phone}
                      </p>
                    )}
                  </div>
                </div>

                {appointment.status === 'scheduled' && (
                  <button
                    onClick={() => handleCancelAppointment(appointment._id)}
                    disabled={cancelling === appointment._id}
                    className="self-start md:self-center bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelling === appointment._id ? 'Cancelling...' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
