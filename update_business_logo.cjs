const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = 'C:\\Users\\pudiv\\invoice_builder.db';
const db = new sqlite3.Database(dbPath);

const logoPath = path.resolve(__dirname, 'public', 'logo.jpg');
const logoBuf = fs.readFileSync(logoPath);

db.serialize(() => {
  db.get("SELECT id FROM businesses LIMIT 1", (err, row) => {
    if (row) {
      db.run(`UPDATE businesses SET name = ?, shortName = ?, logo = ?, fileType = ?, fileName = ? WHERE id = ?`,
        ['AISMARTLIVE SOLUTIONS PVT LTD', 'AI', logoBuf, 'image/jpeg', 'logo.jpg', row.id], (err) => {
          if (err) console.error(err);
          else console.log('Updated existing business profile with logo!');
        }
      );
    } else {
      db.run(`INSERT INTO businesses (name, shortName, logo, fileType, fileName) VALUES (?, ?, ?, ?, ?)`,
        ['AISMARTLIVE SOLUTIONS PVT LTD', 'AI', logoBuf, 'image/jpeg', 'logo.jpg'], (err) => {
          if (err) console.error(err);
          else console.log('Created new business profile with logo!');
        }
      );
    }
  });
});

setTimeout(() => db.close(), 1000);
