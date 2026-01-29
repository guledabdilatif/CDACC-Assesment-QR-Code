import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import TablePage from "./pages/TablePage";
import AddRecord from "./pages/AddRecord";
import ViewRecord from "./pages/ViewRecord";

export default function App() {
  const [records, setRecords] = useState([]);

  const addRecord = (record) => {
    setRecords(prev => [...prev, record]);
  };

  return (
    <Routes>
      <Route path="/" element={<TablePage records={records} />} />
      <Route path="/add" element={<AddRecord addRecord={addRecord} />} />
      <Route path="/record/:id" element={<ViewRecord records={records} />} />
    </Routes>
  );
}
