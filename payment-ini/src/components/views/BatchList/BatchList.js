import React, { useMemo } from 'react';
import { Package, Trash2, Clock, Send, Pencil, X } from 'lucide-react'; 
import { formatDate } from '../../../utils/formatDate';
import './BatchList.css';

const BatchList = ({ batches, employees, deleteBatch, assignEmployeeToBatch, initiatePayment, onEditBatch, unassignEmployee }) => {
    const unassignedEmployees = useMemo(() => employees.filter(emp => !emp.batchId).sort((a, b) => a.name.localeCompare(b.name)), [employees]);

    return (
        <div className="batchListContainer">
            <h2 className="listTitle">
                <Package />
                Active Batches
            </h2>
            <div className="batchGrid">
                {batches.length === 0 ? (
                    <div className="batchEmptyState">
                        <Package />
                        <p><b>No batches created yet.</b></p>
                        <p>Use the form above to get started.</p>
                    </div>
                ) : (
                    batches.map(batch => {
                        const batchEmployees = employees.filter(emp => emp.batchId === batch.id);
                        const isPayDisabled = batchEmployees.length === 0;
                        const totalSalary = batchEmployees.reduce((sum, emp) => sum + (typeof emp.salaryAmount === 'number' ? emp.salaryAmount : 0), 0);

                        return (
                            <div key={batch.id} className="batchCard">
                                <div className="cardHeader">
                                    <h3 className="batchName">{batch.name}</h3>
                                    <div className="cardHeaderButtons">
                                        <button
                                            onClick={() => onEditBatch(batch)}
                                            className="editButton"
                                            title={`Edit batch ${batch.name}`}
                                        >
                                            <Pencil />
                                        </button>
                                        <button
                                            onClick={() => deleteBatch(batch)}
                                            className="deleteButton"
                                            title={`Delete batch ${batch.name}`}
                                        >
                                            <Trash2 />
                                        </button>
                                    </div>
                                </div>

                                <p className="employeeCount">{batchEmployees.length} Employee(s) Assigned</p>

                                <div className="statusBlock">
                                    <div className="statusRow">
                                        <Clock />
                                        Last Payment: <span>{formatDate(batch.lastPaymentDate)}</span>
                                    </div>
                                    <div className="statusRow">
                                        <p>Total Payments: <span>{batch.paymentCount || 0}</span></p>
                                        <p>Batch Total: <span className="batchTotal">{totalSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></p>
                                    </div>
                                </div>

                                <div className="employeeList">
                                    {batchEmployees.length > 0 ? (
                                        batchEmployees.map(emp => (
                                            <div key={emp.id} className="employeeChip">
                                                <div className="employeeHeader">
                                                    <span>{emp.name}</span>
                                                    <div className="employeeHeader-right">
                                                        <span className="employeeSalary">
                                                            {emp.salaryAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                        </span>
                                                        <button 
                                                            className="unassignButton"
                                                            title={`Unassign ${emp.name}`}
                                                            onClick={() => unassignEmployee(emp.id)}
                                                        >
                                                            <X />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="employeeDetails">
                                                    <p><b>Bank:</b> {emp.bankDetails || 'N/A'}</p>
                                                    <p><b>Your Ref:</b> {emp.yourRef || 'N/A'} | <b>Pay Ref:</b> {emp.paymentRef || 'N/A'}</p>
                                                    {emp.notes && <p><b>Notes:</b> {emp.notes}</p>}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="noEmployeesText">No employees in this batch.</p>
                                    )}
                                </div>

                                <div className="cardFooter">
                                    <button
                                        onClick={() => initiatePayment(batch)}
                                        className="button button-success"
                                        disabled={isPayDisabled}
                                        title={isPayDisabled ? "Cannot initiate payment: Assign employees first" : "Initiate Payment for this batch"}
                                    >
                                        <Send />
                                        Initiate Payment
                                    </button>

                                    {unassignedEmployees.length > 0 && (
                                        <select
                                            onChange={(e) => assignEmployeeToBatch(e.target.value, batch.id)}
                                            defaultValue=""
                                        >
                                            <option value="" disabled>+ Add Unassigned Employee</option>
                                            {unassignedEmployees.map(emp => (
                                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default BatchList;