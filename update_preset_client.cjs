const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/AISMARTLIVE_DEMO_2.db');

db.serialize(() => {
  db.run("UPDATE presets SET clientId = 1 WHERE name = 'Demo Preset'");
});

db.close((err) => {
  if (err) console.error(err);
  console.log('Database updated successfully.');
});
