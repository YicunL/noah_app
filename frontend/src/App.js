import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import PortfolioPage from './components/PortfolioPage';
import ExpectationPage from './components/ExpectationPage';

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* Navigation links */}
        <nav>
          <Link to="/portfolio">Portfolio</Link> | {" "}
          <Link to="/expectations">Expectations</Link>
        </nav>

        {/* Route configuration */}
        <Routes>
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/expectations" element={<ExpectationPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
