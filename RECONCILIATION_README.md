# Bank Reconciliation Feature

A comprehensive bank-feed style CSV reconciliation system for matching payments to invoices, similar to QuickBooks bank feed reconciliation.

## Features

- **CSV Upload & Processing**: Drag-and-drop CSV upload with column mapping
- **Smart Matching**: AI-powered matching algorithm with confidence scoring
- **Manual Allocation**: Manual payment allocation for unmatched items
- **Audit Trail**: Complete audit trail of all allocations and approvals
- **Export Capabilities**: Export allocation history for reporting
- **Multi-tenant Support**: Full tenant isolation and security

## Quick Start

### 1. Setup Database

```bash
# Run migrations to create reconciliation tables
npm run db:migrate

# Seed sample data for testing
npm run db:seed:reconcile
```

### 2. Access the Feature

Navigate to `/admin/invoicing/reconcile` in your application.

**Note**: Only users with `MASTER_ADMIN` or `SUB_ADMIN` roles can access this feature.

### 3. Upload Your First CSV

1. Go to the "Upload CSV" tab
2. Download the template or use your own CSV
3. Drag and drop your CSV file
4. Map the columns (Date, Amount, Reference, BankTxnId)
5. Process the CSV

## CSV Format Requirements

### Required Columns
- **Date**: Payment date (supports DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
- **Amount**: Payment amount (supports currency symbols, commas)
- **Reference**: Payment description/reference

### Optional Columns
- **BankTxnId**: Unique bank transaction ID (recommended for deduplication)

### Supported Formats
- ANZ, CBA, Westpac, NAB bank exports
- Generic CSV with standard columns
- UTF-8 encoding

### Example CSV
```csv
Date,Amount,Reference,BankTxnId
16/01/2024,1500.00,INV-001 Payment,BNK123456
21/01/2024,2500.00,Payment for invoice 002,BNK123457
25/01/2024,500.00,Partial payment INV-002,BNK123458
```

## Matching Algorithm

The system uses a weighted scoring algorithm to match payments to invoices:

### High Confidence Rules (0.9+)
1. **Invoice Number Match**: Extracts invoice numbers from references (INV-123, INV123, etc.)
2. **Exact Amount Match**: Perfect amount match with open invoices

### Medium Confidence Rules (0.75-0.89)
3. **Date Proximity**: Payment date within 5-10 days of invoice due date
4. **Reference Similarity**: Jaro-Winkler similarity between reference and invoice details

### Low Confidence Rules (<0.75)
5. **Partial Payment Detection**: Identifies common payment fractions (50%, 33%, etc.)

### Disqualifiers
- Currency mismatch
- Invoice status not OPEN/PARTIALLY_PAID/OVERDUE
- Duplicate bank transaction IDs

## Workflow

### 1. Upload & Process
- Upload CSV file
- Map columns to required fields
- System validates and creates Payment records
- Automatic matching generates suggestions

### 2. Review Suggestions
- View suggested matches with confidence scores
- Review match reasoning and rule breakdown
- Approve high-confidence matches in bulk
- Manually review ambiguous matches

### 3. Manual Allocation
- For unmatched payments, manually allocate to invoices
- Support for partial payments and splits
- Real-time remaining amount calculation

### 4. Audit & Export
- View complete allocation history
- Export data for external reporting
- Full audit trail of approvals and rejections

## API Endpoints

### CSV Processing
- `POST /api/reconcile/upload` - Upload CSV file
- `POST /api/reconcile/process` - Process mapped CSV data

### Suggestions & Matching
- `GET /api/reconcile/suggestions` - Get payment suggestions
- `POST /api/reconcile/recalculate` - Recalculate suggestions

### Allocation Management
- `POST /api/reconcile/approve` - Approve payment allocation
- `POST /api/reconcile/reject` - Reject payment

### Statistics
- `GET /api/reconcile/stats` - Get reconciliation statistics

## Database Schema

### Payment Model
```prisma
model Payment {
  id               String   @id @default(cuid())
  source           String   @default("BANK_FEED")
  amountCents      Int
  currency         String   @default("AUD")
  paidAt           DateTime
  bankReference    String?
  bankTxnId        String?  @unique
  allocationStatus String   @default("UNALLOCATED")
  rawRowJson       String?  // Original CSV row for audit
  tenantId         String
  createdById      String?
  // ... relations
}
```

### PaymentAllocation Model
```prisma
model PaymentAllocation {
  id          String  @id @default(cuid())
  paymentId   String
  invoiceId   String
  amountCents Int
  approvedById String?
  approvedAt   DateTime?
  // ... relations
}
```

## Testing

### Unit Tests
```bash
# Run reconciliation logic tests
npm test lib/reconciliation.test.ts
```

### Sample Data
The seed script creates:
- 2 companies with 3 clients
- 5 sample invoices (various statuses)
- 4 sample payments for testing

### Test CSV Data
Use the sample CSV data provided by the seed script:
```csv
Date,Amount,Reference,BankTxnId
16/01/2024,1500.00,INV-001 Payment,BNK123456
21/01/2024,2500.00,Payment for invoice 002,BNK123457
25/01/2024,500.00,Partial payment INV-002,BNK123458
30/01/2024,750.00,INV-004 Photography Services,BNK123459
```

## Security & Permissions

### Access Control
- **Required Role**: `MASTER_ADMIN` or `SUB_ADMIN`
- **Tenant Isolation**: All data is scoped to user's tenant
- **Audit Trail**: All actions are logged with user and timestamp

### Data Validation
- CSV format validation
- Amount parsing and currency handling
- Date format detection and parsing
- Duplicate transaction prevention

## Troubleshooting

### Common Issues

**CSV Upload Fails**
- Check file format (must be .csv)
- Ensure UTF-8 encoding
- Verify required columns are present

**No Matches Found**
- Check invoice status (must be OPEN/PARTIALLY_PAID/OVERDUE)
- Verify currency matches (currently AUD only)
- Review reference text for invoice numbers

**Duplicate Payments**
- Check for duplicate BankTxnId values
- System prevents importing same transaction twice

### Debug Mode
Enable debug logging by setting `DEBUG=reconciliation` environment variable.

## Future Enhancements

- [ ] Multi-currency support
- [ ] Advanced matching rules configuration
- [ ] Bulk CSV processing
- [ ] Integration with external accounting systems
- [ ] Machine learning model for improved matching
- [ ] Real-time bank feed integration
- [ ] Automated reconciliation rules

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the test cases in `lib/reconciliation.test.ts`
3. Examine the sample data in `prisma/seed-reconciliation.ts`
4. Check the API documentation above

## License

This feature is part of the Studiio Admin Pro application.















