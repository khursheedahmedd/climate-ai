// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from './components/HomePage';
// import Dashboard from './components/Dashboard';
import Alerts from './components/Alerts';
import Navbar from './components/Navbar';
import WeatherChat from './components/WeatherChat';
import WeatherMap from './components/WeatherMap';
// import RecentNews from './components/RecentNews';
import Home from './components/Home';
import HistoricalWeather from './components/HistoricalWeather';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/chat' element={<WeatherChat />} />
          <Route path='/alerts' element={<Alerts />} />
          <Route path='/map' element={<WeatherMap />} />
          <Route path='/historical-weather' element={<HistoricalWeather />} />
        </Routes>
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

export default App;
