import React, { useEffect, useState } from "react";
import "./App.css";
import TimesheetTable from "./components/TimesheetTable";
import TimesheetForm from "./components/TimesheetForm";
import { MdClose } from "react-icons/md";

function App() {
  const [timesheets, setTimesheets] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("All");
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    console.log("MODAL CLOSED >>>>");
    setShowModal(false);
  };
  const openModal = () => {
    console.log("MODAL OPENED >>>>");
    setShowModal(true);
  };

  const fetchAllTimesheets = () => {
    fetch("http://localhost:5000/api/timesheets")
      .then((res) => res.json())
      .then((data) => {
        setTimesheets(data);
        const uniqueClients = [
          "All",
          ...new Set(data.map((item) => item.client)),
        ];
        setClients(uniqueClients);
      })
      .catch((err) => console.error("Failed to fetch timesheets:", err));
  };

  useEffect(() => {
    fetchAllTimesheets();
  }, []);

  // Fetch filtered data from backend when client changes
  const handleFilterChange = (e) => {
    console.log("Filter value changed >>>>>");

    const value = e.target.value;
    setSelectedClient(value);

    if (value === "All") {
      console.log("Filter value reset >>>>>");

      // Re-fetch all
      fetch("http://localhost:5000/api/timesheets")
        .then((res) => res.json())
        .then((data) => setTimesheets(data))
        .catch((err) => console.error("Failed to fetch timesheets:", err));
    } else {
      fetch(`http://localhost:5000/api/timesheets/client/${value}`)
        .then((res) => res.json())
        .then((data) => setTimesheets(data))
        .catch((err) =>
          console.error("Failed to fetch client timesheets:", err)
        );
    }
  };

  return (
    <div className="App">
      <h1>Timesheet Table</h1>
      <div className="formSettingsBar">
        <div className="filterButton">
          <label htmlFor="client-filter">Filter by Client: </label>
          <select
            id="client-filter"
            value={selectedClient}
            onChange={handleFilterChange}
          >
            {clients.map((client, index) => (
              <option key={index} value={client}>
                {client}
              </option>
            ))}
          </select>
        </div>
        <button onClick={openModal}>Add New Entry</button>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-button" onClick={closeModal}>
                <MdClose />
              </button>
              <TimesheetForm
                onEntryAdded={() => {
                  fetchAllTimesheets();
                  closeModal();
                }}
              />
            </div>
          </div>
        )}
      </div>
      <TimesheetTable data={timesheets} />
    </div>
  );
}

export default App;
