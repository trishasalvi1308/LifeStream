import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { DonorRegistration } from './pages/DonorRegistration';
import { Eligibility } from './pages/Eligibility';
import { SosRequest } from './pages/SosRequest';
import { HospitalVerification } from './pages/HospitalVerification';
import { MatchingProcess } from './pages/MatchingProcess';
import { RealTimeAlert } from './pages/RealTimeAlert';
import { RequestFulfilled } from './pages/RequestFulfilled';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { DonorDashboard } from './pages/DonorDashboard';
import { HospitalDashboard } from './pages/HospitalDashboard';
import { FindHospitals } from './pages/FindHospitals';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<DonorRegistration />} />
            <Route path="/eligibility" element={<Eligibility />} />
            <Route path="/sos" element={<SosRequest />} />
            <Route path="/verify-hospital" element={<HospitalVerification />} />
            <Route path="/matching" element={<MatchingProcess />} />
            <Route path="/alert" element={<RealTimeAlert />} />
            <Route path="/fulfilled" element={<RequestFulfilled />} />
            <Route path="/search" element={<FindHospitals />} />
            
            {/* New Dashboard Routes */}
            <Route path="/dashboard/donor" element={<DonorDashboard />} />
            <Route path="/dashboard/hospital" element={<HospitalDashboard />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
