import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaWhatsapp, FaFacebook, FaTwitter, FaLink } from "react-icons/fa";

const ShareModal = ({ post, show, handleClose }) => {
  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=Check out this post: ${window.location.origin}/posts/${post._id}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/posts/${post._id}`,
    twitter: `https://twitter.com/intent/tweet?text=Check out this post: ${window.location.origin}/posts/${post._id}`,
    copy: `${window.location.origin}/posts/${post._id}`, // For copy to clipboard
  };

  const handleShare = (platform) => {
    if (platform === "copy") {
      navigator.clipboard.writeText(shareLinks.copy);
      alert("Link copied to clipboard!");
    } else {
      window.open(shareLinks[platform], "_blank");
    }
    // After sharing, send API request to backend
    updateShareCount();
  };

  const updateShareCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated.");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/posts/${post._id}/share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update share count.");
      }
      console.log("Share count updated successfully!");
    } catch (error) {
      console.error("Error updating share count:", error.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Share this Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button
          variant="outline-success"
          className="mb-2"
          onClick={() => handleShare("whatsapp")}
        >
          <FaWhatsapp /> WhatsApp
        </Button>
        <Button
          variant="outline-primary"
          className="mb-2"
          onClick={() => handleShare("facebook")}
        >
          <FaFacebook /> Facebook
        </Button>
        <Button
          variant="outline-info"
          className="mb-2"
          onClick={() => handleShare("twitter")}
        >
          <FaTwitter /> Twitter
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => handleShare("copy")}
        >
          <FaLink /> Copy Link
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ShareModal;
