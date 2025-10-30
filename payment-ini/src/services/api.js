const API_BASE_URL = "http://localhost:8080/api"; // Your Spring Boot backend URL

// Helper function for handling fetch responses
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText || response.statusText}`);
    }
    // Handle cases where the response might be empty (like DELETE returning 204 No Content)
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } else {
        return null; // Or response.text() if you expect text for non-JSON success
    }
};

// --- Batch API Calls ---

export const getBatches = () => {
    return fetch(`${API_BASE_URL}/batches`).then(handleResponse);
};

export const createBatch = (name) => {
    return fetch(`${API_BASE_URL}/batches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    }).then(handleResponse);
};

export const updateBatchName = (batchId, name) => {
    return fetch(`${API_BASE_URL}/batches/${batchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
    }).then(handleResponse);
};

export const deleteBatch = (batchId) => {
    return fetch(`${API_BASE_URL}/batches/${batchId}`, {
        method: 'DELETE',
    }).then(handleResponse);
};

export const initiatePayment = (batchId, paymentDetails) => {
    return fetch(`${API_BASE_URL}/batches/${batchId}/initiate-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentDetails),
    }).then(handleResponse);
};

// --- Employee API Calls ---

export const getEmployees = () => {
    return fetch(`${API_BASE_URL}/employees`).then(handleResponse);
};

export const addEmployee = (employeeData) => {
    return fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employeeData),
    }).then(handleResponse);
};

export const deleteEmployee = (employeeId) => {
    return fetch(`${API_BASE_URL}/employees/${employeeId}`, {
        method: 'DELETE',
    }).then(handleResponse);
};

export const assignEmployeeToBatch = (employeeId, batchId) => {
    return fetch(`${API_BASE_URL}/employees/${employeeId}/assign/${batchId}`, {
        method: 'PUT',
    }).then(handleResponse);
};

export const unassignEmployee = (employeeId) => {
    return fetch(`${API_BASE_URL}/employees/${employeeId}/unassign`, {
        method: 'PUT',
    }).then(handleResponse);
};

export const bulkUploadEmployees = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return fetch(`${API_BASE_URL}/employees/bulk-upload`, {
        method: 'POST',
        body: formData, // No 'Content-Type' header needed for FormData; browser sets it
    }).then(handleResponse);
};


// --- Bank Account API Calls ---

export const getBankAccounts = () => {
    return fetch(`${API_BASE_URL}/bank-accounts`).then(handleResponse);
};