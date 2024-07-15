// src/App.jsx

import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import LoginPage from './pages/auth/login';
import { AuthProvider } from './contexts/authContext';
import LayoutSkeleton from './components/layoutSkeleton';
import PartyGenerator from './pages/partyGenerator';
import AgentsPage from './pages/agents';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route
            path='/*'
            element={
              <LayoutSkeleton>
                <Routes>
                  <Route path='/' element={<PartyGenerator />} />
                  <Route path='/agents' element={<AgentsPage />} />
                  <Route path='/partyGenerator' element={<PartyGenerator />} />
                  {/* Add other routes that should be within LayoutSkeleton here */}
                </Routes>
              </LayoutSkeleton>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
