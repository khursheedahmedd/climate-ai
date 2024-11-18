import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const navigateToDashboard = () => {
        navigate('/map');
    };

    const navigateToAlerts = () => {
        navigate('/alerts');
    };

    const navigateToChat = () => {
        navigate('/chat');
    };

    const navigateToHistoricalWeather = () => {
        navigate('/historical-weather');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg p-6 mb-12 text-center">
                <h1 className="text-6xl font-extrabold text-green-600">Climate AI</h1>
                <p className="mt-4 text-lg text-gray-700">
                    Empowering you with real-time environmental insights to make better choices for a healthier planet.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Chat with Real-Time Insights Card */}
                <div
                    className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transform transition-transform cursor-pointer"
                    onClick={navigateToChat}
                >
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <span className="material-icons text-4xl">chat</span>
                        Chat with Real-Time Insights
                    </h2>
                    <p className="mt-3 text-lg">
                        Interact with our AI to get real-time updates on air quality and weather conditions.
                    </p>
                </div>

                {/* See Pollution Levels in Your Area Card */}
                <div
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transform transition-transform cursor-pointer"
                    onClick={navigateToDashboard}
                >
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <span className="material-icons text-4xl">place</span>
                        See Pollution Levels in Your Area
                    </h2>
                    <p className="mt-3 text-lg">
                        Access real-time air quality data to stay informed and protect your health.
                    </p>
                </div>

                {/* Get Alert for Climate Change Card */}
                <div
                    className="bg-gradient-to-r from-green-400 to-green-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transform transition-transform cursor-pointer"
                    onClick={navigateToAlerts}
                >
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <span className="material-icons text-4xl">notifications</span>
                        Get Alerts for Climate Change
                    </h2>
                    <p className="mt-3 text-lg">
                        Stay updated with timely alerts about climate changes and extreme weather conditions.
                    </p>
                </div>

                {/* Get Information about Historical Weather Card */}
                <div
                    className="bg-gradient-to-r from-purple-400 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:scale-105 transform transition-transform cursor-pointer"
                    onClick={navigateToHistoricalWeather}
                >
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <span className="material-icons text-4xl">history</span>
                        Explore Historical Weather Data
                    </h2>
                    <p className="mt-3 text-lg">
                        Dive into historical weather trends and analyze past climate data.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
