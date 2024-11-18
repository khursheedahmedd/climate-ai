import React from 'react';

const Alerts = () => {
    const alerts = [
        {
            id: 1,
            title: "Air Quality Alert",
            description: "Unhealthy levels of air pollution have been detected in the area. Limit outdoor activities, especially for sensitive groups.",
            level: "High",
            issued: "November 18, 2024",
        },
        // {
        //     id: 2,
        //     title: "Heatwave Warning",
        //     description: "Extreme temperatures are expected in the next 24 hours. Stay hydrated and avoid outdoor exposure during peak hours.",
        //     level: "Severe",
        //     issued: "October 6, 2024",
        // },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold">Environmental Alerts</h2>

            {/* Check if there are alerts */}
            {alerts.length > 0 ? (
                <div className="mt-4 space-y-4">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`p-4 rounded-lg shadow-md ${alert.level === "High"
                                ? "bg-red-100 text-red-800"
                                : alert.level === "Severe"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                        >
                            <h3 className="text-xl font-semibold">{alert.title}</h3>
                            <p>{alert.description}</p>
                            <p className="mt-2 font-medium">
                                Level: <span className="underline">{alert.level}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Issued on: {alert.issued}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-4">No alerts at the moment.</p>
            )}
        </div>
    );
};

export default Alerts;
