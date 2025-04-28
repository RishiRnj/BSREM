// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
// import { FaBook, FaTshirt, FaHandHoldingHeart, FaRupeeSign   } from "react-icons/fa";
// import { GiLaptop } from "react-icons/gi";

// function BookModal(props) {
//     return (
//         <Modal
//             {...props}
//             size="md"
//             aria-labelledby="contained-modal-title-vcenter"
//             centered
//         >
//             <Modal.Header closeButton>
//                 <Modal.Title id="contained-modal-title-vcenter">
//                     Donate the Source of Knowledge
//                 </Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <h5 style={{ fontSize: "16px", fontStyle: "italic" }}>
//                     More or less all of you read books and often sell them after finishing. But what if, instead of selling, you could give those books a second life? By donating them, you’re not just passing on pages—you’re opening doors for students and families in need. Higher education books, in particular, can be a lifeline for students from economically weaker backgrounds, empowering them with knowledge and opportunities. Your donation could be the key to someone's future. Give the gift of learning today!
//                 </h5>
//                 <div className='d-flex justify-content-center mt-3'>
//                     <Button variant="primary">
//                         <a className='mod-bt text-white text-decoration-none' href="/donate/dashboard"> Donate <FaBook /></a>
//                     </Button>
//                 </div>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={props.onHide}>Close</Button>
//             </Modal.Footer>
//         </Modal>
//     );
// }

// function ClothModal(props) {
//     return (
//         <Modal
//             {...props}
//             size="md"
//             aria-labelledby="contained-modal-title-vcenter"
//             centered
//         >
//             <Modal.Header closeButton>
//                 <Modal.Title id="contained-modal-title-vcenter">
//                     Give a Outfit, Spread Happiness
//                 </Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <h5 style={{ fontSize: "16px", fontStyle: "italic" }}>
//                     Your donation of clothing can truly change someone’s life. A simple dress can bring a smile to a family, offering warmth and comfort. While you may see it as just another outfit, for someone else, it’s a treasured gift. By donating, you’re not just giving clothes—you’re giving hope. Step forward to make a difference, and encourage those around you to do the same. Together, we can bring warmth and happiness to those in need.
//                 </h5>
//                 <div className='d-flex justify-content-center mt-3'>
//                     <Button variant="primary">
//                         <a className='mod-bt text-white text-decoration-none' href="/donate/dashboard"> Donate <FaTshirt /></a>
//                     </Button>
//                 </div>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={props.onHide}>Close</Button>
//             </Modal.Footer>
//         </Modal>
//     );
// }
// function FoodModal(props) {
//     return (
//         <Modal
//             {...props}
//             size="md"
//             aria-labelledby="contained-modal-title-vcenter"
//             centered
//         >
//             <Modal.Header closeButton>
//                 <Modal.Title id="contained-modal-title-vcenter">
//                 Nourish Lives, Spread Kindness
//                 </Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <h5 style={{ fontSize: "16px", fontStyle: "italic" }}>
//                 Millions of people go to bed hungry every day, but you can help change that. By donating food, you’re not just providing meals—you’re offering hope, dignity, and a chance for a better tomorrow. What may be extra for you could be a lifeline for someone else. Step forward to share your generosity and encourage those around you to do the same. Together, we can fight hunger and make a lasting impact.
//                 </h5>
//                 <div className='d-flex justify-content-center mt-3'>
//                     <Button variant="primary">
//                         <a className='mod-bt text-white text-decoration-none' href="/donate/dashboard"> Donate <img src='/healthi.png' style={{ maxHeight:"40px", width:"30px", objectFit:"cover"}}/>   </a>

//                     </Button>
//                 </div>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={props.onHide}>Close</Button>
//             </Modal.Footer>
//         </Modal>
//     );
// }
// function OwnHandModal(props) {
//     return (
//         <Modal
//             {...props}
//             size="md"
//             aria-labelledby="contained-modal-title-vcenter"
//             centered
//         >
//             <Modal.Header closeButton>
//                 <Modal.Title id="contained-modal-title-vcenter">
//                 Extend a Helping Hand, Make a Difference
//                 </Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <h5 style={{ fontSize: "16px", fontStyle: "italic" }}>
//                     There’s something truly special about giving directly with your own hands. Your donation can bring immediate relief and joy to someone in need. Whether it’s education, healthcare, or community development, or essentials, your act of kindness can change a life.

//                     We believe in building a strong, compassionate community. If needed, we will help connect donors with those who require assistance, ensuring your generosity reaches the right hands. Together, let’s create a network of care and support—because every small act of kindness makes a big difference.

//                 </h5>
//                 <div className='d-flex justify-content-center mt-3'>
//                     <Button variant="primary">
//                         <a className='mod-bt text-white text-decoration-none' href="/donate"> Donate  <FaHandHoldingHeart /></a>

//                     </Button>
//                 </div>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={props.onHide}>Close</Button>
//             </Modal.Footer>
//         </Modal>
//     );
// }
// function DonationModal(props) {
//     return (
//         <Modal
//             {...props}
//             size="md"
//             aria-labelledby="contained-modal-title-vcenter"
//             centered
//         >
//             <Modal.Header closeButton>
//                 <Modal.Title id="contained-modal-title-vcenter">
//                 Support Us to Support Others
//                 </Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <h5 style={{ fontSize: "16px", fontStyle: "italic" }}>
//                     Your generosity can create a lasting impact. By donating to us, you are directly contributing to meaningful initiatives that help those in need. Every penny you give is carefully allocated to ensure it reaches the right level of society—providing food, clothing, education, and essential support to the underprivileged.

//                     We are committed to transparency and making a real difference. With your help, we can expand our efforts, reach more people, and bring hope to those who need it most. Join us in making the world a better place—one donation at a time.

//                 </h5>
//                 <div className='d-flex justify-content-center mt-3'>
//                     <Button variant="primary">
//                         <a className='mod-bt text-white text-decoration-none' href="/donate/dashboard"> Donate  <FaRupeeSign/></a>

//                     </Button>
//                 </div>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={props.onHide}>Close</Button>
//             </Modal.Footer>
//         </Modal>
//     );
// }
// function SkillModal(props) {
//     return (
//         <Modal
//             {...props}
//             size="md"
//             aria-labelledby="contained-modal-title-vcenter"
//             centered
//         >
//             <Modal.Header closeButton>
//                 <Modal.Title id="contained-modal-title-vcenter">
//                 Give the Knowledge & Skill to Socity
//                 </Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <h5 style={{ fontSize: "16px", fontStyle: "italic" }}>
//                   Sharing your knowledge and skills with others is a powerful way to give back to society. By donating your expertise, you help create opportunities for growth, learning, and progress in your community. Whether it's through mentoring, volunteering, or teaching, your contributions can inspire others, drive innovation, and foster a culture of support and collaboration. When you donate your skill and knowledge, you’re not just passing on knowledge; you’re building a stronger, more connected society.
//                 </h5>
//                 <div className='d-flex justify-content-center mt-3'>
//                     <Button variant="primary">
//                         <a className='mod-bt text-white text-decoration-none' href="/donate/dashboard"> Donate <img src='/skill.webp' style={{ maxHeight:"40px", width:"30px", objectFit:"cover"}}/>   </a>

//                     </Button>
//                 </div>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={props.onHide}>Close</Button>
//             </Modal.Footer>
//         </Modal>
//     );
// }
// function LaptopModal(props) {
//     return (
//         <Modal
//             {...props}
//             size="md"
//             aria-labelledby="contained-modal-title-vcenter"
//             centered
//         >
//             <Modal.Header closeButton>
//                 <Modal.Title id="contained-modal-title-vcenter">
//                     Empower the Future with Technology
//                 </Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <h5 style={{ fontSize: "16px", fontStyle: "italic" }}>
//                 Your old gadgets could be a gateway to education for someone in need! Donate learning devices like laptops, tablets, and smartphones to help students access vital resources and unlock their potential. Your contribution can make a lasting difference in a child's education and open doors to a brighter future. Let’s come together to bridge the digital divide and empower the next generation!
//                 </h5>
//                 <div className='d-flex justify-content-center mt-3'>
//                     <Button variant="primary">
//                         <a className='mod-bt text-white text-decoration-none' href="/donate/dashboard"> Donate <GiLaptop /> </a>

//                     </Button>
//                 </div>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={props.onHide}>Close</Button>
//             </Modal.Footer>
//         </Modal>
//     );
// }

// export { BookModal, ClothModal, FoodModal, OwnHandModal, DonationModal, SkillModal, LaptopModal };



import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaBook, FaTshirt, FaHandHoldingHeart, FaRupeeSign } from "react-icons/fa";
import { GiLaptop } from "react-icons/gi";
import { MdOutlineBloodtype } from "react-icons/md";

// Function to handle smooth scroll to the target section


function BookModal(props) {
    // Function to handle smooth scroll and modal close
    const handleScrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: 'smooth',
            });
        }
        // Close the modal after navigating
        props.onHide();
    };
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Donate the Source of Knowledge
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 style={{ fontSize: "16px", fontStyle: "italic" }}>
                    More or less all of you read books and often sell them after finishing. But what if, instead of selling, you could give those books a second life? By donating them, you’re not just passing on pages—you’re opening doors for students and families in need. 
                </h5>
                <h5 style={{ fontSize: "16px", fontStyle: "italic" }}>
                    Higher education books, in particular, can be a lifeline for students from economically weaker backgrounds, empowering them with knowledge and opportunities. Your donation could be the key to someone's future. Give the gift of learning today!
                </h5>
                <div className='d-flex justify-content-center mt-3'>
                    <Button variant="primary" onClick={() => handleScrollToSection('book-donation')}>
                        Donate <FaBook />
                    </Button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

function ClothModal(props) {
    // Function to handle smooth scroll and modal close
    const handleScrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: 'smooth',
            });
        }
        // Close the modal after navigating
        props.onHide();
    };
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Give a Outfit, Spread Happiness
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 style={{ fontSize: "16px", fontStyle: "italic" }}>
                    Your donation of clothing can truly change someone’s life. A simple dress can bring a smile to a family, offering warmth and comfort. While you may see it as just another outfit, for someone else, it’s a treasured gift.
                </h5>
                <h5 style={{ fontSize: "16px", fontStyle: "italic", marginTop:"5px" }}>
                    By donating, you’re not just giving clothes—you’re giving hope. Step forward to make a difference, and encourage those around you to do the same. Together, we can bring warmth and happiness to those in need.
                </h5>
                <div className='d-flex justify-content-center mt-3'>
                    <Button variant="primary" onClick={() => handleScrollToSection('cloth-donation')}>
                        Donate <FaTshirt />
                    </Button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
function FoodModal(props) {
    // Function to handle smooth scroll and modal close
    const handleScrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: 'smooth',
            });
        }
        // Close the modal after navigating
        props.onHide();
    };
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Nourish Lives, Spread Kindness
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 style={{ fontSize: "16px", fontStyle: "italic" }}>
                    Millions of people go to bed hungry every day, but you can help change that. By donating food, you’re not just providing meals—you’re offering hope, dignity, and a chance for a better tomorrow.
                </h5>
                <h5 style={{ fontSize: "16px", fontStyle: "italic", marginTop:"5px" }}>
                    What may be extra for you could be a lifeline for someone else. Step forward to share your generosity and encourage those around you to do the same. Together, we can fight hunger and make a lasting impact.
                </h5>
                <div className='d-flex justify-content-center mt-3'>

                    <Button variant="primary" onClick={() => handleScrollToSection('food-donation')}>
                        Donate <img src='/healthi.png' alt='Food' style={{ maxHeight: "40px", width: "30px", objectFit: "cover" }} />
                    </Button>
                    {/* <Button variant="primary">
                        <a className='mod-bt text-white text-decoration-none' href="/donate/dashboard"> Donate <img src='/healthi.png' style={{ maxHeight:"40px", width:"30px", objectFit:"cover"}}/>   </a>
                        
                    </Button> */}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
function OwnHandModal(props) {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Extend a Helping Hand, Make a Difference
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 style={{ fontSize: "16px", fontStyle: "italic" }}>
                    There’s something truly special about giving directly with your own hands. Your donation can bring immediate relief and joy to someone in need. Whether it’s education, healthcare, or community development, or essentials, your act of kindness can change a life.
                </h5>
                <h5 style={{ fontSize: "16px", fontStyle: "italic", marginTop:"5px" }}>
                    We believe in building a strong, compassionate community. If needed, we will help connect donors with those who require assistance, ensuring your generosity reaches the right hands. Together, let’s create a network of care and support—because every small act of kindness makes a big difference.
                </h5>
                <div className='d-flex justify-content-center mt-3'>
                    <Button variant="primary">
                        <a className='mod-bt text-white text-decoration-none' href="/donate"> Donate  <FaHandHoldingHeart /></a>

                    </Button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
function DonationModal(props) {
    // Function to handle smooth scroll and modal close
    const handleScrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: 'smooth',
            });
        }
        // Close the modal after navigating
        props.onHide();
    };
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Support Us to Support Our Community
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 style={{ fontSize: "16px", fontStyle: "italic" }}>
                    Your generosity can create a lasting impact. By donating to us, you are directly contributing to meaningful initiatives that help those in need. Every penny you give is carefully allocated to ensure it reaches the right level of society—providing food, clothing, education, and essential support to the underprivileged.
                </h5>
                <h5 style={{ fontSize: "16px", fontStyle: "italic", marginTop:"5px" }}>
                    We are committed to transparency and making a real difference. With your help, we can expand our efforts, reach more people, and bring hope to those who need it most. Join us in making the world a better place—one donation at a time.

                </h5>
                <div className='d-flex justify-content-center mt-3'>
                    <Button variant="primary" onClick={() => handleScrollToSection('money-donation')}>
                        Donate <FaRupeeSign />
                    </Button>

                    {/* <Button variant="primary">
                        <a className='mod-bt text-white text-decoration-none' href="/donate/dashboard"> Donate  <FaRupeeSign/> </a>
                        
                    </Button> */}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
function SkillModal(props) {
    // Function to handle smooth scroll and modal close
    const handleScrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: 'smooth',
            });
        }
        // Close the modal after navigating
        props.onHide();
    };
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Give the Knowledge & Skill to Socity
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 style={{ fontSize: "16px", fontStyle: "italic" }}>
                    Sharing your knowledge and skills with others is a powerful way to give back to society. By donating your expertise, you help create opportunities for growth, learning, and progress in your community. Whether it's through mentoring, volunteering, or teaching,
                </h5>
                <h5 style={{ fontSize: "16px", fontStyle: "italic", marginTop:"5px" }}>
                    Your Contributions can inspire others, drive innovation, and foster a culture of support and collaboration. When you donate your skill and knowledge, you’re not just passing on knowledge; you’re building a stronger, more connected society.
                </h5>
                <div className='d-flex justify-content-center mt-3'>
                    <Button variant="primary" onClick={() => handleScrollToSection('skill-donation')}>
                        Donate <img src='/skill.webp' alt='Skill' style={{ maxHeight: "40px", width: "30px", objectFit: "cover" }} />
                    </Button>


                    {/* <Button variant="primary">
                        <a className='mod-bt text-white text-decoration-none' href="/donate/dashboard"> Donate <img src='/skill.webp' alt='Skill' style={{ maxHeight:"40px", width:"30px", objectFit:"cover"}}/>   </a>
                        
                    </Button> */}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
function LaptopModal(props) {
    // Function to handle smooth scroll and modal close
    const handleScrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: 'smooth',
            });
        }
        // Close the modal after navigating
        props.onHide();
    };
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Empower the Future with Technology
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 style={{ fontSize: "16px", fontStyle: "italic" }}>
                    Your old gadgets could be a gateway to education for someone in need! Donate learning devices like laptops, tablets, and smartphones to help students access vital resources and unlock their potential. 
                </h5>
                <h5 style={{ fontSize: "16px", fontStyle: "italic", marginTop:"5px" }}>
                    Your contribution can make a lasting difference in a child's education and open doors to a brighter future. Let’s come together to bridge the digital divide and empower the next generation!
                </h5>
                <div className='d-flex justify-content-center mt-3'>
                    <Button variant="primary" onClick={() => handleScrollToSection('laptop-donation')}>
                        Donate <GiLaptop />
                    </Button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}
function BloodModal(props) {
    // Function to handle smooth scroll and modal close
    const handleScrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: 'smooth',
            });
        }
        // Close the modal after navigating
        props.onHide();
    };
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Donate Blood Save Lives
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 style={{ fontSize: "16px", fontStyle: "italic" }}>
                    Blood donation is a simple, yet powerful way to make a life-saving difference in someone's life. By donating blood, you could be helping a patient in need of surgery, an accident victim, a cancer patient, or someone with a chronic illness.
                </h5>
                <h5 style={{ fontSize: "16px", fontStyle: "italic", marginTop:"5px" }}>
                    Your donation could mean the difference between life and death for someone in need. It’s quick, safe, and can save multiple lives. Give the gift of life today by donating blood and helping others in their time of need.
                </h5>
                <div className='d-flex justify-content-center mt-3'>
                    <Button variant="primary" onClick={() => handleScrollToSection('blood-donation')}>
                        Donate <MdOutlineBloodtype />
                    </Button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}



function ToyModal(props) {
    // Function to handle smooth scroll and modal close
    const handleScrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            window.scrollTo({
                top: element.offsetTop,
                behavior: 'smooth',
            });
        }
        // Close the modal after navigating
        props.onHide();
    };
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Give a Toy, Share the Joy
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5 style={{ fontSize: "16px", fontStyle: "italic" }}>
                    Every toy has a story—and yours can begin a new chapter in a child’s life.
                    By donating your gently loved toys, you're not just clearing space—you’re creating joy, sparking imagination, and planting hope in a young heart.

                </h5>
                <h5 style={{ fontSize: "16px", fontStyle: "italic", marginTop: "5px" }}>

                    Together, let’s turn playtime into a moment of magic.
                    Let’s give every toy a second chance—and every child a reason to smile.
                </h5>
                <div className='d-flex justify-content-center mt-3'>
                    <Button variant="primary" onClick={() => handleScrollToSection('toy-donation')}>
                        🎁 One Toy at a Time.
                    </Button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export { BookModal, ClothModal, FoodModal, OwnHandModal, DonationModal, SkillModal, LaptopModal, BloodModal, ToyModal };

