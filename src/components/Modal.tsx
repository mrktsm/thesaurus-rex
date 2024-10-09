// src/components/Modal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string; // You can customize this as needed
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null; // Don't render anything if the modal is not open

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Selected Text</h2>
        <p>{content}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
