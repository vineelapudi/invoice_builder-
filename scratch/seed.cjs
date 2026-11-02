const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve('data/AISMARTLIVE_DEMO_2.db');
const db = new sqlite3.Database(dbPath);

const items = [
  {
    name: 'AI Software Development',
    description: 'Custom AI software development services',
    amount: '5000000',
    categoryId: 2, // Services
    unitId: 11 // hrs
  },
  {
    name: 'UI/UX Design',
    description: 'Professional UI/UX design services',
    amount: '1500000',
    categoryId: 2, // Services
    unitId: 11 // hrs
  },
  {
    name: 'Testing & Deployment',
    description: 'Software testing and deployment services',
    amount: '1000000',
    categoryId: 2, // Services
    unitId: 11 // hrs
  }
];

db.serialize(() => {
  const stmt = db.prepare(`
    INSERT INTO items (name, amount, unitId, categoryId, description, isArchived, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, 0, datetime('now'), datetime('now'))
  `);

  items.forEach(item => {
    stmt.run(item.name, item.amount, item.unitId, item.categoryId, item.description);
  });

  stmt.finalize();

  db.all("SELECT * FROM items", (err, rows) => {
    console.log("INSERTED ITEMS:", rows);
  });
});
