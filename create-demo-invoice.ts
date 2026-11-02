import path from 'path';
import { openSqlLite } from './src/backend/shared/db/setup';
import * as invoicesService from './src/backend/shared/services/invoices';
import { InvoiceType } from './src/backend/shared/enums/invoiceType';

async function main() {
  const dbPath = path.resolve(process.cwd(), 'data', 'AISMARTLIVE_DEMO_2.db');
  console.log('Opening DB at:', dbPath);
  
  const { db } = await openSqlLite({ fullPath: dbPath, createIfMissing: false });

  // 1. Insert Bank
  await db.run(
    `INSERT INTO banks ("name", "bankName", "accountHolder", "accountNumber", "ifscCode", "address") VALUES (?, ?, ?, ?, ?, ?)`,
    ['Demo Main Bank', 'Demo National Bank', 'AISmartLive Solutions Pvt Ltd', '000000000001', 'DEMO0000001', 'Visakhapatnam Main Branch']
  );
  const bankResult = await db.get<{id: number}>('SELECT id FROM banks ORDER BY id DESC LIMIT 1');
  const bankId = bankResult?.id;

  // 2. Update Business with Payment Terms
  await db.run(
    `UPDATE businesses SET "paymentInformation" = ? WHERE "name" = 'AISMARTLIVE SOLUTIONS PVT LTD'`,
    ['Payment due within 30 days']
  );

  const businessResult = await db.get<{id: number}>("SELECT id FROM businesses WHERE name = 'AISMARTLIVE SOLUTIONS PVT LTD' LIMIT 1");
  const businessId = businessResult?.id;

  const clientResult = await db.get<{id: number}>("SELECT id FROM clients WHERE name = 'Acme Corp' LIMIT 1");
  const clientId = clientResult?.id;

  if (!businessId || !clientId || !bankId) {
    throw new Error('Missing IDs');
  }

  // 3. Create an invoice via the service
  const invoiceData = {
    invoiceType: InvoiceType.invoice,
    businessId,
    clientId,
    bankId,
    currencyId: 1, // USD or whatever default is
    issuedAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    invoiceNumber: '0001',
    invoicePrefix: 'INV-',
    status: 'unpaid',
    taxType: 'exclusive',
    termsConditionNotes: 'Payment due within 30 days',
    language: 'en',
    discountAmountCents: '0',
    discountPercent: 0,
    surchargeAmountCents: '0',
    surchargePercent: 0,
    shippingFeeCents: '0',
    taxRate: 0,
    invoiceItems: [
      {
        itemId: 1, // Created in previous seed script
        name: 'Web Development Services',
        quantity: 1,
        priceCents: '150000',
        totalCents: '150000',
        order: 0,
        taxType: 'exclusive'
      }
    ]
  };

  try {
    const res = await invoicesService.addInvoice(db, invoiceData as any);
    console.log('Invoice successfully created! ID:', res.data.id);
  } catch (err) {
    console.error('Failed to create invoice:', err);
  } finally {
    await db.close();
  }
}

main();
