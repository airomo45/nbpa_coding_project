const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const cors = require("cors");
const db = require("./timesheetDB");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// GET function for all timesheet data
app.get("/api/timesheets", (req, res) => {
  console.log("Getting all timesheet data >>>>>");
  db.all("SELECT * FROM timesheets", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET function to get timesheet data for a specific client
app.get("/api/timesheets/client/:clientName", (req, res) => {
  const client = req.params.clientName;
  console.log("Getting all timesheet data for a specific client >>>>>", client);
  db.all("SELECT * FROM timesheets WHERE client = ?", [client], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST function to create a new timesheet data entry
app.post("/api/timesheets", (req, res) => {
  console.log("Posting a new timesheet data >>>>>>");
  const {
    date,
    client,
    project,
    projectCode,
    hours,
    billable,
    firstName,
    lastName,
    rate,
  } = req.body;

  db.run(
    `INSERT INTO timesheets (date, client, project, projectCode, hours, billable, firstName, lastName, rate)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      date,
      client,
      project,
      projectCode,
      hours,
      billable,
      firstName,
      lastName,
      rate,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Entry added", id: this.lastID });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} >>>>>`);
});
