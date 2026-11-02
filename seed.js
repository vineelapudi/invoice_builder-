const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'data', 'AISMARTLIVE_DEMO_2.db');
const db = new sqlite3.Database(dbPath);

const logoPath = 'C:\\Users\\pudiv\\.gemini\\antigravity-ide\\brain\\fe141dbd-4b51-49e6-a18f-16f6f15b7e43\\.user_uploaded\\media_1790755002506.jpg';
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
  
  db.get("SELECT id FROM clients WHERE name = 'Acme Corp'", (err, row) => {
    if (!row) {
      db.run(`INSERT INTO clients (name, shortName, email, address) VALUES (?, ?, ?, ?)`,
        ['Acme Corp', 'AC', 'billing@acmecorp.com', '123 Fake St, Silicon Valley, CA']
      );
    }
  });
});

setTimeout(() => db.close(), 1000);
