import React from 'react';
import { Router,Routes,Route,Link } from 'react-router-dom';
import Footer from './footer';

const WelcomePage = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center" style={{ minHeight: '100vh' }}>
      <h1>Welcome to Innovature Bank</h1>


      <div className="d-flex justify-content-center">
        <Link to="/login" className="btn btn-primary me-2">
          Login
        </Link>

        <Link to="/register" className="btn btn-secondary">
          Register
        </Link>
        
      </div>
      <Footer />
    </div>
    
  );
};

export default WelcomePage;