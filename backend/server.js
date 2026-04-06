const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const csv = require('csv-parser');

const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./waste.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS waste (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    mealType TEXT,
    foodItem TEXT,
    preparedQty REAL,
    consumedQty REAL,
    wasteQty REAL,
    location TEXT,
    reason TEXT
  )`);

  // Load CSV data if table is empty
  db.get(`SELECT COUNT(*) as count FROM waste`, [], (err, row) => {
    if (err) console.error(err);
    else if (row.count === 0) {
      fs.createReadStream('../hotel_food_waste_1year.csv')
        .pipe(csv())
        .on('data', (data) => {
          const wasteQty = parseFloat(data.quantity_wasted_kg);
          const preparedQty = wasteQty + 10; // Example: assume some consumption
          const consumedQty = 10;
          db.run(`INSERT INTO waste (date, mealType, foodItem, preparedQty, consumedQty, wasteQty, location, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.date, data.meal_type, data.food_item, preparedQty, consumedQty, wasteQty, data.hotel_name, data.reason], function(err) {
            if (err) console.error('Insert error:', err);
          });
        })
        .on('end', () => {
          console.log('CSV data loaded into database');
        });
    }
  });
});

app.post('/api/waste', (req, res) => {
  const { date, mealType, foodItem, preparedQty, consumedQty, wasteQty, location, reason } = req.body;
  db.run(`INSERT INTO waste (date, mealType, foodItem, preparedQty, consumedQty, wasteQty, location, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
    [date, mealType, foodItem, preparedQty, consumedQty, wasteQty, location, reason], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
});

app.get('/api/waste', (req, res) => {
  db.all(`SELECT * FROM waste`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});