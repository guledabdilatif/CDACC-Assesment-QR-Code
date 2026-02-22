import { useState, useEffect } from "react"; // Added useEffect
import { useNavigate, useParams } from "react-router-dom"; // Added useParams
import axios from 'axios';
import { ClipboardCheck, User, BookOpen, Hash, Building2, ShieldCheck, Save } from "lucide-react";

const ApiUrl = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('token');

export default function AddRecord() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL if it exists
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    centerName: "", serialNo: "", courseName: "", level: "",
    unitCode: "", unitName: "", totalTools: "",
    c1name: "", c1reg: "", c2name: "", c2reg: "",
    headName: "", supervisorName: "", dateCreated: new Date()
  });

  // 1. Fetch data if in Edit Mode
  useEffect(() => {

    if (isEditMode) {
      const fetchRecord = async () => {
        try {
          const response = await axios.get(`${ApiUrl}/qr/${id}`,
            { headers: { Authorization: `Bearer ${token}` } });
          setForm(response.data);
        } catch (error) {
          console.error("Error fetching record:", error);
          alert("Failed to load record data");
        }
      };
      fetchRecord();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 2. Handle both Add and Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Is Edit Mode:", isEditMode); // Should be true
    console.log("Current ID:", id);

    try {

      if (isEditMode) {
        // Update existing record
        await axios.put(`${ApiUrl}/qr/${id}`, form, {
          headers: { Authorization: `Bearer ${token}`}
        });
        alert("Data updated successfully");
      } else {
        // Create new record
        await axios.post(`${ApiUrl}/qr`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Data inserted successfully");
      }
      navigate("/qrs");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Error saving data");
    }
  };

  return (
    <div className="form-container">
      <header className="form-header">
        <div className="brand-accent"></div>
        {/* Dynamic Title */}
        <h2>{isEditMode ? "Edit Assessment Record" : "Assessment Record Entry"}</h2>
        <p>Ensure all competence certification details are accurate.</p>
      </header>

      <form onSubmit={handleSubmit} className="styled-form">
        <section className="form-section">
          <div className="section-title">
            <ClipboardCheck size={20} />
            <h3>Supervisor Section</h3>
          </div>
          <div className="grid-row">
            <div className="input-group">
              <label><Building2 size={16} /> Center Name</label>
              {/* Added value={form.centerName} to all inputs */}
              <input name="centerName" value={form.centerName} required onChange={handleChange} />
            </div>
            <div className="input-group">
              <label><Hash size={16} /> Total Tools</label>
              <input name="totalTools" value={form.totalTools} required onChange={handleChange} />
            </div>
          </div>
          <div className="input-group">
            <label><Hash size={16} /> Serial No</label>
            <input name="serialNo" value={form.serialNo} required onChange={handleChange} />
          </div>
          {/* ... Repeat value={form.fieldName} for ALL other inputs ... */}
          <div className="grid-row">
            <div className="input-group">
              <label><BookOpen size={16} /> Course Name</label>
              <input name="courseName" value={form.courseName} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Level</label>
              <input name="level" value={form.level} placeholder="e.g. Level 6" onChange={handleChange} />
            </div>
          </div>
          <div className="input-group">
            <label><BookOpen size={16} /> unitCode </label>
            <input name="unitCode" value={form.unitCode} onChange={handleChange} />
          </div>
          {/* Section: Candidates (Example of value binding) */}
          <div className="candidate-box">
            <small>Candidate 1</small>
            <input name="c1name" value={form.c1name} placeholder="Full Name" onChange={handleChange} />
            <input name="c1reg" value={form.c1reg} placeholder="Registration No" onChange={handleChange} />
          </div>
          <div className="candidate-box">
            <small>Candidate 2</small>
            <input name="c2name" value={form.c2name} placeholder="Full Name" onChange={handleChange} />
            <input name="c2reg" value={form.c2reg} placeholder="Registration No" onChange={handleChange} />
          </div>
          {/* ... Apply to remaining inputs ... */}
        </section>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate("/qrs")}>Cancel</button>
          <button type="submit" className="btn-primary">
            <Save size={18} /> {isEditMode ? "Update Assessment" : "Save Assessment"}
          </button>
        </div>
      </form>
    </div>
  );
}