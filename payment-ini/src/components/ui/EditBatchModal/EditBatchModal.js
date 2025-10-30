import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import './EditBatchModal.css';

const EditBatchModal = ({ isOpen, batch, onConfirm, onClose }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        if (batch) {
            setName(batch.name);
            setError(null);
        }
    }, [batch]);

    if (!isOpen || !batch) return null;

    const handleSubmit = () => {
        if (name.trim().length < 2) {
            setError('Name must be at least 2 characters.');
            return;
        }
        setError(null);
        onConfirm(batch.id, name.trim());
    };

    return (
        <div className="editModalOverlay">
            <div className="editModalContent">
                <div className="modalHeader">
                    <h3 className="modalTitle">Edit Batch Name</h3>
                    <button onClick={onClose} className="closeButton">
                        <X />
                    </button>
                </div>
                <div className="editModalBody">
                    <label htmlFor="batchName">Batch Name</label>
                    <input
                        type="text"
                        id="batchName"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setError(null); }}
                        placeholder="Enter new batch name"
                    />
                    {error && <p className="errorText">{error}</p>}
                </div>
                <div className="modalFooter">
                    <button
                        onClick={onClose}
                        className="button button-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="button button-primary"
                    >
                        <Check />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditBatchModal;