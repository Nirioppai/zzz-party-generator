// src/App.jsx

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import LoginPage from './components/auth/login';
import Dashboard from './components/dashboard';
import { AuthProvider } from './contexts/authContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/' element={<Navigate to='/login' replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
