import React from 'react';
import { Eye } from 'lucide-react';
import './PaymentPreview.css';

const PaymentPreview = ({ batch, employees, paymentDetails }) => {
    const totalAmount = employees.reduce((sum, emp) => sum + (typeof emp.salaryAmount === 'number' ? emp.salaryAmount : 0), 0);

    const Item = ({ label, value, strong = false, mono = false }) => (
        <div className="previewItem">
            <span className="previewItemLabel">{label}:</span>
            <span className={`previewItemValue ${strong ? 'strong' : ''} ${mono ? 'mono' : ''}`}>
                {value}
            </span>
        </div>
    );

    return (
        <div className="previewBox">
            <h4 className="previewTitle">
                <Eye />
                Payment Summary Preview
            </h4>
            
            <div className="previewItemGroup">
                <Item label="Batch ID/Name" value={batch.name} strong />
                <Item label="Debit Account" value={paymentDetails.debitAccount || 'N/A'} mono />
                <Item label="Payroll Type" value={paymentDetails.payrollType} />
                <Item label="Currency" value={paymentDetails.currency} strong />
                <Item label="Initiation Date" value={paymentDetails.date} />
            </div>

            <div className="previewTotalGroup">
                <Item label={`Total Employees (${employees.length})`} value={employees.length.toLocaleString()} />
                <div className="previewTotalAmount">
                    <span className="previewTotalLabel">Total Payment Amount:</span>
                    <span className="previewTotalValue">
                        {paymentDetails.currency} {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
            
            <p className="previewFooterNote">
                {employees.length > 0 ? 'Transaction will process all listed employees.' : 'No employees in this batch. Cannot submit.'}
            </p>
        </div>
    );
};

export default PaymentPreview;