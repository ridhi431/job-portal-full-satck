import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Applications from './pages/Applications';
import ApplyJob from './pages/ApplyJob';
import { UserProfile } from '@clerk/clerk-react'
import RecruiterLogin from './components/RecruiterLogin';
import { AppContext } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import AddJob from './pages/AddJob';
import ManageJobs from './pages/ManageJobs';
import ViewApplications from './pages/ViewApplications';
import 'quill/dist/quill.snow.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const { showRecruiterLogin } = useContext(AppContext);

  return (
    <div className="min-h-screen bg-base-100 text-base-content transition-colors duration-200">
      <ToastContainer />
      {showRecruiterLogin && <RecruiterLogin />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />
        
        {/* Dashboard with nested routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="add-job" element={<AddJob />} />
          <Route path="view-applications" element={<ViewApplications />} />
        </Route>

        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </div>
  );
};

export default App;