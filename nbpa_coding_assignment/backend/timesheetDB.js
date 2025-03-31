const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const csv = require("csv-parser");

const timesheetDB = new sqlite3.Database("./timesheets.db");

// CREATE A TABLE IF WE DON'T HAVE ONE
// WE ARE ONLY LOADING CSV DATA FOR THE FIRST TIME ONLY
timesheetDB.serialize(() => {
  timesheetDB.run(`
    CREATE TABLE IF NOT EXISTS timesheets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT,
      client TEXT,
      project TEXT,
      projectCode TEXT,
      hours REAL,
      billable TEXT,
      firstName TEXT,
      lastName TEXT,
      rate REAL
    )
  `);

  // CHECK TO SEE IF THE TABLE IS EMPTY AND IF IT IS THEN WE INSERT CSV
  // WE ARE ONLY LOADING CSV DATA FOR THE FIRST TIME ONLY
  timesheetDB.get("SELECT COUNT(*) as count FROM timesheets", (err, row) => {
    if (row.count === 0) {
      console.log("Inserting data to database from CSV >>>>>>");
      fs.createReadStream("./data/timesheet.csv")
        .pipe(csv())
        .on("data", (row) => {
          timesheetDB.run(
            `INSERT INTO timesheets (date, client, project, projectCode, hours, billable, firstName, lastName, rate)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              row["Date"],
              row["Client"],
              row["Project"],
              row["Project Code"],
              parseFloat(row["Hours"]),
              row["Billable?"],
              row["First Name"],
              row["Last Name"],
              parseFloat(row["Billable Rate"]),
            ]
          );
        })
        .on("end", () => {
          console.log("CSV data loaded into SQLite data table >>>>>");
        });
    }
  });
});

module.exports = timesheetDB;
