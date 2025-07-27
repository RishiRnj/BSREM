import React, { useState, useEffect } from 'react';
import { Card, Container } from 'react-bootstrap';
import CountUp from 'react-countup';
import { motion, AnimatePresence } from 'framer-motion';

const statsData = [
    {
        title: 'Total Registered Users!',
        valueKey: 'totalUsers',
        bgImage: '/bg1.webp',
        description: "Not registered yet?",
        cta: {
            label: "Click Here",
            onClick: () => {
                window.location.href = "/login"; // Or use navigate("/register") if using React Router
            }
        },
        guestOnly: true  // 👈 only show to users without a token
    },

    {
        title: 'Users Asked for Support!',
        valueKey: 'totalBeneficiaries',
        bgImage: '/bg2.webp',
        description: "Do you need any Support?",
        cta: {
            label: "Click Here for Support",
            onClick: () => {
                window.location.href = "/register/for_support"; // Or use navigate("/register") if using React Router
            }
        }
    },
    {
        title: 'Users Who Received Support!',
        valueKey: 'totalSupportReceived',
        bgImage: '/bg3.webp',
        description: "Do you need any Assistance?",
        cta: {
            label: "Click Here for Assistance",
            onClick: () => {
                window.location.href = "/register/for_support"; // Or use navigate("/register") if using React Router
            }
        }
    },
    {
        title: 'Total Registered Blood Donor!',
        valueKey: 'totalBloodDonors',
        bgImage: '/bg5.webp',
        description: "Willing to Donate Blood?",
        cta: {
            label: "Click Here to Register",
            onClick: () => {
                localStorage.setItem("redirectToSEC", "blankB-donation");
                window.location.href = "/donation"; // Or use navigate("/register") if using React Router
            }
        }
    },
    {
        title: 'Total Conferences Organized!',
        valueKey: 'totalConferences',
        bgImage: '/bg4.webp',
        description: "See the upcoming conference venue!",
        cta: {
            label: "Click Here See Venue",
            onClick: () => {
                window.location.href = "/youth"; // Or use navigate("/register") if using React Router
            }
        }
    },
    {
        title: 'Total Engagement in Open Survey!',
        valueKey: 'totalSurveyRespondents',
        bgImage: '/bg6.webp',
        description: "Haven't participated in the Open Survey yet!",
        cta: {
            label: "Click Here Participate",
            onClick: () => {
                window.location.href = "/open-survey/byAdmin"; // Or use navigate("/register") if using React Router
            }
        }
    },
];


const AnimatedStatsSlider = ({ totalUsers, totalBeneficiaries, totalSupportReceived, totalBloodDonors, totalConferences, totalSurveyRespondents }) => {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const token = localStorage.getItem("token");

    const values = {
        totalUsers,
        totalBeneficiaries,
        totalSupportReceived,
        totalBloodDonors,
        totalConferences,
        totalSurveyRespondents
    };

    useEffect(() => {
        if (!paused) {
            const interval = setInterval(() => {
                setIndex((prev) => (prev + 1) % statsData.length);
            }, 4000); // change every 4 seconds
            return () => clearInterval(interval);
        }
    }, [paused]);

    const stat = statsData[index];

    return (
  <Container className="py-4 d-flex flex-column align-items-center" style={{ minHeight: '300px' }}>
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.8 }}
        style={{
          width: '100%',
          maxWidth: '500px'
        }}
      >
        <Card
          className="text-white border-0 shadow-lg"
          style={{
            backgroundImage: `url(${stat.bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '200px'
          }}
        >
          <Card.Body className="d-flex flex-column justify-content-center align-items-center bg-dark bg-opacity-50 p-2 text-center">
            <Card.Title className="fs-4 fw-semibold">{stat.title}</Card.Title>
            <Card.Text className="fs-1 fw-bold">
              <CountUp
                start={Math.floor(Math.random() * 1000)}
                end={values[stat.valueKey]}
                duration={2}
                separator=","
              />
            </Card.Text>

            {(!stat.guestOnly || !token) && stat.description && (
              <p className="mb-1 mt-1 text-white-50">{stat.description}</p>
            )}

            {(!stat.guestOnly || !token) && stat.cta && (
              <button
                onClick={stat.cta.onClick}
                className="btn btn-outline-light btn-sm"
              >
                {stat.cta.label}
              </button>
            )}
          </Card.Body>
        </Card>
      </motion.div>
    </AnimatePresence>

    {/* Dots Indicator */}
    <div className="d-flex justify-content-center mt-3">
      {statsData.map((_, i) => (
        <div
          key={i}
          onClick={() => setIndex(i)}
          style={{
            width: 10,
            height: 10,
            margin: '0 6px',
            borderRadius: '50%',
            cursor: 'pointer',
            backgroundColor: i === index ? '#ffffff' : 'rgba(255,255,255,0.4)',
            transition: 'background-color 0.3s'
          }}
        />
      ))}
    </div>
  </Container>
);

};

export default AnimatedStatsSlider;
