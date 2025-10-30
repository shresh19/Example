import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import './AddItemForm.css';

const AddItemForm = ({ placeholder, buttonText, onAdd }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim().length < 2) {
            setError('Name must be at least 2 characters.');
            return;
        }
        setError(null);
        onAdd(name.trim());
        setName('');
    };

    return (
        <form onSubmit={handleSubmit} className="addItemFormCard">
            <h3 className="formTitle">{buttonText}</h3>
            <div className="inputGroup">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setError(null); }}
                    placeholder={placeholder}
                    required
                />
                <button type="submit" className="button button-primary">
                    <Plus />
                    {buttonText.split(' ')[2] || 'Add'}
                </button>
            </div>
            {error && <p className="errorText">{error}</p>}
        </form>
    );
};

export default AddItemForm;