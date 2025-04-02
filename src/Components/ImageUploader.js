import React, { useState, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { FaCamera } from "react-icons/fa";

const ImageUploader = ({ onImageUpload, defaultImage  }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cropperRef = useRef(null);

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setCroppedImage(null);
      setIsModalOpen(true);
    }
  };

  // Handle cropping
  const handleCrop = () => {
    const cropperInstance = cropperRef.current?.cropper;
    if (cropperInstance) {
      const croppedData = cropperInstance.getCroppedCanvas({
        width: 400,
        height: 400,
      }).toDataURL();
      setCroppedImage(croppedData);
      setSelectedImage(null);
      setIsModalOpen(false);
      onImageUpload(croppedData); // Send cropped image to parent
      console.log("img", croppedData);
      
    }
  };

  const imagePreview = croppedImage || selectedImage || defaultImage;

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="image-upload-container">
        {/* Image Preview / Placeholder */}
        <div
          onClick={() => document.getElementById("imageInput").click()}
          style={{
            cursor: "pointer",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            border: "1px dashed gray",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: `url(${imagePreview})`,
          }}
        >
          <FaCamera
            size={24}
            color="LightGray"
            style={{
              position: "relative",
              top: "42%",
              left: "55%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>

        {/* Hidden File Input */}
        <input
          id="imageInput"
          type="file"
          name="userImage"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      </div>

      {/* Modal for Cropping */}
      {selectedImage && isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "90%",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            <h5>Crop Image</h5>
            <Cropper
            className="join-crop"
              src={selectedImage}
              style={{ width: "100%", height: "auto" }}
              initialAspectRatio={1}
              aspectRatio={1}
              guides={false}
              background={true}
              rotatable={true}
              dragMode="move"
              ref={cropperRef}
            />
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={handleCrop}
                style={{
                  marginRight: "10px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  backgroundColor: "gray",
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
