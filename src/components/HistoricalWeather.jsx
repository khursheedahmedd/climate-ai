import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { WiThermometer, WiDaySunny, WiSnowflakeCold } from 'react-icons/wi';

const HistoricalWeather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchDate, setSearchDate] = useState(''); // State to store the selected date
    const [latestDateData, setLatestDateData] = useState(null); // To store latest date's data

    const params = {
        latitude: 52.52, // Latitude for Berlin
        longitude: 13.41, // Longitude for Berlin
        start_date: '2023-09-26', // Adjust for your use case
        end_date: '2023-10-09',
        hourly: 'temperature_2m',
    };

    const fetchWeatherApi = async (url, params) => {
        try {
            const response = await axios.get(url, { params });
            return response.data;
        } catch (err) {
            console.error('Error fetching weather data:', err);
            throw err;
        }
    };

    const processWeatherData = (response) => {
        if (!response || !response.hourly) {
            console.error('Invalid response structure:', response);
            return null;
        }

        const times = response.hourly.time.map((t) => new Date(t));
        const temperature2m = response.hourly.temperature_2m;

        // Sort the times and temperatures in descending order (latest date first)
        const sortedData = times
            .map((time, index) => ({
                time,
                temperature: temperature2m[index],
            }))
            .sort((a, b) => b.time - a.time); // Sort by time in descending order

        return sortedData;
    };

    useEffect(() => {
        const fetchData = async () => {
            const url = 'https://archive-api.open-meteo.com/v1/archive';
            try {
                const response = await fetchWeatherApi(url, params);
                console.log('API Response:', response);
                const processedData = processWeatherData(response);
                if (processedData) {
                    setWeatherData(processedData);
                    // Automatically set the latest date's data for default display
                    setLatestDateData(processedData[0]); // The first entry after sorting is the latest date
                } else {
                    setError('Failed to process weather data.');
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to load weather data.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getTemperatureClass = (temp) => {
        if (temp >= 25) return 'text-red-500'; // Hot weather
        if (temp <= 5) return 'text-blue-500'; // Cold weather
        return 'text-yellow-500'; // Mild weather
    };

    const getIcon = (temp) => {
        if (temp >= 25) return <WiDaySunny className="text-4xl text-red-500" />;
        if (temp <= 5) return <WiSnowflakeCold className="text-4xl text-blue-500" />;
        return <WiThermometer className="text-4xl text-yellow-500" />;
    };

    // Filter weather data by selected date
    const filteredData = weatherData
        ? weatherData.filter((data) => {
            if (!searchDate) return true; // Show all data if no search date
            return data.time.toISOString().split('T')[0] === searchDate; // Match the exact date
        })
        : [];

    const handleSearchChange = (e) => {
        setSearchDate(e.target.value); // Update search date based on user input
    };

    if (loading) {
        return <div className="text-center py-4">Loading historical weather data...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    if (!weatherData) {
        return <div className="text-center text-gray-500">No weather data available.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-bold text-center mb-6">Historical Weather Data</h2>

            {/* Search bar */}
            {/* <div className="flex justify-center mb-4">
                <input
                    type="date"
                    value={searchDate}
                    onChange={handleSearchChange}
                    className="border border-gray-300 rounded-lg p-2 text-gray-700"
                />
            </div> */}

            {filteredData.length === 0 && !latestDateData ? (
                <p className="text-center text-gray-500">No data available for the selected date.</p>
            ) : (
                <>
                    {/* Display Latest Date's Weather */}
                    {!searchDate && latestDateData && (
                        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between items-center mb-6">
                            <p className="text-lg font-semibold mb-2">
                                Latest Data: {latestDateData.time.toLocaleDateString('en-GB', {
                                    weekday: 'long',
                                    month: 'short',
                                    day: 'numeric',
                                })}{' '}
                                {latestDateData.time.toLocaleTimeString('en-GB')}
                            </p>
                            {getIcon(latestDateData.temperature)}
                            <p className={`text-3xl font-bold mt-4 ${getTemperatureClass(latestDateData.temperature)}`}>
                                {latestDateData.temperature}°C
                            </p>
                        </div>
                    )}

                    {/* Display Filtered Data */}
                    {filteredData.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredData.map((data, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between items-center"
                                >
                                    <p className="text-lg font-semibold mb-2">
                                        {data.time.toLocaleDateString('en-GB', {
                                            weekday: 'long',
                                            month: 'short',
                                            day: 'numeric',
                                        })}{' '}
                                        {data.time.toLocaleTimeString('en-GB')}
                                    </p>
                                    {getIcon(data.temperature)}
                                    <p className={`text-3xl font-bold mt-4 ${getTemperatureClass(data.temperature)}`}>
                                        {data.temperature}°C
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default HistoricalWeather;
