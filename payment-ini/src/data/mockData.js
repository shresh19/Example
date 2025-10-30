// --- MOCK INITIAL DATA (Simulating DB Load) ---
export const initialBatches = [
    { id: 'b-1', name: 'Q1 Payroll March', paymentCount: 5, lastPaymentDate: new Date(Date.now() - 86400000 * 10), paymentStatus: 'Paid' },
    { id: 'b-2', name: 'Bonus Payout Feb', paymentCount: 1, lastPaymentDate: new Date(Date.now() - 86400000 * 30), paymentStatus: 'Paid' },
];

export const initialEmployees = [
    { 
      id: 'e-1', 
      name: 'Alice Smith', 
      salaryAmount: 55000.50, 
      batchId: 'b-1', 
      bankDetails: '123456', 
      paymentRef: 'PAY001', 
      yourRef: 'EMP101', 
      notes: 'March salary' 
    },
    { 
      id: 'e-2', 
      name: 'Bob Johnson', 
      salaryAmount: 62000.00, 
      batchId: 'b-1', 
      bankDetails: '789012', 
      paymentRef: 'PAY002', 
      yourRef: 'EMP102', 
      notes: '' 
    },
    { 
      id: 'e-3', 
      name: 'Charlie Brown', 
      salaryAmount: 45000.00, 
      batchId: null, 
      bankDetails: '345678', 
      paymentRef: 'PAY003', 
      yourRef: 'EMP103', 
      notes: 'Unassigned' 
    },
    { 
      id: 'e-4', 
      name: 'Diana Prince', 
      salaryAmount: 90000.00, 
      batchId: 'b-2', 
      bankDetails: '901234', 
      paymentRef: 'PAY004', 
      yourRef: 'EMP104', 
      notes: 'High Value Bonus' 
    },
];
export const mockBankAccounts = [
  { id: 'ac-1', number: '9876543210 (Main)', balance: 500000.00 },
  { id: 'ac-2', number: '1234509876 (Ops)', balance: 1250000.50 },
  { id: 'ac-3', number: '5555666777 (Savings)', balance: 75000.00 }
];