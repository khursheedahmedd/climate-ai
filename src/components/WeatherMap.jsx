import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Configure Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AirQualityMap = () => {
    const [location, setLocation] = useState({ lat: 31.5497, lon: 74.3436 }); // Default location: Lahore
    const [airData, setAirData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const apiKey = '9eb2dec9-5d3d-41c3-9cc5-81baa35b5c27';
    useEffect(() => {
        // Get user's current location
        const getCurrentLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        setLocation({ lat: latitude, lon: longitude });
                        await fetchAirQualityData(latitude, longitude);
                    },
                    (error) => {
                        setError("Unable to retrieve your location.");
                        setLoading(false);
                    }
                );
            } else {
                setError("Geolocation is not supported by this browser.");
                setLoading(false);
            }
        };

        // Fetch air quality data from API using HTTPS
        const fetchAirQualityData = async (lat, lon) => {
            try {
                const response = await axios.get(
                    `https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${apiKey}`
                );
                setAirData(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching air quality data:', error);
                setError("Error fetching air quality data.");
                setLoading(false);
            }
        };

        getCurrentLocation();
    }, [apiKey]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    // Air quality tips based on AQI value
    const getAQITips = (aqi) => {
        if (aqi <= 50) {
            return {
                level: "Good",
                message: "Air quality is considered satisfactory, and air pollution poses little or no risk.",
                color: "text-green-500",
                tips: "Enjoy your day! No precautions needed."
            };
        } else if (aqi <= 100) {
            return {
                level: "Moderate",
                message: "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
                color: "text-yellow-500",
                tips: "Sensitive groups should limit prolonged outdoor exertion."
            };
        } else if (aqi <= 150) {
            return {
                level: "Unhealthy for Sensitive Groups",
                message: "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
                color: "text-orange-500",
                tips: "Limit outdoor activities, especially for sensitive groups like children, elderly, and those with respiratory conditions."
            };
        } else if (aqi <= 200) {
            return {
                level: "Unhealthy",
                message: "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.",
                color: "text-red-500",
                tips: "Avoid prolonged outdoor exertion. Everyone should take precautions."
            };
        } else if (aqi <= 300) {
            return {
                level: "Very Unhealthy",
                message: "Health alert: everyone may experience more serious health effects.",
                color: "text-purple-500",
                tips: "Stay indoors and avoid outdoor physical activities."
            };
        } else {
            return {
                level: "Hazardous",
                message: "Health warnings of emergency conditions. The entire population is more likely to be affected.",
                color: "text-maroon-500",
                tips: "Avoid going outdoors. Use air purifiers indoors if possible."
            };
        }
    };

    const airQualityInfo = getAQITips(airData.current.pollution.aqius);

    const pollutantData = {
        o3: 100, // Ozone
        no2: 50, // Nitrogen Dioxide
        o2: 21 // Oxygen (assumed to be percentage)
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="text-center mb-8 fade-in">
                <h1 className="text-5xl font-bold text-blue-600 drop-shadow-md transition duration-300 hover:scale-105">
                    Air Quality
                </h1>
                <p className="text-gray-500 text-xl mt-2">
                    Check the air quality index (AQI) in {airData.city}
                </p>
            </div>

            <div className="shadow-lg rounded-lg overflow-hidden fade-in">
                <MapContainer
                    center={[location.lat, location.lon]}
                    zoom={13}
                    zoomControl={false}
                    scrollWheelZoom={true}
                    style={{ height: '500px', width: '100%' }}
                    className="rounded-lg"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="©️ OpenStreetMap contributors"
                    />
                    <Marker position={[location.lat, location.lon]}>
                        <Popup>
                            <div className="text-center transform hover:scale-110 transition-transform duration-300">
                                <b className="text-xl">{airData.city}</b> <br />
                                <span className="text-lg font-semibold text-blue-600">AQI: {airData.current.pollution.aqius}</span> <br />
                                Temperature: {airData.current.weather.tp}°C <br />
                                Humidity: {airData.current.weather.hu}%
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>

            <div className="mt-8 text-center fade-in">
                <p className={`text-3xl font-bold transition-all duration-300 transform hover:scale-110 ${airQualityInfo.color}`}>
                    Air Quality Index: {airData.current.pollution.aqius} ({airQualityInfo.level})
                </p>
                <p className="text-gray-500 mt-2 text-lg">{airQualityInfo.message}</p>
                <p className="mt-4 text-lg font-semibold text-blue-600">What you should do:</p>
                <p className="text-gray-700 text-lg">{airQualityInfo.tips}</p>
            </div>

            <div className="mt-8 text-center fade-in">
                <h2 className="text-2xl font-bold">Pollutants Data</h2>
                <p className="text-gray-600">
                    <b>Ozone (O₃):</b> {pollutantData.o3} µg/m³ <br />
                    <b>Nitrogen Dioxide (NO₂):</b> {pollutantData.no2} µg/m³ <br />
                    <b>Oxygen (O₂):</b> {/* Assuming O₂ is fetched or displayed, hardcode it for now */}
                    21% {/* Oxygen concentration is often stable */}
                </p>
            </div>

            {/* How to reduce air pollution */}
            <div className="mt-12 fade-in">
                <h2 className="text-4xl font-bold text-center text-blue-600 drop-shadow-md mb-4">
                    How to Reduce Air Pollution
                </h2>
                <ul className="text-gray-600 text-lg space-y-4 fade-in">
                    <li>
                        <b>1. Reduce Vehicle Use:</b> Opt for public transportation, carpooling, or walking to minimize vehicle emissions.
                    </li>
                    <li>
                        <b>2. Use Energy Efficient Appliances:</b> Switch to energy-efficient appliances and light bulbs to reduce energy consumption and emissions from power plants.
                    </li>
                    <li>
                        <b>3. Conserve Energy:</b> Turn off lights and unplug devices when not in use to reduce power consumption.
                    </li>
                    <li>
                        <b>4. Avoid Burning Waste:</b> Refrain from burning garbage or leaves, which releases harmful pollutants into the air.
                    </li>
                    <li>
                        <b>5. Plant Trees:</b> Trees help absorb carbon dioxide and provide oxygen, improving air quality.
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default AirQualityMap;
