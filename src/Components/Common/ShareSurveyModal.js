import React from 'react';
import { Modal } from 'react-bootstrap';
import {
  WhatsappShareButton, FacebookShareButton,
  TwitterShareButton, LinkedinShareButton,
  WhatsappIcon, FacebookIcon, TwitterIcon, LinkedinIcon
} from 'react-share';
import { FaLink } from 'react-icons/fa';

const ShareSurveyModal = ({ show, onHide, shareUrl }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      dialogClassName="custom-centered-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Share Survey</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Share this survey with others:</p>
        <div className="d-flex gap-2">
          <WhatsappShareButton url={shareUrl}><WhatsappIcon size={32} round /></WhatsappShareButton>
          <FacebookShareButton url={shareUrl}><FacebookIcon size={32} round /></FacebookShareButton>
          <TwitterShareButton url={shareUrl}><TwitterIcon size={32} round /></TwitterShareButton>
          <LinkedinShareButton url={shareUrl}><LinkedinIcon size={32} round /></LinkedinShareButton>

          <span
            title='Copy Link and Share URL'
            className='bg-dark'
            style={{
              cursor: 'pointer',
              backgroundColor: '#000',
              color: 'white',
              border: '1px solid #ccc',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={handleCopy}
          >
            <FaLink />
          </span>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ShareSurveyModal;
