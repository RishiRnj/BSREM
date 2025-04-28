// // import React, { useState } from "react";
// // import { InputGroup, Form, Button } from "react-bootstrap";

// // const UsernameInput = ({ value, onChange, disabled, readOnly }) => {
// //   const [showCheckBtn, setShowCheckBtn] = useState(false);
// //   const [availabilityStatus, setAvailabilityStatus] = useState(null);
// //   const [suggestions, setSuggestions] = useState([]);

// //   const handleInputChange = (e) => {
// //     const input = e.target.value;

// //     onChange({
// //       target: {
// //         name: "username",
// //         value: input,
// //         type: "text",
// //       },
// //     });

// //     setShowCheckBtn(input.length >= 3);
// //     setAvailabilityStatus(null); // Reset previous check
// //   };


// //   const checkUsername = async () => {
// //     try {
// //       const res = await fetch(`${process.env.REACT_APP_API_URL}/user/check-username`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ username: value }),
// //       });
// //       const data = await res.json();

// //       if (data.available) {
// //         setAvailabilityStatus("available");
// //         setSuggestions([]);
// //       } else {
// //         setAvailabilityStatus("unavailable");
// //         setSuggestions(data.suggestions || []);
// //       }
// //     } catch (err) {
// //       console.error("Username check failed:", err);
// //     }
// //   };

// //   const handleSuggestionClick = (sugg) => {
// //     onChange({
// //       target: {
// //         name: "username",
// //         value: sugg,
// //         type: "text",
// //       },
// //     });

// //     setShowCheckBtn(sugg.length === 10);
// //     setAvailabilityStatus(null);
// //   };


// //   return (
// //     <>
// //       <InputGroup className="mb-2">
// //         <InputGroup.Text style={{ fontWeight: "bold" }}>
// //           User Name
// //         </InputGroup.Text>
// //         <Form.Control
// //           aria-label="User Name"
// //           name="username"
// //           type="text"
// //           maxLength={10}
// //           value={value}
// //           onChange={handleInputChange}
// //           disabled={disabled}
// //           readOnly={readOnly}
// //           required={!disabled}
// //         />

// //       </InputGroup>
// //       <div className="d-flex flex-row">      
// //       {availabilityStatus === "available" && (
// //         <div style={{ color: "green" }}>✅ Username is available!</div>
// //       )}
// //       {showCheckBtn && (
// //         <div className="ms-auto">
// //           <Button variant="outline-secondary" size="sm" onClick={checkUsername}>
// //             Check Availability
// //           </Button></div>
// //         )}
// //     </div>

// //       {availabilityStatus === "unavailable" && (
// //         <div style={{ color: "red" }}>
// //           ❌ Username taken. Try:{" "}
// //           {suggestions.map((sugg, index) => (
// //             <span
// //               key={index}
// //               style={{
// //                 marginRight: "8px",
// //                 cursor: "pointer",
// //                 textDecoration: "underline",
// //               }}
// //               onClick={() => handleSuggestionClick(sugg)}
// //             >
// //               {sugg}
// //             </span>
// //           ))}
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // export default UsernameInput;



// import React, { useState } from "react";
// import { InputGroup, Form, Button, Modal } from "react-bootstrap";

// const UsernameInput = ({ value, onChange, disabled, readOnly }) => {
//   const [showCheckBtn, setShowCheckBtn] = useState(false);
//   const [availabilityStatus, setAvailabilityStatus] = useState(null);
//   const [suggestions, setSuggestions] = useState([]);
//   const [showModal, setShowModal] = useState(false);

//   const openModal = () => {
//     if (!disabled && !readOnly) setShowModal(true);
//   };
//   const closeModal = () => setShowModal(false);

//   const handleInputChange = (e) => {
//     const input = e.target.value;

//     onChange({
//       target: {
//         name: "username",
//         value: input,
//         type: "text",
//       },
//     });

//     setShowCheckBtn(input.length >= 3);
//     setAvailabilityStatus(null);
//   };

//   const checkUsername = async () => {
//     try {
//       const res = await fetch(`${process.env.REACT_APP_API_URL}/user/check-username`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username: value }),
//       });
//       const data = await res.json();

//       if (data.available) {
//         setAvailabilityStatus("available");
//         setSuggestions([]);
//       } else {
//         setAvailabilityStatus("unavailable");
//         setSuggestions(data.suggestions || []);
//       }
//     } catch (err) {
//       console.error("Username check failed:", err);
//     }
//   };

//   const handleSuggestionClick = (sugg) => {
//     onChange({
//       target: {
//         name: "username",
//         value: sugg,
//         type: "text",
//       },
//     });

//     setShowCheckBtn(sugg.length === 10);
//     setAvailabilityStatus(null);
//     setShowModal(false);
//   };

//   return (
//     <>
//       <InputGroup className="mb-2">
//         <InputGroup.Text style={{ fontWeight: "bold" }}>User Name</InputGroup.Text>
//         <Form.Control
//           aria-label="User Name"
//           name="username"
//           type="text"
//           value={value}
//           onClick={openModal}
//           readOnly
//           disabled={disabled}
//         />
//       </InputGroup>

//       <Modal show={showModal} onHide={closeModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Choose a Username</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Control
//             aria-label="User Name"
//             name="username"
//             type="text"
//             maxLength={10}
//             value={value}
//             onChange={handleInputChange}
//             autoFocus
//           />
//           <div className="d-flex flex-row mt-2">
//             {availabilityStatus === "available" && (
//               <div style={{ color: "green" }}>✅ Username is available!</div>
//             )}
//             {showCheckBtn && (
//               <div className="ms-auto">
//                 <Button variant="outline-primary" size="sm" onClick={checkUsername}>
//                   Check Availability
//                 </Button>
//               </div>
//             )}
//           </div>

//           {availabilityStatus === "unavailable" && (
//             <div className="mt-2" style={{ color: "red" }}>
//               ❌ Username taken. Try:{" "}
//               {suggestions.map((sugg, index) => (
//                 <span
//                   key={index}
//                   style={{
//                     marginRight: "8px",
//                     cursor: "pointer",
//                     textDecoration: "underline",
//                   }}
//                   onClick={() => handleSuggestionClick(sugg)}
//                 >
//                   {sugg}
//                 </span>
//               ))}
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={closeModal}>
//             Cancel
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default UsernameInput;

import React, { useState } from "react";
import { InputGroup, Form, Button, Modal } from "react-bootstrap";
import { GoVerified } from "react-icons/go";


const UsernameInput = ({ value, onChange, disabled, readOnly }) => {
    const [showModal, setShowModal] = useState(false);
    const [tempValue, setTempValue] = useState(value || "");
    const [showCheckBtn, setShowCheckBtn] = useState(false);
    const [availabilityStatus, setAvailabilityStatus] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [isUsernameConfirmed, setIsUsernameConfirmed] = useState(false);

    const openModal = () => {
        if (!disabled && !readOnly) {
            setTempValue(value || "");
            setAvailabilityStatus(null);
            setIsUsernameConfirmed(false); // Reset confirmation when editing
            setShowModal(true);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setTempValue(""); // Reset the temp value
        setAvailabilityStatus(null);
        setSuggestions([]);
    };

    const handleInputChange = (e) => {
        const input = e.target.value;
        setTempValue(input);
        setShowCheckBtn(input.length >= 3);
        setAvailabilityStatus(null);
    };

    const checkUsername = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/user/check-username`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: tempValue }),
            });
            const data = await res.json();

            if (data.available) {
                onChange({
                    target: {
                        name: "username",
                        value: tempValue,
                        type: "text",
                    },
                });
                setIsUsernameConfirmed(true);
                closeModal();
            } else {
                setAvailabilityStatus("unavailable");
                setSuggestions(data.suggestions || []);
            }
        } catch (err) {
            console.error("Username check failed:", err);
        }
    };

    const handleSuggestionClick = (sugg) => {
        onChange({
            target: {
                name: "username",
                value: sugg,
                type: "text",
            },
        });
        setIsUsernameConfirmed(true);
        closeModal();
    };

    return (
        <>
            <div className="position-relative mb-2">
                <InputGroup className="mb-2 align-items-center">
                    <InputGroup.Text style={{ fontWeight: "bold" }}>User Name</InputGroup.Text>
                    <Form.Control
                        aria-label="User Name"
                        name="username"
                        type="text"
                        value={value}
                        onClick={openModal}
                        readOnly
                        disabled={disabled}
                    />
                    {isUsernameConfirmed && (
                        //   <span style={{ color: "green", marginLeft: "8px" }}>✅</span>

                        <GoVerified
                            className="position-absolute"
                            style={{
                                right: 10,
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "green",
                            }}
                        />
                    )}
                </InputGroup>
            </div>

            <Modal show={showModal} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Choose a Username</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        maxLength={10}
                        value={tempValue}
                        onChange={handleInputChange}
                        autoFocus
                    />
                    <div className="d-flex flex-row mt-2">
                        {availabilityStatus === "available" && (
                            <div style={{ color: "green" }}>✅ Username is available!</div>
                        )}
                        {showCheckBtn && (
                            <div className="ms-auto">
                                <Button variant="outline-primary" size="sm" onClick={checkUsername}>
                                    Check Availability
                                </Button>
                            </div>
                        )}
                    </div>

                    {availabilityStatus === "unavailable" && (
                        <div className="mt-2" style={{ color: "red" }}>
                            ❌ Username taken. Try:{" "}
                            {suggestions.map((sugg, index) => (
                                <span
                                    key={index}
                                    style={{
                                        marginRight: "8px",
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                    }}
                                    onClick={() => handleSuggestionClick(sugg)}
                                >
                                    {sugg}
                                </span>
                            ))}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UsernameInput;



