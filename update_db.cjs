const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/AISMARTLIVE_DEMO_2.db');

db.serialize(() => {
  db.run("INSERT OR IGNORE INTO style_profiles (name, layoutId, isArchived) VALUES ('Default Profile', 2, 0)");
  db.run("INSERT OR IGNORE INTO presets (name, termsConditionNotes, businessId, bankId, currencyId, styleProfilesId, isArchived) VALUES ('Demo Preset', 'Payment Terms: Payment due within 30 days', 1, 2, 1, 1, 0)");
});

db.close((err) => {
  if (err) console.error(err);
  console.log('Database updated successfully.');
});
