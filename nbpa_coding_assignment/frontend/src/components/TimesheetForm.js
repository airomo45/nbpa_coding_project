// src/components/TimesheetForm.js
import React, { useState } from "react";

const TimesheetForm = ({ onEntryAdded }) => {
  const [formData, setFormData] = useState({
    date: "",
    client: "",
    project: "",
    projectCode: "",
    hours: "",
    billable: "No",
    firstName: "",
    lastName: "",
    rate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/timesheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        hours: parseFloat(formData.hours),
        rate: parseFloat(formData.rate),
      }),
    })
      .then((res) => res.json())
      .then(() => {
        onEntryAdded(); // refresh the data and close the modal
        setFormData({
          date: "",
          client: "",
          project: "",
          projectCode: "",
          hours: "",
          billable: "No",
          firstName: "",
          lastName: "",
          rate: "",
        });
      });
  };

  return (
    <form onSubmit={handleSubmit} className="timesheet-form">
      <h3>Add New Timesheet Entry</h3>

      <div className="form-row">
        <label>Date:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <label>Client:</label>
        <input
          type="text"
          name="client"
          value={formData.client}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <label>Project:</label>
        <input
          type="text"
          name="project"
          value={formData.project}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <label>Project Code:</label>
        <input
          type="text"
          name="projectCode"
          value={formData.projectCode}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <label>Hours:</label>
        <input
          type="number"
          step="0.01"
          name="hours"
          value={formData.hours}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-row">
        <label>Billable?</label>
        <select
          name="billable"
          value={formData.billable}
          onChange={handleChange}
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>

      <div className="form-row">
        <label>Billable Rate:</label>
        <input
          type="number"
          step="0.01"
          name="rate"
          value={formData.rate}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="submit-button">
        Add Entry
      </button>
    </form>
  );
};

export default TimesheetForm;
