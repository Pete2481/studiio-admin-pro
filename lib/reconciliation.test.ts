import { matchPaymentsToInvoices, validateCSVRow, parseAmountToCents, parseCSVDate } from './reconciliation';

// Mock data for testing
const mockInvoices = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-001',
    amountCents: 150000, // $1,500.00
    status: 'SENT',
    dueDate: new Date('2024-01-15'),
    client: { name: 'John Doe' },
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-002',
    amountCents: 250000, // $2,500.00
    status: 'SENT',
    dueDate: new Date('2024-01-20'),
    client: { name: 'Jane Smith' },
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-003',
    amountCents: 100000, // $1,000.00
    status: 'PAID',
    dueDate: new Date('2024-01-10'),
    client: { name: 'Bob Johnson' },
  },
];

const mockPayments = [
  {
    id: 'pay-1',
    source: 'BANK_FEED',
    amountCents: 150000, // $1,500.00
    currency: 'AUD',
    paidAt: new Date('2024-01-16'),
    bankReference: 'INV-001 Payment',
    bankTxnId: 'BNK123456',
    allocationStatus: 'UNALLOCATED',
    rawRowJson: '{}',
    tenantId: 'tenant-1',
    createdById: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'pay-2',
    source: 'BANK_FEED',
    amountCents: 250000, // $2,500.00
    currency: 'AUD',
    paidAt: new Date('2024-01-21'),
    bankReference: 'Payment for invoice 002',
    bankTxnId: 'BNK123457',
    allocationStatus: 'UNALLOCATED',
    rawRowJson: '{}',
    tenantId: 'tenant-1',
    createdById: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'pay-3',
    source: 'BANK_FEED',
    amountCents: 50000, // $500.00 (partial payment)
    currency: 'AUD',
    paidAt: new Date('2024-01-25'),
    bankReference: 'Partial payment INV-002',
    bankTxnId: 'BNK123458',
    allocationStatus: 'UNALLOCATED',
    rawRowJson: '{}',
    tenantId: 'tenant-1',
    createdById: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('Reconciliation Logic', () => {
  describe('matchPaymentsToInvoices', () => {
    it('should match payment with exact invoice number in reference', () => {
      const suggestions = matchPaymentsToInvoices(mockPayments, mockInvoices);
      
      const inv001Match = suggestions.find(s => s.payment.id === 'pay-1' && s.invoice.id === 'inv-1');
      expect(inv001Match).toBeDefined();
      expect(inv001Match?.confidence).toBeGreaterThan(0.9);
      expect(inv001Match?.matchReason).toContain('Invoice number 001 found in reference');
    });

    it('should match payment with exact amount', () => {
      const suggestions = matchPaymentsToInvoices(mockPayments, mockInvoices);
      
      const inv002Match = suggestions.find(s => s.payment.id === 'pay-2' && s.invoice.id === 'inv-2');
      expect(inv002Match).toBeDefined();
      expect(inv002Match?.confidence).toBeGreaterThan(0.8);
    });

    it('should not match payments to paid invoices', () => {
      const suggestions = matchPaymentsToInvoices(mockPayments, mockInvoices);
      
      const paidInvoiceMatch = suggestions.find(s => s.invoice.id === 'inv-3');
      expect(paidInvoiceMatch).toBeUndefined();
    });

    it('should handle partial payments', () => {
      const suggestions = matchPaymentsToInvoices(mockPayments, mockInvoices);
      
      const partialMatch = suggestions.find(s => s.payment.id === 'pay-3');
      expect(partialMatch).toBeDefined();
      expect(partialMatch?.ruleScores.partialPayment).toBeGreaterThan(0);
    });
  });

  describe('validateCSVRow', () => {
    it('should validate correct CSV row', () => {
      const row = {
        date: '01/01/2024',
        amount: '1500.00',
        reference: 'INV-001 Payment',
      };
      
      const result = validateCSVRow(row);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject row with missing required fields', () => {
      const row = {
        date: '01/01/2024',
        amount: '1500.00',
        // missing reference
      };
      
      const result = validateCSVRow(row);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Reference is required');
    });

    it('should reject row with invalid date', () => {
      const row = {
        date: 'invalid-date',
        amount: '1500.00',
        reference: 'INV-001 Payment',
      };
      
      const result = validateCSVRow(row);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid date format');
    });

    it('should reject row with invalid amount', () => {
      const row = {
        date: '01/01/2024',
        amount: 'not-a-number',
        reference: 'INV-001 Payment',
      };
      
      const result = validateCSVRow(row);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid amount format');
    });
  });

  describe('parseAmountToCents', () => {
    it('should parse dollar amounts to cents', () => {
      expect(parseAmountToCents('1500.00')).toBe(150000);
      expect(parseAmountToCents('$1500.00')).toBe(150000);
      expect(parseAmountToCents('1,500.00')).toBe(150000);
      expect(parseAmountToCents('-500.00')).toBe(-50000);
    });

    it('should handle various number formats', () => {
      expect(parseAmountToCents(1500)).toBe(150000);
      expect(parseAmountToCents('1500')).toBe(150000);
    });
  });

  describe('parseCSVDate', () => {
    it('should parse DD/MM/YYYY format', () => {
      const date = parseCSVDate('15/01/2024');
      expect(date.getDate()).toBe(15);
      expect(date.getMonth()).toBe(0); // January is 0
      expect(date.getFullYear()).toBe(2024);
    });

    it('should parse MM/DD/YYYY format', () => {
      const date = parseCSVDate('01/15/2024');
      expect(date.getDate()).toBe(15);
      expect(date.getMonth()).toBe(0); // January is 0
      expect(date.getFullYear()).toBe(2024);
    });

    it('should parse YYYY-MM-DD format', () => {
      const date = parseCSVDate('2024-01-15');
      expect(date.getDate()).toBe(15);
      expect(date.getMonth()).toBe(0); // January is 0
      expect(date.getFullYear()).toBe(2024);
    });
  });
});

// Export for use in other test files
export { mockInvoices, mockPayments };







