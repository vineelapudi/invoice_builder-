const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/AISMARTLIVE_DEMO_2.db');

const legacySchema = (name) => JSON.stringify({ schemaVersion: 1, meta: { name } });

const layoutDescription = (name) =>
  name.startsWith('Legacy')
    ? 'Pre-created legacy layout preserved for existing documents that use business payment information. Do not use for new invoices or quotes.'
    : 'Pre-created layout using bank payment information for new invoices and quotes.';

const headerBlocks = (name) => {
  const title = { type: 'title' };
  const logo = { type: 'logo' };
  const business = { type: 'businessInfo' };
  const client = { type: 'clientInfo' };
  const meta = (options = {}) => ({ type: 'invoiceMeta', ...options });
  const legacyPayment = { type: 'paymentInfo', paymentSource: 'legacyBusiness', width: '60%' };
  const row = (children, options = {}) => ({
    type: 'row',
    children,
    align: 'start',
    justify: 'between',
    ...options
  });

  switch (name) {
    case 'Modern':
      return [
        row([title, logo], { paddingBottom: 20 }),
        row([business, meta({ boxed: true, showInvoiceLabel: true })]),
        row([client], { paddingTop: 20 })
      ];
    case 'Compact':
      return [
        { type: 'column', children: [title], align: 'center', paddingBottom: 20 },
        row(
          [
            { type: 'column', children: [business], width: '40%' },
            { type: 'column', children: [client], width: '40%' },
            { type: 'column', children: [meta({ showInvoiceLabel: true })], width: '20%' }
          ],
          { gap: 10 }
        )
      ];
    case 'Legacy Classic':
      return [
        row([
          {
            type: 'column',
            width: '50%',
            children: [{ ...business, paddingBottom: 10 }, logo]
          },
          { type: 'column', width: '50%', children: [meta({ showTitle: true })] }
        ]),
        row(
          [
            { type: 'column', width: '50%', children: [client] },
            { type: 'column', width: '50%', align: 'end', children: [legacyPayment] }
          ],
          { paddingTop: 20 }
        )
      ];
    case 'Legacy Modern':
      return [
        row([title, logo], { paddingBottom: 20 }),
        row([
          { type: 'column', width: '50%', children: [business] },
          { type: 'column', width: '50%', children: [meta({ showInvoiceLabel: true, boxed: true })] }
        ]),
        row(
          [
            { type: 'column', width: '50%', children: [client] },
            { type: 'column', width: '50%', align: 'end', children: [legacyPayment] }
          ],
          { paddingTop: 20 }
        )
      ];
    case 'Legacy Compact':
      return [
        { type: 'column', children: [title], align: 'center', paddingBottom: 20 },
        row(
          [
            { type: 'column', children: [business], width: '40%' },
            { type: 'column', children: [client], width: '40%' },
            { type: 'column', children: [meta({ showInvoiceLabel: true })], width: '20%' }
          ],
          { gap: 10 }
        )
      ];
    case 'Classic':
      return [
        row([
          {
            type: 'column',
            width: '50%',
            children: [{ ...business, paddingBottom: 10 }, logo]
          },
          { type: 'column', width: '50%', children: [meta({ showTitle: true })] }
        ]),
        row([client], { paddingTop: 20 })
      ];
    default:
      return [
        row([
          {
            type: 'column',
            width: '50%',
            children: [{ ...business, paddingBottom: 10 }, logo]
          },
          { type: 'column', width: '50%', children: [meta({ showTitle: true })] }
        ]),
        row([client], { paddingTop: 20 })
      ];
  }
};

const declarativeSchema = (name, includePaymentInfo = false) => {
  const legacyCompactTotals = {
    type: 'totalsRow',
    visible: true,
    totalsBlocks: [
      { type: 'paymentInfo', paymentSource: 'legacyBusiness' },
      { type: 'spacer' },
      { type: 'financialTotals' }
    ]
  };
  const sections = [
    { type: 'watermark', visible: 'auto', watermarkOrder: 'paidFirst' },
    { type: 'header', visible: true, blocks: headerBlocks(name) },
    { type: 'itemsTable', visible: true, ...(name.startsWith('Legacy') ? { columnSizing: 'proportional' } : {}) },
    ...(name === 'Legacy Compact'
      ? [legacyCompactTotals]
      : [
          { type: 'financialTotals', visible: true },
          ...(includePaymentInfo ? [{ type: 'paymentInfo', visible: 'auto' }] : [])
        ]),
    { type: 'notes', visible: 'auto' },
    { type: 'signature', visible: 'auto' },
    { type: 'pageCounter', visible: true }
  ];

  return JSON.stringify({ schemaVersion: 1, meta: { name, description: layoutDescription(name) }, sections });
};

db.serialize(() => {
  const currentClassicSchema = declarativeSchema('Classic');
  const classicSchema = declarativeSchema('Classic', true);
  const legacyClassicSchema = declarativeSchema('Legacy Classic', false);

  const insertLayout = (schema, isArchived) => {
    db.run('INSERT INTO layouts ("schema", "isArchived") SELECT ?, ? WHERE NOT EXISTS (SELECT 1 FROM layouts WHERE "schema" = ?)', [schema, isArchived, schema]);
  };

  insertLayout(classicSchema, 0);
  insertLayout(currentClassicSchema, 0);
  insertLayout(legacyClassicSchema, 1);

  const currentModernSchema = declarativeSchema('Modern');
  const modernSchema = declarativeSchema('Modern', true);
  const legacyModernSchema = declarativeSchema('Legacy Modern', false);
  insertLayout(modernSchema, 0);
  insertLayout(currentModernSchema, 0);
  insertLayout(legacyModernSchema, 1);

  const currentCompactSchema = declarativeSchema('Compact');
  const legacyCompactSchema = declarativeSchema('Legacy Compact', false);
  insertLayout(currentCompactSchema, 0);
  insertLayout(legacyCompactSchema, 1);
});

db.close((err) => {
  if (err) console.error(err);
  console.log('Layouts seeded successfully.');
});
