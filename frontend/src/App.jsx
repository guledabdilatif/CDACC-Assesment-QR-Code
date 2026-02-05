import { Routes, Route } from "react-router-dom";
import TablePage from "./pages/TablePage";
import AddRecord from "./pages/AddRecord";
import ViewRecord from "./pages/ViewRecord";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TablePage />} />
      <Route path="/add" element={<AddRecord />} />
      <Route path="/record/:id" element={<ViewRecord />} />
    </Routes>
  );
}
