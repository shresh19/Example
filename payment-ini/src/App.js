import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PayrollDashboard from './pages/PayrollDashboard/PayrollDashboard';
import './App.css'; // Empty, as requested

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PayrollDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;