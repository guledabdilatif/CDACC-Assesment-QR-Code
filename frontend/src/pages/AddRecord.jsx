import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ClipboardCheck, 
  User, 
  BookOpen, 
  Hash, 
  Building2, 
  ShieldCheck, 
  Save 
} from "lucide-react";

export default function AddRecord({ addRecord }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    centerName: "", serialNo: "", courseName: "", level: "",
    unitCode: "", unitName: "", totalTools: "",
    c1name: "", c1reg: "", c2name: "", c2reg: "",
    headName: "", supervisorName: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const record = {
      id: Date.now().toString(),
      supervisorSection: { ...form }, // simplified for demo
      candidates: [
        { name: form.c1name, regNo: form.c1reg, signature: "Signed" },
        { name: form.c2name, regNo: form.c2reg, signature: "Signed" }
      ],
      head: { name: form.headName, signature: "Signed" },
      declaration: {
        supervisorName: form.supervisorName,
        time: new Date().toLocaleString(),
        signature: "Signed"
      }
    };
    addRecord(record);
    navigate("/");
  };

  return (
    <div className="form-container">
      <header className="form-header">
        <div className="brand-accent"></div>
        <h2>Assessment Record Entry</h2>
        <p>Ensure all competence certification details are accurate.</p>
      </header>

      <form onSubmit={handleSubmit} className="styled-form">
        {/* Section: Assessment Details */}
        <section className="form-section">
          <div className="section-title">
            <ClipboardCheck size={20} />
            <h3>Supervisor Section</h3>
          </div>
          <div className="grid-row">
            <div className="input-group">
              <label><Building2 size={16} /> Center Name</label>
              <input name="centerName" required onChange={handleChange} />
            </div>
            <div className="input-group">
              <label><Hash size={16} /> Serial No</label>
              <input name="serialNo" required onChange={handleChange} />
            </div>
          </div>
          <div className="grid-row">
            <div className="input-group">
              <label><BookOpen size={16} /> Course Name</label>
              <input name="courseName" onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Level</label>
              <input name="level" placeholder="e.g. Level 6" onChange={handleChange} />
            </div>
          </div>
          <div className="grid-row three-col">
            <input name="unitCode" placeholder="Unit Code" onChange={handleChange} />
            <input name="unitName" placeholder="Unit Name" onChange={handleChange} />
            <input name="totalTools" placeholder="Total Tools" type="number" onChange={handleChange} />
          </div>
        </section>

        {/* Section: Candidates */}
        <section className="form-section">
          <div className="section-title">
            <User size={20} />
            <h3>Candidate Information</h3>
          </div>
          <div className="grid-row">
            <div className="candidate-box">
              <small>Candidate 1</small>
              <input name="c1name" placeholder="Full Name" onChange={handleChange} />
              <input name="c1reg" placeholder="Registration No" onChange={handleChange} />
            </div>
            <div className="candidate-box">
              <small>Candidate 2</small>
              <input name="c2name" placeholder="Full Name" onChange={handleChange} />
              <input name="c2reg" placeholder="Registration No" onChange={handleChange} />
            </div>
          </div>
        </section>

        {/* Section: Authorization */}
        <section className="form-section">
          <div className="section-title">
            <ShieldCheck size={20} />
            <h3>Authorization & Declaration</h3>
          </div>
          <div className="grid-row">
            <div className="input-group">
              <label>Head of Institution</label>
              <input name="headName" onChange={handleChange} />
            </div>
            <div className="input-group">
              <label>Supervisor Name</label>
              <input name="supervisorName" onChange={handleChange} />
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate("/")}>Cancel</button>
          <button type="submit" className="btn-primary">
            <Save size={18} /> Save Assessment
          </button>
        </div>
      </form>
    </div>
  );
}