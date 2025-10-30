import React, { useState, useEffect } from 'react';
import { DollarSign, X, Loader, Send, Eye } from 'lucide-react';
import PaymentPreview from '../PaymentPreview/PaymentPreview';
import './InitiatePaymentModal.css';

const InitiatePaymentModal = ({ isOpen, batch, employees, bankAccounts, onConfirm, onDraft, onClose, isProcessing }) => {
    const [debitAccount, setDebitAccount] = useState('');
    const [selectedBalance, setSelectedBalance] = useState(null);
    const [payrollType, setPayrollType] = useState('Monthly Salary');
    const [currency, setCurrency] = useState('INR');
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    
    useEffect(() => {
        if (isOpen) {
            setDebitAccount('');
            setSelectedBalance(null);
            setPayrollType('Monthly Salary');
            setCurrency('INR');
            setIsPreviewVisible(false);
        }
    }, [isOpen]);

    if (!isOpen || !batch) return null;
    
    const isBatchEmpty = employees.length === 0;
    const isFormValid = debitAccount.trim() !== '' && !isBatchEmpty;

    const paymentDetails = {
        debitAccount: debitAccount.trim(),
        payrollType,
        currency,
        batchId: batch.id,
        batchName: batch.name,
        date: new Date().toLocaleDateString('en-US') 
    };

    const handleSubmit = () => {
        if (isFormValid) {
            onConfirm(batch, paymentDetails);
        }
    };
    
    const handleDraft = () => {
        onDraft(batch, paymentDetails);
    };
    const handleAccountChange = (e) => {
        const selectedAccountNumber = e.target.value;
        setDebitAccount(selectedAccountNumber);

        if (selectedAccountNumber) {
            const account = bankAccounts.find(acc => acc.number === selectedAccountNumber);
            setSelectedBalance(account.balance);
        } else {
            setSelectedBalance(null);
        }
    };

    return (
        <div className="paymentModalOverlay">
            <div className="paymentModalContent">
                <div className="modalHeader">
                    <h3 className="modalTitle">
                        <DollarSign />
                        Initiate Payment: {batch.name}
                    </h3>
                    <button onClick={onClose} className="closeButton" disabled={isProcessing}>
                        <X />
                    </button>
                </div>
                
                {isBatchEmpty && (
                     <div className="batchEmptyError">
                         <p><b>Cannot submit payment:</b> The batch has no assigned employees.</p>
                     </div>
                )}

                <div className="modalBodyGrid">
                    <div className="formColumn">
                        <h4 className="columnTitle">Payment Details</h4>
                        
                        <div className="formGroup">
                            <label>Batch ID/No. / Name</label>
                            <input type="text" value={batch.name} disabled />
                        </div>

                        <div className="formGroup">
                            <label htmlFor="debitAccount">Debit Account*</label>
                            <select
                                id="debitAccount"
                                value={debitAccount}
                                onChange={handleAccountChange}
                                required
                            >
                                <option value="">-- Select an account --</option>
                                {bankAccounts.map(account => (
                                    <option key={account.id} value={account.number}>
                                        {account.number}
                                    </option>
                                ))}
                            </select>
                            {selectedBalance !== null && (
                                <p className="availableBalance">
                                    Available Balance: INR {selectedBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </p>
                            )}
                        </div>

                        <div className="formGroup">
                            <label htmlFor="payrollType">Payroll Type</label>
                            <select 
                                id="payrollType" 
                                value={payrollType} 
                                onChange={(e) => setPayrollType(e.target.value)} 
                            >
                                <option value="Monthly Salary">Monthly Salary</option>
                                <option value="Bonus">Bonus</option>
                                <option value="Commission">Commission</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        
                        <div className="formGroup">
                            <label htmlFor="currency">Currency</label>
                            <select 
                                id="currency" 
                                value={currency} 
                                onChange={(e) => setCurrency(e.target.value)} 
                            >
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>
                        
                        <div className="formGroup">
                            <label>Date (Initiation)</label>
                            <input type="text" value={new Date().toLocaleDateString('en-US')} disabled />
                        </div>
                    </div>
                    
                    <div className="previewColumn">
                        {isPreviewVisible ? (
                            <PaymentPreview batch={batch} employees={employees} paymentDetails={paymentDetails} />
                        ) : (
                            <div className="previewPlaceholder">
                                <p>Click 'Show Preview' to generate the payment summary.</p>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsPreviewVisible(prev => !prev)}
                            className="button previewButton"
                        >
                            <Eye />
                            {isPreviewVisible ? 'Hide Preview' : 'Show Preview'}
                        </button>
                    </div>
                </div>

                <div className="modalFooter">
                    <button
                        onClick={handleDraft}
                        disabled={isProcessing}
                        className="button button-secondary"
                    >
                        Draft
                    </button>
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="button button-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || isProcessing}
                        className="button button-success"
                    >
                        {isProcessing ? (
                            <>
                                <Loader className="loader" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Send />
                                Submit Payment
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InitiatePaymentModal;