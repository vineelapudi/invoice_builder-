const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve('data/AISMARTLIVE_DEMO_2.db');
const db = new sqlite3.Database(dbPath);

const sql = `
      SELECT
          it.*,
          COUNT(DISTINCT CASE WHEN inv."invoiceType" = 'invoice' THEN ii."parentInvoiceId" END) AS "invoiceCount",
          COUNT(DISTINCT CASE WHEN inv."invoiceType" = 'quotation' THEN ii."parentInvoiceId" END) AS "quotesCount",
          u."name" AS "unitName",
          c."name" AS "categoryName"
      FROM items it
      LEFT JOIN units u ON it."unitId" = u."id"
      LEFT JOIN categories c ON it."categoryId" = c."id"
      LEFT JOIN invoice_items ii ON ii."itemId" = it."id"
      LEFT JOIN invoices inv ON ii."parentInvoiceId" = inv."id"
      GROUP BY it."id", u."name", c."name"
      ORDER BY it."createdAt" DESC
`;

db.all(sql, (err, rows) => {
    if (err) {
        console.error(err);
    } else {
        console.log("ROWS:", rows);
    }
});
