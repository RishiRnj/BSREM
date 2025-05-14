import React, { useEffect, useState } from 'react';
import { Card, Button, Stack, Spinner } from "react-bootstrap";
import "./Forum.css"


const PartialStatistics = ({ maxResponses }) => {
    const [stats, setStats] = useState({ totalUsers: 0, surveyParticipants: 0, responses: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchStats = async () => {
            
            setIsLoading(true)
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/survey/api/stats/forum`, {
                    method: 'GET',
                    credentials: 'include', // Send cookies
                    headers: {
                        
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch statistics");
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Error fetching statistics:", error);
                setError("Could not load forum statistics. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    // if (isLoading) return <p>Loading statistics...</p>;
    if (isLoading) {
        return (
            <div className="loading-container"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1050,
                }}
            >
                <Spinner animation="border" role="status" >
                    <span className="visually-hidden">Loading statistics....</span>
                </Spinner>
            </div>
        );
    }
    if (error) return <p>{error}</p>;

    // Limit responses displayed
    const limitedResponses = stats.responses.slice(0, maxResponses);

    return (
        <>
            <div style={{ position: "relative", }}>
                
                <div className='extP' style={{ paddingBottom: "80px" }}> {/* Reserve space for footer */}
                    <div
                        className="statistics"
                        style={{
                            position: "fixed",
                            bottom: "60px", // Space for footer
                            left: "0",
                            right: "0",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            background: "#f8f9fa",
                            // padding: "4px 0",
                            borderTop: "2px solid #ddd",
                            boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <div className="scrolling-content">
                            <Stack direction="horizontal" gap={3} className="scrolling-stack">
                                <div>
                                    <strong>User Survey Statistics:</strong>
                                </div>
                                <div className="p-2 text-center">
                                    Total registered Users: <strong>{stats.totalUsers}</strong>
                                </div>
                                <div>||</div>
                                <div className="p-2 ms-auto text-center">
                                    Survey Participants: <strong>{stats.surveyParticipants}</strong>
                                </div>
                                <div>||</div>
                                <div>
                                    <strong>Top {stats.responses.length} Responses:</strong>
                                </div>
                                {stats.responses.map((res, index) => (
                                    <div key={index}>
                                        {res.questionText} - Yes: <strong>{res.yesCount}</strong>, No:{" "}
                                        <strong>{res.noCount}</strong>
                                    </div>
                                ))}
                                <div>||</div>

                            </Stack>
                        </div>


                        <div className="scrolling-content">
                            <Stack direction="horizontal" gap={3} className="scrolling-stack">
                                <div>||</div>
                                <div>
                                    <strong>User Survey Statistics:</strong>
                                </div>
                                <div className="p-2 text-center">
                                    Total registered Users: <strong>{stats.totalUsers}</strong>
                                </div>
                                <div>||</div>
                                <div className="p-2 ms-auto text-center">
                                    Survey Participants: <strong>{stats.surveyParticipants}</strong>
                                </div>
                                <div>||</div>
                                <div>
                                    <strong>Top {stats.responses.length} Responses:</strong>
                                </div>
                                {stats.responses.map((res, index) => (
                                    <div key={index}>
                                        {res.questionText} - Yes: <strong>{res.yesCount}</strong>, No:{" "}
                                        <strong>{res.noCount}</strong>
                                    </div>
                                ))}

                            </Stack>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

};

export default PartialStatistics;
