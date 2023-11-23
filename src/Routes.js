import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './WelcomePage';
import LoginPage from './login';
import RegisterPage from './register';
import Transactionpage from './transactionpage';
import CustomerList from './CustomerList';
import Stafflist from './Stafflist';
import CustomerDashboard from './customerhome';
import { ProtectedRoute,StaffProtectedRoute,ManagerProtectedRoute } from './protectedroute';
import StaffRegisterPage from './staffregister'
import UpdateProfile from './updateprofile';

const AppRoutes = () => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
    return (
      <Router>
        <Routes>
          <Route path="" element={<WelcomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/updateprofile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
          <Route path="/CustomerList" element={<StaffProtectedRoute><CustomerList /></StaffProtectedRoute>} />
          <Route path="/Stafflist" element={<ManagerProtectedRoute><Stafflist /></ManagerProtectedRoute>} />
          <Route path="/Staffregister" element={ <ManagerProtectedRoute><StaffRegisterPage /></ManagerProtectedRoute>  } />
          {/* <ProtectedRoute path= "/customerhome" element={CustomerDashboard} isAuthenticated={isAuthenticated} /> */}
            <Route path='/customerhome' element={
                <ProtectedRoute>
                    <CustomerDashboard />
                </ProtectedRoute>
            } />
            <Route path='/transactionpage' element={
                <ProtectedRoute>
                    <Transactionpage/>
                </ProtectedRoute>
            } />         
        </Routes>
      </Router>
    );
  };

export default AppRoutes;