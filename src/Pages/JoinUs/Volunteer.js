// import React, { useRef, useEffect, useState } from "react";
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import InputGroup from 'react-bootstrap/InputGroup';
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";


// const Voluntear = () => {
//   const cardRef = useRef(null); 



//   useEffect



//   return (    
// <>

//     <div>
//       <h2 className="text-center">Welcome Volunteer</h2>
//       <h4 className="text-center" style={{marginTop:"10px"}} > You can download the ID from here </h4>


//     </div>
//     <div style={{width:"450px"}}>
//       <InputGroup className="mb-3">
//         <Form.Control
//           placeholder="Recipient's username"
//           aria-label="Recipient's username"
//           aria-describedby="basic-addon2"
//         />
//         <Button variant="outline-secondary" id="button-addon2">
//           Button
//         </Button>
//       </InputGroup>
//     </div>

//     </>



//   );
// };

// export default Voluntear;


import React, { useRef, useEffect, useState } from "react";
import {Button, Spinner} from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import VolunteerPDF from "./VolunteerPDF";
//import { display } from "html2canvas/dist/types/css/property-descriptors/display";
import { handleSuccess, handleError, handleWarning } from '../../Components/Util';
import { ToastContainer } from "react-toastify";



const Voluntear = () => {
  const cardRef = useRef(null); // Reference for ID card
  const pdfRef = useRef(null); // Reference for PDF content
  const placeholderImage = "/backcCP.png";
  
  const placeholderImageA4 = "/A4.png";

  const leftImg = "/logo192.webp";
  const rtImg = "/om.webp";
  const targetRef = useRef(null);
  const [loading, setLoading] = useState(false);




  const [formData, setFormData] = useState({
    email: "",
    password: "",
    updateFullName: "",
    username: "",
    mobile: "",
    dob: "",
    age: "",
    gender: "",
    joiningFor: "",
    bloodGroup: "",
    occupation: "",
    moreAboutOccupation: "",
    address: '',
    origin: '',
    city: '',
    district: '',
    state: '',
    PIN: '',
    country: '',
    qualification: "",
    giveAterJoin: "",
    userImage: "",
    agreedTerms: false,
    organizationName: "BSREM",
    motto: "To Unite, Awaken and Strengthen the Sanatan Followers.",
  });




  useEffect(() => {

    // Load volunteer details from localStorage
    try {
      // Retrieve user data from localStorage
      const user = localStorage.getItem("volunteer");
      if (user) {
        const parsedUser = JSON.parse(user); // Parse the JSON string
        // if (!parsedUser.userImage) {
        //   console.log("no User Image");

        // }else{
        // const image = parsedUser.userImage;
        //   selectedImage(image)
        // }

        console.log("User", parsedUser);

        // Update formData with the retrieved user data
        setFormData((prevData) => ({
          ...prevData,
          ...parsedUser, // Merge parsed user data into formData

        }));
      }

    } catch (error) {
      console.error('Error fetching user data:', error);
      // Redirect to login on error      
    }
  }, []);

  // Function to download as an image
  const downloadAsImage = async () => {
    try {
      const scale = 2; // Increase resolution
      const canvas = await html2canvas(cardRef.current, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/webp", 0.8);
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${formData.username}_IDCard.webp`;
      link.click();
    } catch (error) {
      console.error("Error downloading card as image:", error);
    }
  };

  // Function to download as a PDF
  const downloadAsPDF = async () => {
    try {
      const scale = 2; // Increase resolution
      const canvas = await html2canvas(cardRef.current, {
        scale: scale,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/webp");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / scale, canvas.height / scale],
      });

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        canvas.width / scale,
        canvas.height / scale
      );

      pdf.save(`${formData.username}_IDCard.pdf`);
    } catch (error) {
      console.error("Error downloading card as PDF:", error);
    }
  };

  const downloadIDCard = async () => {
    try {
      const scale = 2; // Scale factor for higher resolution
      const cardElement = cardRef.current;

      // Create a high-resolution canvas
      const canvas = await html2canvas(cardElement, {
        scale: scale, // Scale up the canvas
        useCORS: true, // Handle cross-origin images
        allowTaint: true, // Allow images from different origins
      });

      const imgData = canvas.toDataURL("image/png");

      // Create PDF with the same aspect ratio as the card
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / scale, canvas.height / scale],
      });

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        canvas.width / scale, // Scale down to fit
        canvas.height / scale
      );

      pdf.save(`${formData.username}_IDCard.pdf`);
    } catch (error) {
      console.error("Error generating high-quality PDF:", error);
    }
  };




  const downloadPDF = async () => {
    const scale = 2; // Increases resolution for better quality
    const canvas = await html2canvas(pdfRef.current, {
      scale: scale,
      useCORS: true // Ensures external images load correctly
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("portrait", "mm", "a4"); // Use "mm" for precise sizing
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${formData.username}_Details.pdf`);
  };

  const scrollToSection = () => {
    // scroll down also set as alert for now
    //targetRef.current.scrollIntoView({ behavior: "smooth" });
    handleError("Detailed Pdf section disable for now");
  };

  const imagePreview = placeholderImage;
  const imagePreviewA4 = placeholderImageA4;


  if (loading) {
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
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <>
    <div>
      <h2 className="text-center">Welcome {formData.username}</h2>
      <h4 className="text-center hw" style={{ marginTop: "10px" }}>
        You can download your ID card or detailed PDF here
      </h4>

      {/* ID Card Section */}
      <div
        ref={cardRef}
        style={{
          width: "300px",
          height: "400px",
          margin: "20px auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          textAlign: "center",
          backgroundImage: `url(${imagePreview})`,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="brand-card">
          <div className="img-container big">
            <img src={leftImg} alt="brand" />
          </div>
          <div className="text-container">
            <h3>{formData.organizationName}</h3>
          </div>
          <div className="small">
            <img src={rtImg} alt="brand" />
          </div>
        </div>


        <p style={{ fontStyle: "italic" }}>{formData.motto}</p>
        <div
          style={{
            width: "100px",
            height: "100px",
            margin: "10px auto",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid #000",
          }}
        >
          {formData.userImage ? (
            <img
              src={formData?.userImage}
              alt="Volunteer"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ textAlign: "center", lineHeight: "100px" }}>
              No Image
            </div>
          )}
        </div>
        <h4>{formData.username}</h4>
        <div className="crd-detail">
          <p ><strong>Mobile: </strong> {`+${formData.mobile}`}</p>
          <p className="bC"><strong>Blood Gr. :</strong> {formData.bloodGroup} <strong> City : </strong> {formData.city} </p>
          <p> <strong> Ocopation: </strong>  {formData.occupation}</p>
        </div>


      </div>

      <div className="text-center d-flex justify-content-center align-items-center">      

        <Button
          disabled
          variant="primary" 
          className="p-2 m-1"         
        >
          Download as
        </Button>
        <Button
          onClick={downloadAsImage}
          variant="outline-primary" 
          className="p-2 m-1"         
        >
          Image
        </Button>
        <Button
        className="p-2 m-1"
          onClick={downloadAsPDF}
          variant="outline-secondary"
        >
         PDF
        </Button>

        <Button onClick={scrollToSection}
            variant="outline-success" 
            className="p-2 m-1"           
          >
            Volunteer Details PDF
          </Button>
      </div>

      {/* Detailed PDF Section display set to none for now */}

      {/* <div className="d-flex justify-content-center align-items-center flex-column" style={{display: "none"}}>
        
        {/* PDF Preview *
        <div ref={targetRef} style={{ marginTop: "100px" }}>
          <PDFViewer className="viwer" style={{
            width: "100%",
            height: "500px",
            transformOrigin: "top center",  // Keeps the document centered
          }}>
            <VolunteerPDF formData={formData} imagePreviewA4={imagePreviewA4} />
          </PDFViewer>
        </div>

        {/* Download Button *
        <div style={{ marginTop: "20px" }}>
          <PDFDownloadLink
            document={<VolunteerPDF formData={formData} imagePreviewA4={imagePreviewA4} />}
            fileName={`${formData.username}_Details.pdf`}
          >
            
              
            
            {({ loading }) => (
              <button style={{ padding: "10px", backgroundColor: "green", color: "white" }}>
                {loading ? "Generating PDF..." : "Download PDF"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      </div> */}

      <div style={{ marginTop: "20px", margin: "50px" }}>
        <p className="m-5">ppppp</p>

      </div>
      
    </div>
    <ToastContainer/>
    </>
  );
};

export default Voluntear;

