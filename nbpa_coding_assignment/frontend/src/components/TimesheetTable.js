import React from "react";
import "../App.css";

const TimesheetTable = ({ data }) => {
  return (
    <table className="tableStyles">
      <thead>
        <tr>
          <th>Name</th>
          <th>Client</th>
          <th>Hours</th>
          <th>Billable Hours</th>
          <th>Billable Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry, index) => {
          const name = `${entry.firstName} ${entry.lastName}`;
          const billableHours =
            entry.billable === "Yes" ? parseFloat(entry.hours) : 0;
          const billableAmount = billableHours * parseFloat(entry.rate);

          return (
            <tr key={index}>
              <td>{name}</td>
              <td>{entry.client}</td>
              <td>{entry.hours}</td>
              <td>{billableHours.toFixed(2)}</td>
              <td>${billableAmount.toFixed(2)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TimesheetTable;
