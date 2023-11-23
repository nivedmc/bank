
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WelcomePage from './WelcomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="" element={<WelcomePage />} />
        {/* <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} /> */}
      </Routes>
    </Router>
  );
}

export default App;
