import React from 'react';
import { Users, Trash2 } from 'lucide-react';
import './EmployeeList.css';

const EmployeeList = ({ employees, deleteEmployee, batches }) => {
    const totalEmployees = employees.length;
    const unassignedCount = employees.filter(emp => !emp.batchId).length;

    const getBatchName = (batchId) => {
        if (!batchId) return null;
        return batches.find(b => b.id === batchId)?.name || 'Unknown';
    };

    return (
        <div className="employeeListCard">
            <h2 className="listTitle">
                <Users />
                All Employees ({totalEmployees})
            </h2>
            <p className="subTitle">
                Unassigned: <span className="unassignedCount">{unassignedCount}</span>
            </p>

            <div className="employeeScrollList">
                {totalEmployees === 0 ? (
                    <p className="emptyText">No employees added yet.</p>
                ) : (
                    employees
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map(emp => {
                            const batchName = getBatchName(emp.batchId);
                            return (
                                <div key={emp.id} className="employeeItem">
                                    <div className="itemHeader">
                                        <span className="employeeName">{emp.name}</span>
                                        <button
                                            onClick={() => deleteEmployee(emp)}
                                            className="deleteButton"
                                            title={`Delete employee ${emp.name}`}
                                        >
                                            <Trash2 />
                                        </button>
                                    </div>
                                    <div className="itemRow">
                                        <span className="employeeAmount">
                                            Amount: {typeof emp.salaryAmount === 'number' 
                                                ? emp.salaryAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }) 
                                                : 'N/A'}
                                        </span>
                                        <span className={`batchTag ${batchName ? 'assigned' : 'unassigned'}`}>
                                            {batchName ? `Batch: ${batchName}` : 'Unassigned'}
                                        </span>
                                    </div>
                                    <p className="detailText">
                                        <b>Bank:</b> {emp.bankDetails}
                                    </p>
                                    <p className="detailText">
                                        <b>Ref:</b> {emp.yourRef || 'N/A'}
                                    </p>
                                </div>
                            );
                        })
                )}
            </div>
        </div>
    );
};

export default EmployeeList;