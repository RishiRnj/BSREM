import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import "./Admin.css";
import { Button, InputGroup, Form, Row, Col, Card } from "react-bootstrap";
import { handleWarning } from "../Components/Util";
import * as XLSX from 'xlsx';  // Import SheetJS
import NoteInput from "./NoteInput";
import AmountInput from "./AmountInput";

const AdminDashboardToHandleBeneficiary = () => {
    const [pendingBeneficiaries, setPendingBeneficiaries] = useState([]);
    const [allBeneficiaries, setallBeneficiaries] = useState([]);
    const [noteByVerifier, setNoteByVerifier] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // Manage button disabled state
    const [isNoteButtonDisabled, setIsNoteButtonDisabled] = useState(false); // Manage button disabled state
    const [notes, setNotes] = useState({});  // Object to hold notes for each beneficiary
    const [exAmount, setExAmount] = useState({});  // Object to hold notes for each beneficiary



    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/beneficiary/pending-beneficiaries`)
            .then((res) => res.json())
            .then((data) => setPendingBeneficiaries(data.pendingBeneficiaries))
            .catch((err) => console.error("Error fetching beneficiaries:", err));
        console.log("bene from admin", pendingBeneficiaries);

    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/beneficiary/beneficiaries`)
            .then((res) => res.json())
            .then((data) => setallBeneficiaries(data))
            .catch((err) => console.error("Error fetching beneficiaries:", err));
        console.log("bene from admin all", [allBeneficiaries]);

    }, []);

    const handleVerify = (id, status) => {
        fetch(`${process.env.REACT_APP_API_URL}/api/beneficiary/verify-beneficiary/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ verificationStatus: status }),
        })
            .then((res) => res.json())
            .then(() => {
                setPendingBeneficiaries((prev) => prev.filter((b) => b._id !== id));
                alert(`Beneficiary ${status} successfully.`);
            })
            .catch((err) => console.error("Error updating beneficiary:", err));
    };

 

    // Handle Note Change
    const handleNoteChange = (id, value) => {
        setNotes((prevNotes) => ({
            ...prevNotes,
            [id]: value,
        }));
    };

    // Handle Amount Change
    const handleAmountChange = (id, value) => {
        setExAmount((prevAmount) => ({
            ...prevAmount,
            [id]: value,
        }));
    };


    // const handleAddVerifierNote = async (id, note) => {
    //     if (!note || note === "") {
    //         handleWarning("Note Must be Entered!")
    //         return;
    //     }
    //     try {
    //         const response = await fetch(`${process.env.REACT_APP_API_URL}/api/beneficiary/addNote/byVerifier/${id}`, {
    //             method: "PUT",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ noteByVerifier: note }),
    //         });

    //         const data = await response.json();
    //         if (response.ok) {
    //             alert(data.message); // Notify the user about the success
    //             setNoteByVerifier(""); // Reset the input field after success
    //             setIsButtonDisabled(true); // Disable the button on success
    //         } else {
    //             alert(data.error); // Show error message if something goes wrong
    //         }
    //     } catch (error) {
    //         console.error("Error while adding verifier note:", error);
    //         alert("Error adding note. Please try again.");
    //     }
    // };

    // const handleAddVerifierNote = async (id, note) => {
    //     if (!note || note === "") {
    //         handleWarning("Note Must be Entered!");
    //         return;
    //     }
    //     try {
    //         const response = await fetch(`${process.env.REACT_APP_API_URL}/api/beneficiary/addNote/byVerifier/${id}`, {
    //             method: "PUT",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ noteByVerifier: note }),
    //         });

    //         const data = await response.json();
    //         if (response.ok) {
    //             alert(data.message); // Notify the user about the success
    //             setNotes((prevNotes) => ({ ...prevNotes, [id]: "" }));  // Clear the note for this beneficiary
    //             setIsButtonDisabled(true); // Disable the button on success
    //         } else {
    //             alert(data.error); // Show error message if something goes wrong
    //         }
    //     } catch (error) {
    //         console.error("Error while adding verifier note:", error);
    //         alert("Error adding note. Please try again.");
    //     }
    // };
    // const handleAddExAmount = async (id, exAmount) => {
    //     if (!exAmount || exAmount === "") {
    //         handleWarning("Note Must be Entered!");
    //         return;
    //     }
    //     try {
    //         const response = await fetch(`${process.env.REACT_APP_API_URL}/api/beneficiary/addNote/byVerifier/${id}`, {
    //             method: "PUT",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify({ expectedAmountOfMoney: exAmount }),
    //         });

    //         const data = await response.json();
    //         if (response.ok) {
    //             alert(data.message); // Notify the user about the success
    //             setExAmount((prevNotes) => ({ ...prevNotes, [id]: "" }));  // Clear the note for this beneficiary
    //             setIsButtonDisabled(true); // Disable the button on success
    //         } else {
    //             alert(data.error); // Show error message if something goes wrong
    //         }
    //     } catch (error) {
    //         console.error("Error while adding verifier note:", error);
    //         alert("Error adding note. Please try again.");
    //     }
    // };

    const handleAddField = async (id, field, value) => {
        if (!value || value === "") {
            handleWarning(`${field} must be entered!`);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/beneficiary/addNote/byVerifier/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ [field]: value }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);  // Notify the user about the success
                if (field === "expectedAmountOfMoney") {
                    setExAmount((prevAmount) => ({ ...prevAmount, [id]: "" }));
                    setIsButtonDisabled(true);  // Disable the button on success
                }
                
            } else {
                alert(data.error);  // Show error message if something goes wrong
            }
        } catch (error) {
            console.error(`Error while adding ${field}:`, error);
            alert(`Error adding ${field}. Please try again.`);
        }
    };
    const handleAddNoteField = async (id, field, value) => {
        if (!value || value === "") {
            handleWarning(`${field} must be entered!`);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/beneficiary/addNote/byVerifier/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ [field]: value }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);  // Notify the user about the success
                // Clear the input for this beneficiary
                if (field === "noteByVerifier") {
                    setNotes((prevNotes) => ({ ...prevNotes, [id]: "" }));
                    setIsNoteButtonDisabled(true)
                } 
            } else {
                alert(data.error);  // Show error message if something goes wrong
            }
        } catch (error) {
            console.error(`Error while adding ${field}:`, error);
            alert(`Error adding ${field}. Please try again.`);
        }
    };

    const downloadXLS = () => {
        const ws = XLSX.utils.json_to_sheet(allBeneficiaries);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Beneficiaries");

        // Download Excel file
        XLSX.writeFile(wb, `All Beneficiaries.xlsx`);
    };




    return (
        <>

            <h1 className="text-center">Admin Dashboard</h1>

            <>

                {pendingBeneficiaries.map((b, i) => (
                    <Row key={b._id || i} className="p-2 px-5 mb-2">
                        <div>
                            <Row className="border border-dark">
                                <Col xs={12} sm={6} md={3} lg={3}>
                                    <strong> Name: </strong> {b?.username || b?.updateFullName}
                                </Col>
                                <Col xs={12} sm={6} md={3} lg={3}>
                                    <strong> Email </strong> {b.email}
                                </Col>
                                <Col xs={12} sm={6} md={3} lg={3}>
                                    <strong> Apply For </strong> {b?.applyFor}
                                </Col>
                                <Col xs={12} sm={6} md={3} lg={3}>
                                    <strong>
                                        <Link to={`/beneficiary/${b._id}`}>See Full Details</Link>
                                    </strong>
                                </Col>
                            </Row>

                            <Row className="border border-dark p-2">
                                <Col>
                                    {/* <InputGroup className="me-3">
                                        <Form.Control
                                            value={notes[b._id] || ""}  // Get the note for the specific beneficiary
                                            disabled={b?.noteByVerifier || isButtonDisabled}
                                            onChange={(e) => handleNoteChange(b._id, e.target.value)}  // Update note for this beneficiary
                                            placeholder="Enter On-field Reference Note"
                                            aria-label="Enter On-field Reference Note"
                                            aria-describedby="basic-addon2"
                                            isInvalid={!notes[b._id] && !isButtonDisabled}  // Conditionally apply invalid style for this beneficiary
                                        />
                                        <Button
                                            disabled={b?.noteByVerifier || isButtonDisabled || !notes[b._id]}  // Disable if note is empty for this beneficiary
                                            variant="outline-secondary"
                                            id="button-addon2"
                                            onClick={() => handleAddField(b._id, "noteByVerifier", notes[b._id])}  // Pass specific note to the function
                                        >
                                            Add Note
                                        </Button>
                                        <Form.Control.Feedback type="invalid">
                                            Note must be entered!
                                        </Form.Control.Feedback>
                                    </InputGroup> */}

                                    <NoteInput
                                        beneficiaryId={b._id}
                                        note={notes[b._id]}
                                        isDisabled={b?.noteByVerifier || isNoteButtonDisabled}
                                        onNoteChange={handleNoteChange}
                                        onAddNote={handleAddNoteField}
                                    />
                                </Col>

                                <Col sm={4}>
                                    {/* <InputGroup className="me-3">
                                        <Form.Control
                                            value={exAmount[b._id] || ""}  // Get the note for the specific beneficiary
                                            disabled={b?.expectedAmountOfMoney || isButtonDisabled}
                                            onChange={(e) => handleAmountChange(b._id, e.target.value)}  // Update expected amount for this beneficiary
                                            placeholder="Enter Expected Amount"
                                            aria-label="Enter Expected Amount"
                                            aria-describedby="basic-addon2"
                                            isInvalid={!exAmount[b._id] && !isButtonDisabled}  // Conditionally apply invalid style for this beneficiary
                                        />
                                        <Button
                                            disabled={b?.expectedAmountOfMoney || isButtonDisabled || !exAmount[b._id]}  // Disable if amount is empty for this beneficiary
                                            variant="outline-primary"
                                            id="button-addon2"
                                            onClick={() => handleAddField(b._id, "expectedAmountOfMoney", exAmount[b._id])}  // Pass specific amount to the function
                                        >
                                            Add Expected Amount
                                        </Button>
                                        <Form.Control.Feedback type="invalid">
                                            Expected Amount must be entered!
                                        </Form.Control.Feedback>
                                    </InputGroup> */}
                                    <AmountInput
                                        beneficiaryId={b._id}
                                        amount={exAmount[b._id]}
                                        isDisabled={b?.expectedAmountOfMoney  || isButtonDisabled}
                                        onAmountChange={handleAmountChange}
                                        onAddAmount={handleAddField}

                                    />
                                </Col>


                                <Col xs lg="2">
                                    <div className="d-flex justify-content-center">
                                        <div>
                                            <Button size="" className="me-2" onClick={() => handleVerify(b._id, "approved")}>Approve</Button>

                                        </div>
                                        <div>
                                            <Button size="" className="ms-2" onClick={() => handleVerify(b._id, "rejected")}>Reject</Button>

                                        </div>
                                    </div>

                                </Col>
                            </Row>
                        </div>

                        {/* <div className="mt-4 pt-3">
                            {/* <div className="d-flex justify-content-center pt-2"> *
                            


                            <InputGroup className="me-3">
                                <Form.Control
                                    value={notes[b._id] || ""}  // Get the note for the specific beneficiary
                                    disabled={b?.noteByVerifier || isButtonDisabled}
                                    onChange={(e) => handleNoteChange(b._id, e.target.value)}  // Update note for this beneficiary
                                    placeholder="Enter On-field Reference Note"
                                    aria-label="Enter On-field Reference Note"
                                    aria-describedby="basic-addon2"
                                    isInvalid={!notes[b._id] && !isButtonDisabled}  // Conditionally apply invalid style for this beneficiary
                                />
                                <Button
                                    disabled={b?.noteByVerifier || isButtonDisabled || !notes[b._id]}  // Disable if note is empty for this beneficiary
                                    variant="outline-secondary"
                                    id="button-addon2"
                                    onClick={() => handleAddVerifierNote(b._id, notes[b._id])}  // Pass specific note to the function
                                >
                                    Add Note
                                </Button>
                                <Form.Control.Feedback type="invalid">
                                    Note must be entered!
                                </Form.Control.Feedback>
                            </InputGroup>


                            <Button size="sm" className="me-2" onClick={() => handleVerify(b._id, "approved")}>Approve</Button>
                            <Button size="sm" className="ms-2" onClick={() => handleVerify(b._id, "rejected")}>Reject</Button>
                        </div> */}
                    </Row>
                ))}

            </>




            <div>
                <h1 className="text-center">List of Beneficiaries</h1>
                {/* Render your beneficiaries list */}

                {allBeneficiaries.map((b, index) => (
                    <div className="px-5 p-2">

                        <Row key={b._id} className="d-flex justify-content-center  p-1 border border-dark" style={{ borderColor: "Highlight" }}>

                            <Col sm={3} md="auto" >
                                <strong> Sl.No: </strong>  {index + 1}
                            </Col>
                            <Col sm={3} md="auto" >
                                <strong> Name: </strong>  {b?.username || b?.updateFullName}
                            </Col>
                            <Col sm={3} md="auto" >
                                <strong> Email: </strong> {b?.email}

                            </Col>
                            <Col sm={3} md="auto" >
                                <strong> Income: </strong> {b?.familyIncome}

                            </Col>
                            <Col sm={3} md="auto" >
                                <strong> Apply For: </strong>  {b?.applyFor}
                            </Col>

                            <Col sm={3} md="auto" >
                                <strong> Status: </strong>  {b?.verificationStatus}
                            </Col>
                            <Col sm={3} md="auto" >
                                <strong> Donation Status: </strong>  {b?.donationStatus}
                            </Col>
                            <Col sm={3} md="auto" >
                                <strong>
                                    <Link to={`/beneficiary/${b._id}`}>See Full Details</Link>
                                </strong>
                            </Col>


                        </Row>

                    </div>





                ))}

                {/* Download Button */}
                <div className="text-center mt-3">
                    <Button onClick={downloadXLS} variant="success">
                        Download XLS
                    </Button>
                </div>

            </div>




        </>
    );
};

export default AdminDashboardToHandleBeneficiary;
