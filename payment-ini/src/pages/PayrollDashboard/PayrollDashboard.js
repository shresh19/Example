import React, { useState, useCallback, useEffect } from 'react';
// --- REMOVED mockData imports ---
import './PayrollDashboard.css';

// --- Import API Service ---
import * as api from '../../services/api';

// Import All Components (no changes here)
import LoadingState from '../../components/ui/LoadingState/LoadingState';
import ErrorState from '../../components/ui/ErrorState/ErrorState';
import Header from '../../components/ui/Header/Header';
import ConfirmModal from '../../components/ui/ConfirmModal/ConfirmModal';
import EditBatchModal from '../../components/ui/EditBatchModal/EditBatchModal';
import AddItemForm from '../../components/forms/AddItemForm/AddItemForm';
import BulkUploadForm from '../../components/forms/BulkUploadForm/BulkUploadForm';
import AddEmployeeForm from '../../components/forms/AddEmployeeForm/AddEmployeeForm';
import EmployeeList from '../../components/views/EmployeeList/EmployeeList';
import BatchList from '../../components/views/BatchList/BatchList';
import InitiatePaymentModal from '../../components/payment/InitiatePaymentModal/InitiatePaymentModal';

const PayrollDashboard = () => {
    // --- Initialize state with empty arrays and loading true ---
    const [batches, setBatches] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [bankAccounts, setBankAccounts] = useState([]); // Add state for bank accounts
    const [loading, setLoading] = useState(true); // Start in loading state
    const [error, setError] = useState(null);

    // (Modal states remain the same)
    const [modalState, setModalState] = useState({ isOpen: false, data: null, type: null, title: '', message: '' });
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [editModalState, setEditModalState] = useState({ isOpen: false, batch: null });

    // --- Fetch Initial Data ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [batchesData, employeesData, accountsData] = await Promise.all([
                api.getBatches(),
                api.getEmployees(),
                api.getBankAccounts() // Fetch bank accounts on load
            ]);
            // Sort batches by ID descending (newest first)
            setBatches(batchesData.sort((a, b) => b.id - a.id));
            setEmployees(employeesData);
            setBankAccounts(accountsData);
        } catch (err) {
            setError(`Failed to load data: ${err.message}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(); // Fetch data when component mounts
    }, [fetchData]); // Dependency array includes fetchData


    // --- CRUD Operations using API ---

    const addBatch = useCallback(async (name) => {
        setError(null);
        try {
            const newBatch = await api.createBatch(name);
            setBatches(prev => [newBatch, ...prev]); // Add new batch to the beginning
        } catch (err) {
            setError(`Failed to add batch: ${err.message}`);
            console.error(err);
        }
    }, []);

    const addEmployee = useCallback(async (employeeData) => {
        setError(null);
        try {
            // Ensure batchId is null if empty string before sending
            const dataToSend = {
                ...employeeData,
                batchId: employeeData.batchId === '' ? null : employeeData.batchId
            };
            const newEmployee = await api.addEmployee(dataToSend);
            setEmployees(prev => [newEmployee, ...prev]); // Add new employee
        } catch (err) {
            setError(`Failed to add employee: ${err.message}`);
            console.error(err);
        }
    }, []);

    const handleBulkAdd = useCallback(async (file) => {
        setLoading(true); // Indicate loading during upload
        setError(null);
        try {
            await api.bulkUploadEmployees(file);
            // After successful upload, refetch ALL data to get the new batch and employees
            await fetchData();
        } catch (err) {
            setError(`Bulk upload failed: ${err.message}`);
            console.error(err);
            setLoading(false); // Ensure loading is turned off on error
        }
        // setLoading(false) will be called by fetchData on success
    }, [fetchData]); // Depends on fetchData to refresh

    const assignEmployeeToBatch = useCallback(async (employeeId, batchId) => {
        setError(null);
        try {
            const updatedEmployee = await api.assignEmployeeToBatch(employeeId, batchId);
            setEmployees(prev => prev.map(emp =>
                emp.id === updatedEmployee.id ? updatedEmployee : emp
            ));
        } catch (err) {
            setError(`Failed to assign employee: ${err.message}`);
            console.error(err);
        }
    }, []);

    const unassignEmployeeFromBatch = useCallback(async (employeeId) => {
        setError(null);
        try {
            const updatedEmployee = await api.unassignEmployee(employeeId);
            setEmployees(prev => prev.map(emp =>
                emp.id === updatedEmployee.id ? updatedEmployee : emp
            ));
        } catch (err) {
            setError(`Failed to unassign employee: ${err.message}`);
            console.error(err);
        }
    }, []);

    // --- Payment Handlers using API ---

    const initiatePayment = useCallback((batch) => {
        // No API call needed here, just open the modal
        const batchEmployees = employees.filter(e => e.batchId === batch.id);
        if (batchEmployees.length === 0) {
            setError("Cannot initiate payment: No employees are assigned to this batch.");
            return;
        }
        setSelectedBatch(batch);
        setIsPaymentModalOpen(true);
        setError(null);
    }, [employees]); // Depend on employees state

    const handleConfirmInitiatePayment = useCallback(async (batch, paymentDetails) => {
        setIsPaymentProcessing(true);
        setError(null);
        try {
            const updatedBatch = await api.initiatePayment(batch.id, paymentDetails);
            // Update the specific batch in the state
            setBatches(prevBatches => prevBatches.map(b =>
                b.id === updatedBatch.id ? updatedBatch : b
            ));
            setIsPaymentModalOpen(false);
            setSelectedBatch(null);
        } catch (err) {
            setError(`Failed to initiate payment: ${err.message}`);
            console.error(err);
        } finally {
            setIsPaymentProcessing(false);
        }
    }, []);

    const handleDraftPayment = useCallback((batch, paymentDetails) => {
        // Currently, no backend endpoint for draft, just close modal
        console.log("Draft details:", paymentDetails);
        setIsPaymentModalOpen(false);
        setSelectedBatch(null);
        setError(null);
    }, []);

    // --- Delete Handlers using API ---

    const deleteBatch = useCallback((batch) => {
        const assignedCount = employees.filter(e => e.batchId === batch.id).length;
        setModalState({
            isOpen: true,
            type: 'delete_batch',
            data: batch,
            title: `Delete Batch: ${batch.name}`,
            message: `Are you sure you want to permanently delete the batch "${batch.name}"? This action will unassign ${assignedCount} employee(s).`
        });
    }, [employees]); // Depend on employees state

    const handleConfirmDeleteBatch = useCallback(async (batch) => {
        setError(null);
        try {
            await api.deleteBatch(batch.id);
            setBatches(prev => prev.filter(b => b.id !== batch.id));
            // Also update employees in state to reflect unassignment
            setEmployees(prev => prev.map(emp =>
                emp.batchId === batch.id ? { ...emp, batchId: null } : emp
            ));
            handleModalClose(); // Close modal on success
        } catch (err) {
            setError(`Failed to delete batch: ${err.message}`);
            console.error(err);
            // Optionally close modal even on error, or leave open
            // handleModalClose();
        }
    }, []);


    const deleteEmployee = useCallback((employee) => {
        setModalState({
            isOpen: true,
            type: 'delete_employee',
            data: employee,
            title: `Delete Employee: ${employee.name}`,
            message: `Are you sure you want to permanently delete the employee "${employee.name}"? This cannot be undone.`
        });
    }, []);

    const handleConfirmDeleteEmployee = useCallback(async (employee) => {
        setError(null);
        try {
            await api.deleteEmployee(employee.id);
            setEmployees(prev => prev.filter(emp => emp.id !== employee.id));
            handleModalClose(); // Close modal on success
        } catch (err) {
            setError(`Failed to delete employee: ${err.message}`);
            console.error(err);
        }
    }, []);

    // --- Edit Batch Handlers using API ---
     const handleOpenEditModal = useCallback((batch) => {
        setEditModalState({ isOpen: true, batch: batch });
    }, []);

    const handleCloseEditModal = useCallback(() => {
        setEditModalState({ isOpen: false, batch: null });
    }, []);

    const handleConfirmEditBatch = useCallback(async (batchId, newName) => {
        setError(null);
        try {
            const updatedBatch = await api.updateBatchName(batchId, newName);
            setBatches(prev =>
                prev.map(batch =>
                    batch.id === updatedBatch.id ? updatedBatch : batch
                )
            );
            handleCloseEditModal();
        } catch (err) {
            setError(`Failed to update batch name: ${err.message}`);
            console.error(err);
            // Decide if modal should stay open on error
        }
    }, [handleCloseEditModal]);


    // --- Modal Close Handlers (No API calls) ---

    const handleModalConfirm = () => {
        if (!modalState.data || !modalState.type) return;
        if (modalState.type === 'delete_batch') {
            handleConfirmDeleteBatch(modalState.data);
        } else if (modalState.type === 'delete_employee') {
            handleConfirmDeleteEmployee(modalState.data);
        }
    };

    const handleModalClose = () => {
        setModalState({ isOpen: false, data: null, type: null, title: '', message: '' });
    };

    const handlePaymentModalClose = () => {
        setIsPaymentModalOpen(false);
        setSelectedBatch(null);
        setIsPaymentProcessing(false); // Ensure this resets
    };


    // --- Render Logic ---
    if (loading) {
        return <LoadingState />; // Show loading state while fetching initial data
    }

    return (
        <div className="dashboard">
            <Header />

            {error && <ErrorState message={error} />}

            <div className="formGrid">
                <AddItemForm
                    placeholder="e.g., Q4 Marketing Team"
                    buttonText="Add New Batch"
                    onAdd={addBatch}
                />

                <BulkUploadForm onBulkAdd={handleBulkAdd} />

                <AddEmployeeForm
                    batches={batches}
                    onAdd={addEmployee}
                />
            </div>

            <div className="mainContentGrid">
                <div className="employeeListColumn">
                    <EmployeeList
                        employees={employees}
                        deleteEmployee={deleteEmployee} // Pass delete confirmation trigger
                        batches={batches}
                    />
                </div>

                <div className="batchListColumn">
                    <BatchList
                        batches={batches}
                        employees={employees}
                        deleteBatch={deleteBatch} // Pass delete confirmation trigger
                        assignEmployeeToBatch={assignEmployeeToBatch}
                        initiatePayment={initiatePayment}
                        onEditBatch={handleOpenEditModal}
                        unassignEmployee={unassignEmployeeFromBatch}
                    />
                </div>
            </div>

            {/* Modals remain the same, but now pass API bankAccounts */}
            <ConfirmModal
                isOpen={modalState.isOpen}
                title={modalState.title}
                message={modalState.message}
                onConfirm={handleModalConfirm} // Uses the combined confirm handler
                onClose={handleModalClose}
            />

            <EditBatchModal
                isOpen={editModalState.isOpen}
                batch={editModalState.batch}
                onConfirm={handleConfirmEditBatch} // Pass the API handler
                onClose={handleCloseEditModal}
            />

            <InitiatePaymentModal
                isOpen={isPaymentModalOpen}
                batch={selectedBatch}
                employees={employees.filter(e => e.batchId === selectedBatch?.id)}
                bankAccounts={bankAccounts} // Pass fetched bank accounts
                onConfirm={handleConfirmInitiatePayment} // Pass the API handler
                onDraft={handleDraftPayment}
                onClose={handlePaymentModalClose}
                isProcessing={isPaymentProcessing}
            />
        </div>
    );
};

export default PayrollDashboard;