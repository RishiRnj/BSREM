import React, { useEffect, useState } from 'react';
import { Card, Button, Stack } from "react-bootstrap";
import { FaShare } from "react-icons/fa"; // Example: React Icons library

const SurveyStats = () => {
    const [stats, setStats] = useState([]);
    const [visibleResponses, setVisibleResponses] = useState(2);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetailedStats = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Missing user authentication details.");
                setIsLoading(false);
                return;
            }
            localStorage.removeItem("redirectAfterLogin"); // Clear after use
            localStorage.removeItem("redirectAfterUpdate"); // Clear after use


            try {
                setIsLoading(true)
                const response = await fetch(`${process.env.REACT_APP_API_URL}/survey/api/stats/detailed`, {
                    method: 'GET',
                    credentials: 'include', // Send cookies
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch detailed stats");
                const data = await response.json();
                setStats(data);
                console.log(data);

            } catch (error) {
                console.error("Error fetching detailed stats:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetailedStats();
    }, []);

    const handleShare = (res) => {
        const shareData = {
            title: 'Survey Question',
            text: `Question: ${res.questionText}\nYes: ${res.yesCount}, No: ${res.noCount}`,
            url: window.location.href, // Replace with your site URL
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('Shared successfully'))
                .catch((error) => console.error('Error sharing:', error));
        } else {
            // Fallback for browsers that do not support Web Share API
            alert("Sharing is not supported on this browser. You can copy and paste the data manually:\n" +
                `Question: ${res.questionText}\nYes: ${res.yesCount}, No: ${res.noCount}`);
        }
    };


    if (isLoading) return <p>Loading statistics...</p>;
    if (error) return <p>{error}</p>;
    if (!stats) return <p>No statistics available.</p>; // Handle the case where stats is null

    return (
       
        <>
            <Button href="/forum">Go to Home Page</Button>
            <div className='pt-20 pb-10 d-flex justify-content-center align-items-center' style={{ position: "relative", minHeight: `calc(100vh - 200px)` }}>
            {/* Main Content */}
            
            <div className="statistics-container pt-30">
                <Card className="d-flex justify-content-center align-items-center crd-1 p-2">
                    <h4>Detailed Survey Statistics</h4>
                    {isLoading && <p>Loading...</p>}
                    {error && <p>{error}</p>}
                    {!isLoading && !error && (
                        <>
                            <div className="d-flex justify-content-center align-items-center blt" style={{ gap: '10px' }}>
                                <Stack direction="horizontal" gap={3}>
                                    <div className="p-2 text-center tx">Total Users: <strong>{stats.totalUsers}</strong> </div>
                                    <div>||</div>
                                    <div className="p-2 ms-auto text-center tx">Survey Participants: <strong> {stats.surveyParticipants} </strong> </div>
                                </Stack>
                            </div>


                            {/* new with share */}
                            <div className="d-flex justify-content-center align-items-center">
                                <Card className="d-flex justify-content-center align-items-center crd-2">
                                    <ol className="blt">
                                        {stats.responses.slice(0, visibleResponses).map((res, index) => (
                                            <li key={index}>
                                                <div className="ques p-2 text-wrap">
                                                    {res.questionText}
                                                </div>
                                                <div className="ans mx-auto text-center d-flex align-items-center justify-content-between">
                                                    <div className='ms-5'>
                                                        Yes: <strong>{res.yesCount}</strong> || No: <strong>{res.noCount}</strong>
                                                    </div>

                                                    {/* Share  */}
                                                    <Button
                                                        className="outline-primary ms-3"
                                                        onClick={() => handleShare(res)}
                                                    >
                                                        Share <FaShare />
                                                    </Button>
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                </Card>
                            </div>

                            {stats.responses.length > visibleResponses && (
                                <Button className="mt-3" variant="dark" onClick={() => setVisibleResponses(visibleResponses + 2)}>
                                    Load More
                                </Button>
                            )}
                        </>
                    )}
                </Card>
            </div>
            </div>
            
        </>

    );
};

export default SurveyStats;
