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
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white shadow-md rounded-lg p-6 mb-8" >
                <h1 className="text-5xl font-bold text-center text-green-600">Climate AI </h1>
                <p className="mt-4 text-xl text-gray-700 text-center">
                    Get real-time insights into environmental data such as air quality, pollution levels, and more.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg shadow-md cursor-pointer" onClick={navigateToChat}>
                    <h2 className="text-3xl font-semibold text-blue-600">Chat with Real-Time Insights</h2>
                    <p className="mt-2 text-gray-600">
                        Our AI-powered dashboard provides real-time updates on air quality and weather conditions, helping you stay informed and make better choices for yourself and your community.
                    </p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg shadow-md cursor-pointer" onClick={navigateToDashboard}>
                    <h2 className="text-3xl font-semibold text-yellow-600">See Pollution Levels in Your Area</h2>
                    <p className="mt-2 text-gray-600">
                        Our dashboard provides real-time updates on air quality and weather conditions, helping you stay informed and make better choices for yourself and your community.
                    </p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg shadow-md cursor-pointer" onClick={navigateToAlerts}>
                    <h2 className="text-3xl font-semibold text-green-600">Get Alert for Climate Change</h2>
                    <p className="mt-2 text-gray-600">
                        Our dashboard provides real-time updates on air quality and weather conditions, helping you stay informed and make better choices for yourself and your community.
                    </p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg shadow-md cursor-pointer" onClick={navigateToHistoricalWeather}>
                    <h2 className="text-3xl font-semibold text-purple-600">Get Information about Historical Weather </h2>
                    <p className="mt-2 text-gray-600">
                        Get real-time insights into environmental data such as air quality, pollution levels, and more.
                    </p>
                </div>
            </div>

            {/* <div className="mt-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Join Us in Making a Difference</h2>
                <p className="mt-2 text-gray-600">
                    Together, we can work towards a healthier planet. Monitor, educate, and take action for a sustainable future!
                </p>
            </div> */}
        </div>
    );
};

export default HomePage;
