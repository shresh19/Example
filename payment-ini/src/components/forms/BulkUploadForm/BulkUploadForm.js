import React, { useState } from 'react';
import { Upload, FileText, Loader } from 'lucide-react';
// --- REMOVED xlsx import ---
import './BulkUploadForm.css';

const BulkUploadForm = ({ onBulkAdd }) => {
    const [fileName, setFileName] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Keep local loading state for UI feedback

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setFileName(null);
            setError(null);
            return;
        }

        // Basic validation for file type (optional, backend should also validate)
        if (!file.name.match(/\.(xlsx|csv)$/i)) {
            setError("Invalid file type. Please upload .xlsx or .csv");
            setFileName(file.name); // Show name even if invalid type
            e.target.value = null; // Clear input
            return;
        }

        setFileName(file.name);
        setError(null);
        setIsLoading(true); // Indicate processing started

        // --- Pass the raw file object up ---
        // Wrap in a try-catch in case onBulkAdd throws an error immediately
        // (though async errors will be handled in PayrollDashboard)
        try {
             onBulkAdd(file); // Call the handler passed from PayrollDashboard
            // We don't reset state here immediately; PayrollDashboard will trigger a re-render
            // which should clear things if successful, or show an error.
        } catch (err) {
            setError(`Upload initiation failed: ${err.message}`);
            setIsLoading(false); // Stop loading on immediate error
        } finally {
             // Reset the file input so the same file can be selected again if needed
             e.target.value = null;
             // Let PayrollDashboard manage the loading state for the API call duration
             // For this component, we might want to stop the local loading indicator sooner
             // Or rely on the global loading state if PayrollDashboard sets it.
             // For simplicity, let's stop local loading after initiating.
             // The global loading state will handle the API call duration.
             setIsLoading(false);
        }
    };

    return (
        <div className="bulkUploadCard">
            <h3 className="formTitle">Bulk Upload Employees</h3>
            <p className="uploadHelpText">
                Upload an Excel (.xlsx) or CSV (.csv) file. A new batch will be created named after the file.
            </p>

            <input
                type="file"
                id="fileUpload"
                className="fileInput"
                accept=".xlsx, .csv"
                onChange={handleFileChange}
                disabled={isLoading} // Use local loading state for disabling input
            />
            <label htmlFor="fileUpload" className={`button fileInputLabel ${isLoading ? 'disabled' : ''}`}>
                {isLoading ? <Loader className="loader" /> : <Upload />}
                {isLoading ? 'Processing...' : (fileName || 'Choose a file...')}
            </label>

            {error && <p className="errorText">{error}</p>}

            <div className="formatInfo">
                 <p><FileText /> <b>Required File Format:</b></p>
                <p>The first row must be headers. Required headers are:</p>
                <ul>
                    <li><b>name</b> (or "Payee Name")</li>
                    <li><b>salaryAmount</b></li>
                    <li><b>bankDetails</b> (or "Beneficiary Details")</li>
                </ul>
                <p>Optional headers: <b>paymentRef</b>, <b>yourRef</b>, <b>notes</b></p>
            </div>
        </div>
    );
};

export default BulkUploadForm;