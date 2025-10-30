import React from 'react';
import { X } from 'lucide-react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="confirmModalOverlay">
            <div className="confirmModalContent">
                <div className="modalHeader">
                    <h3 className="modalTitle">{title}</h3>
                    <button onClick={onClose} className="closeButton">
                        <X />
                    </button>
                </div>
                <p className="modalMessage">{message}</p>
                <div className="modalFooter">
                    <button
                        onClick={onClose}
                        className="button button-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="button button-danger"
                    >
                        Confirm Action
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;