import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { FaTshirt, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "./DonationTemplate.css"
import { BloodModal, BookModal, ClothModal, DonationModal, FoodModal, LaptopModal, OwnHandModal, SkillModal, ToyModal } from '../../Pages/Donate/Modals';

const DonateTemplate = () => {

    const [bookModal, setBookModal] = useState(false);
    const [clothModal, setClothModal] = useState(false);
    const [foodModal, setFoodModal] = useState(false);
    const [ownModal, setOwnModal] = useState(false);
    const [doNationModal, setDoNationModal] = useState(false);
    const [skillModal, setSkillModal] = useState(false);
    const [computerModal, setComputerlModal] = useState(false);
    const [bloodModal, setBloodlModal] = useState(false);
    const [toyModal, setToyModal] = useState(false);
    const navigate = useNavigate();

    // Assume these are declared or passed down from props
    const handleDonateOwn = () => {
        navigate("/donate");
    }

    const openBookModal = () => {
        setBookModal(true)
    }

    const openClothModal = () => {
        setClothModal(true)
    }


    const openFoodModal = () => {
        setFoodModal(true)
    }

    const openOwnModal = () => {
        setOwnModal(true)
    }

    const openDonationModal = () => {
        setDoNationModal(true)
    }

    const openSkillModal = () => {
        setSkillModal(true)
    }

    const openComputerModal = () => {
        setComputerlModal(true)
    }

    const openBloodModal = () => {
        setBloodlModal(true)
    }
    const openToyModal = () => {
        setToyModal(true)
    }


    const handleScrollToSection = (id) => {
        localStorage.setItem("redirectToSEC", id); // Set localStorage item

        navigate('/donation', { replace: true }); // Navigate to the donation page
    };

    const cardData = [
        {
            header: "Donate Blood",
            title: "Donate Blood Save Lives",
            image: "/Blood.webp",
            text: "More or less all of you...",
            onReadMore: () => openBloodModal(),
            onPrimaryClick: () => handleScrollToSection("blankB-donation"),
            onSecondaryClick: () => navigate("/donate"),
            primaryBtnText: <>Donate 🩸</>,
            secondaryBtnText: "Find needy!",
        },
        {
            header: "Donate Old Books",
            title: "Give the Source of Knowledge",
            image: "/books.webp",
            text: "More or less all of you...",
            onReadMore: () => openBookModal(),
            onPrimaryClick: () => handleScrollToSection("blankBk-donation"),
            onSecondaryClick: () => navigate("/donate"),
            primaryBtnText: <>Donate Old 📚</>,
            secondaryBtnText: "Find needy!",
        },
        {
            header: "Donate Mentorship",
            title: "Give the Knowledge & Skill",
            image: "/mentor.webp",
            text: "Sharing your knowledge...",
            onReadMore: () => openSkillModal(),
            onPrimaryClick: () => handleScrollToSection("blank-donation"),
            onSecondaryClick: () => navigate("/donate"),
            primaryBtnText: <>Donate your 🧠</>,
            secondaryBtnText: "Find needy!",
        },
        {
            header: "Donate Clothes",
            title: "Give an Outfit, Spread Happiness",
            image: "/clith.webp",
            text: "Your donation of clothin...",
            onReadMore: () => openClothModal(),
            onPrimaryClick: () => handleScrollToSection("blankC-donation"),
            onSecondaryClick: () => navigate("/donate"),
            primaryBtnText: <>Donate 👕👗🧣</>,
            secondaryBtnText: "Find needy!",
        },
        {
            header: "Donate Foods",
            title: "Nourish Lives, Spread Kindness",
            image: "/foods.webp",
            text: "Your food donation ca...",
            onReadMore: () => openFoodModal(),
            onPrimaryClick: () => handleScrollToSection("blankF-donation"),
            onSecondaryClick: () => navigate("/donate"),
            primaryBtnText: "Donate 🍚🍎🍞",
            secondaryBtnText: "Find needy!",
        },
        {
            header: "Donate Old Gadgets",
            title: "Empower with Old Devices",
            image: "/laptop.webp",
            text: "Your used tablet or lapt...",
            onReadMore: () => openComputerModal(),
            onPrimaryClick: () => handleScrollToSection("blankLG-donation"),
            onSecondaryClick: () => navigate("/donate"),
            primaryBtnText: "Donate 🖥️📱💻",
            secondaryBtnText: "Find needy!",
        },
        {
            header: "Donate Old Toys",
            title: "Give a Toy, Share the Joy",
            image: "/toys.webp",
            text: "Every toy has a story a...",
            onReadMore: () => openToyModal(),
            onPrimaryClick: () => handleScrollToSection("toy-donation"),
            onSecondaryClick: () => navigate("/donate"),
            primaryBtnText: "Donate 🖥️📱💻",
            secondaryBtnText: "Find needy!",
        },
        {
            header: "Donate as you can",
            title: "To Support our Community",
            image: "/doco.webp",
            text: "Your generosity can cre...",
            onReadMore: () => openDonationModal(),
            onPrimaryClick: () => handleScrollToSection("money-donation"),
            onSecondaryClick: () => navigate("/donate"),
            primaryBtnText: "Donate 💰₹",
            secondaryBtnText: "Find needy!",
        },
        // {
        //     header: "Donate Old Vehicle",
        //     title: "To Support our Community",
        //     image: "/car.webp",
        //     text: "Your generosity can cre...",
        //     onReadMore: () => openDonationModal(),
        //     onPrimaryClick: () => navigate("/car_for_charity") ,
        //     onSecondaryClick: () => handleScrollToSection("money-donation"),
        //     primaryBtnText: "Donate Old 🚐 Cars",
        //     secondaryBtnText: "Donate 💰₹ ",
        // },

    ];

    return (
        <>
            <div className="hero1">
                {/* <h1 className="hero__title text-center ">Bishwa Sanatan Raksha evam Ekta Manch</h1> */}
                <div className=''>
                    <span className="cube1 "></span>
                    <span className="cube1 "></span>
                    <span className="cube1 "></span>
                    <span className="cube1 "></span>
                    <span className="cube1 "></span>
                    <span className="cube1 "></span>
                </div>
            </div>
            <h2 className='text-center p-2 boderd bg-dark text-light' >List of categories you can contribute to for your community</h2>
            <div className="d-flex flex-wrap justify-content-center gap-5 pb-5">

                {cardData.map((card, index) => (
                    <Card className="donate-card" style={{ width: '20rem' }} key={index}>
                        <Card.Header className="">
                            <h3 className="text-center">{card.header}</h3>
                        </Card.Header>
                        <Card.Img variant="top" height={200} src={card.image} />
                        <Card.Body>
                            <div>
                                <Card.Title style={{ fontSize: "18px", fontWeight: "bold" }}>{card.title}</Card.Title>
                                <Card.Text>
                                    <span>
                                        {card.text}
                                        <Button
                                            className="ms-auto"
                                            variant="link"
                                            style={{ cursor: "pointer" }}
                                            onClick={card.onReadMore}>  Read More </Button> </span>

                                </Card.Text>
                            </div>
                            <div className="d-flex flex-row gap-2">
                                <Button className="mx-auto" variant="primary" onClick={card.onPrimaryClick}>
                                    {card.primaryBtnText}
                                </Button>
                                <Button className="mx-auto" variant="outline-secondary" onClick={card.onSecondaryClick}>
                                    {card.secondaryBtnText}
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            {clothModal && (
                <ClothModal
                    show={clothModal}
                    onHide={() => setClothModal(false)}
                />
            )}

            {computerModal && (
                <LaptopModal
                    show={computerModal}
                    onHide={() => setComputerlModal(false)}
                />
            )}
            {toyModal && (
                <ToyModal
                    show={toyModal}
                    onHide={() => setToyModal(false)}
                />
            )}
            {ownModal && (
                <OwnHandModal
                    show={ownModal}
                    onHide={() => setOwnModal(false)}
                />

            )}
            {foodModal && (
                <FoodModal
                    show={foodModal}
                    onHide={() => setFoodModal(false)}
                />
            )}
            {bookModal && (
                <BookModal
                    show={bookModal}
                    onHide={() => setBookModal(false)}
                />
            )}

            {skillModal && (
                <SkillModal
                    show={skillModal}
                    onHide={() => setSkillModal(false)}
                />
            )}
            {bloodModal && (
                <BloodModal
                    show={bloodModal}
                    onHide={() => setBloodlModal(false)}
                />
            )}

            {doNationModal && (
                <DonationModal
                    show={doNationModal}
                    onHide={() => setDoNationModal(false)}
                />

            )}
        </>
    );
};

export default DonateTemplate;
