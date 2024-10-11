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

const AirQualityChat = () => {
    const [location, setLocation] = useState({ lat: 31.5497, lon: 74.3436 }); // Default location: Lahore
    const [airData, setAirData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chat, setChat] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [airResponse, setAirResponse] = useState('');
    const [language, setLanguage] = useState('en');

    const apiKey = 'bcbc5efb-e4e4-4456-b58b-979a7d268862';
    const chatApiKey = '';

    const languageOptions = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'zh', name: 'Chinese' },
        // Add more languages as needed
    ];

    useEffect(() => {
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

        const fetchAirQualityData = async (lat, lon) => {
            try {
                const response = await axios.get(
                    `https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${apiKey}`
                );
                setAirData(response.data.data);
                setLoading(false);

                const initialMessage = `The air quality in ${response.data.data.city} is ${response.data.data.current.pollution.aqius} AQI. The temperature is ${response.data.data.current.weather.tp}°C. Here are some tips for you: ${getAQITips(response.data.data.current.pollution.aqius).tips}. You can now ask me any environmental questions in any language.`;

                setChat([{ sender: 'model', text: initialMessage }]);

                setAirResponse(response)
            } catch (error) {
                console.error('Error fetching air quality data:', error);
                setError("Error fetching air quality data.");
                setLoading(false);
            }
        };

        getCurrentLocation();
    }, [apiKey]);

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

    const handleSendMessage = async () => {

        if (!userInput) return;

        const userMessage = `The air quality in ${airResponse.data.data.city} is ${airResponse.data.data.current.pollution.aqius} AQI. The temperature is ${airResponse.data.data.current.weather.tp}°C. and here is my question ${userInput}. Give me short answer and don't use headings and also give two answer one in English and also conert that English response into given city language and separate both language response with some space`;
        setChat((prevChat) => [...prevChat, { sender: 'user', text: userInput }]);

        // Send message to the chat API
        try {
            const response = await fetch("https://api.aimlapi.com/chat/completions", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${chatApiKey}`, // Use your chat API key
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "gpt-4o",
                    messages: [
                        { role: "user", content: userMessage },
                    ],
                    max_tokens: 512,
                    stream: false,
                    language: language
                }),
            });

            const data = await response.json();
            const modelResponse = data.choices[0]?.message?.content || "Sorry, I couldn't get a response.";
            setChat((prevChat) => [...prevChat, { sender: 'model', text: modelResponse }]);
        } catch (error) {
            console.error('Error communicating with the chat API:', error);
            setChat((prevChat) => [...prevChat, { sender: 'model', text: "Error: Unable to get a response." }]);
        }

        setUserInput('');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-8 border-2 bg-gray-200 rounded-lg shadow-xl mt-8 overflow-hidden">
            <div className="text-center mb-8 fade-in">
                <h1 className="text-5xl font-bold text-blue-600 drop-shadow-md transition duration-300 hover:scale-105">
                    Environmental Chat
                </h1>
                <p className="text-gray-500 text-xl mt-2">
                    Chat about the environment in {airData.city}
                </p>
            </div>

            {/* <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-2 mb-4 p-2 border border-gray-300 rounded-lg"
            >
                {languageOptions.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
            </select> */}

            {/* <div className="shadow-lg rounded-lg overflow-hidden fade-in">
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
            </div> */}

            {/* Chat Box */}
            <div className="mt-8">
                <div className="bg-white rounded-lg p-4 mb-4">
                    {chat.map((message, index) => (
                        <div key={index} className={`mb-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                            <span className={`inline-block px-4 py-2 rounded-lg ${message.sender === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                <strong>{message.sender === 'user' ? 'You' : 'Model'}: </strong>
                                {message.text}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Input Box */}
                <div className="flex">
                    <input
                        type="text"
                        placeholder="Ask about the environment..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <button onClick={handleSendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AirQualityChat;
