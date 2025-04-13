// src/components/Common/ConfirmationModal.js
import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "OK", 
  cancelText = "Cancel" 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-con-overlay">
      <div className="modal-con-container">
        <div className="modal-con-header">
          <h3>{title}</h3>
        </div>
        <div className="modal-con-body">
          <p>{message}</p>
        </div>
        <div className="modal-con-footer">
          <button className="btn-cancel" onClick={onClose}>
            {cancelText}
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;