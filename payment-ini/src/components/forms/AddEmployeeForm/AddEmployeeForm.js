import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import './AddEmployeeForm.css';

const AddEmployeeForm = ({ batches, onAdd }) => {
    const initialFormState = {
        name: '',
        salaryAmount: '',
        bankDetails: '',
        paymentRef: '',
        yourRef: '',
        notes: '',
        batchId: ''
    };

    const [employee, setEmployee] = useState(initialFormState);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (employee.name.trim().length < 2 || employee.salaryAmount.trim() === '' || employee.bankDetails.trim() === '') {
            setError('Payee Name, Salary Amount, and Beneficiary Details are required.');
            return;
        }
        
        const salary = parseFloat(employee.salaryAmount);
        if (isNaN(salary) || salary <= 0) {
            setError('Salary amount must be a valid positive number.');
            return;
        }

        const dataToSend = {
            ...employee,
            salaryAmount: salary,
            name: employee.name.trim(),
            batchId: employee.batchId || null
        };

        setError(null);
        onAdd(dataToSend);
        setEmployee(initialFormState);
    };

    return (
        <form onSubmit={handleSubmit} className="addEmployeeFormCard">
            <h3 className="formTitle">Add New Employee Details</h3>
            
            <div className="formGrid">
                <div className="formGroup">
                    <label htmlFor="name">Payee Name*</label>
                    <input type="text" id="name" name="name" value={employee.name} onChange={handleChange} placeholder="Employee Name" required />
                </div>
                
                <div className="formGroup">
                    <label htmlFor="salaryAmount">Salary Amount*</label>
                    <input type="number" id="salaryAmount" name="salaryAmount" value={employee.salaryAmount} onChange={handleChange} placeholder="e.g., 50000.00" required min="0.01" step="0.01" />
                </div>

                <div className="formGroup colSpan2">
                    <label htmlFor="bankDetails">Beneficiary Details (Account No.)*</label>
                    <input type="text" id="bankDetails" name="bankDetails" value={employee.bankDetails} onChange={handleChange} placeholder="Account No." required />
                </div>
                
                <div className="formGroup">
                    <label htmlFor="paymentRef">Payment Reference</label>
                    <input type="text" id="paymentRef" name="paymentRef" value={employee.paymentRef} onChange={handleChange} placeholder="e.g., PAY-MARCH" />
                </div>
                
                <div className="formGroup">
                    <label htmlFor="yourRef">Your Reference</label>
                    <input type="text" id="yourRef" name="yourRef" value={employee.yourRef} onChange={handleChange} placeholder="e.g., EMP-101" />
                </div>

                <div className="formGroup colSpan2">
                    <label htmlFor="batchId">Assign to Batch (Optional)</label>
                    <select id="batchId" name="batchId" value={employee.batchId} onChange={handleChange}>
                        <option value="">-- Unassigned --</option>
                        {batches.map(batch => (
                            <option key={batch.id} value={batch.id}>{batch.name}</option>
                        ))}
                    </select>
                </div>

                <div className="formGroup colSpan2">
                    <label htmlFor="notes">Notes</label>
                    <textarea id="notes" name="notes" value={employee.notes} onChange={handleChange} placeholder="Any specific notes for this employee" rows="2"></textarea>
                </div>
            </div>

            {error && <p className="errorText">{error}</p>}
            
            <button type="submit" className="button button-primary submitButton">
                <Plus />
                Add Employee
            </button>
        </form>
    );
};

export default AddEmployeeForm;