import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentView('login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-t-blue-500 border-b-blue-300"></div>
      </div>
    );
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50">
      <div className="w-full max-w-md px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-indigo-700 mb-2 drop-shadow-md">
            DR Appointment
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your medical appointments easily
          </p>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl p-8">
          <div className="flex mb-6 rounded-xl overflow-hidden border border-gray-200">
            <button
              onClick={() => setCurrentView('login')}
              className={`flex-1 py-3 text-lg font-semibold transition-colors duration-300 ${
                currentView === 'login'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setCurrentView('register')}
              className={`flex-1 py-3 text-lg font-semibold transition-colors duration-300 ${
                currentView === 'register'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Register
            </button>
          </div>

          <div className="mt-4">
            {currentView === 'login' ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Register onRegister={handleLogin} />
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          &copy; 2025 MXpertz. All rights reserved.
        </div>
      </div>
    </div>
  );
}

export default App;
