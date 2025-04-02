import { useRef } from "react";
import html2canvas from "html2canvas";
import { Button } from "react-bootstrap"; // Change if using another UI library
import { useNavigate } from "react-router-dom";
import { IoHome } from "react-icons/io5";

const ConferencePass = ({ participant, selectedConference }) => {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const placeholderImage = "/pas.webp";

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
      link.download = `${participant.fullName}_IDCard.webp`;
      link.click();
    } catch (error) {
      console.error("Error downloading card as image:", error);
    }
  };

  return (
    <>
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
          backgroundImage: `url(${placeholderImage})`,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* User Image */}
        <div
          style={{
            width: "100px",
            height: "100px",
            margin: " auto",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid #000",
          }}
        >
          {participant?.userImage ? (
            <img
              src={participant.userImage}
              alt="Participant"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ textAlign: "center", lineHeight: "100px" }}>No Image</div>
          )}
        </div>

        {/* Participant Info */}
        <h5 className="bg-primary text-white mt-2">
          {participant.fullName} <span className="ms-2">{participant.bloodGroup}</span>
        </h5>
        <div className="crd-detail">
          <p>
            <strong>Mobile:</strong> {participant.phone}
          </p>
          <p>
            <strong>Occupation:</strong> {participant.occupation}
          </p>
        </div>

        {/* Organization Info */}
        <div className="mb-2">
          <h4 className="pt-2 m-0">BSREM</h4>
          <span className="mt-0" style={{ fontWeight: "bold" }}>
            "To Unite, Awaken & Strengthen."
          </span>
        </div>

        {/* Conference Info */}
        <h4 className="bg-primary text-white pb-1 m-0">Conference Pass</h4>
        <span> Venue: </span><br/>
        <span style={{ fontWeight: "bold" }}>
          {selectedConference.venue}, {selectedConference.place} <br/>
           Date:{" "}
          {new Date(selectedConference.date).toLocaleDateString()} - {selectedConference.time}
        </span>
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-between">
        <Button onClick={downloadAsImage}>Download Pass</Button>
        <Button onClick={() => navigate("/dashboard")}>
          Back to <IoHome />
        </Button>
      </div>
    </>
  );
};

export default ConferencePass;
