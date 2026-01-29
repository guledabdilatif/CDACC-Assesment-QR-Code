import { Link, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  CheckCircle2, 
  UserCheck, 
  Building, 
  BookOpen, 
  Calendar,
  ShieldCheck,
  Award
} from "lucide-react";
import '../css/styles.css'

export default function VerificationDetail({ records }) {
  const { id } = useParams();
  const record = records.find(r => r.id === id);

  if (!record) return (
    <div className="error-container">
      <h2>Record Not Found</h2>
      <Link to="/" className="btn-secondary">Return to Register</Link>
    </div>
  );

  return (
    <div className="view-container">
      {/* Back Button */}
      <Link to="/" className="back-link">
        <ArrowLeft size={18} /> Back to Register
      </Link>

      <div className="verification-card">
        {/* Status Header */}
        <header className="verification-header">
          <div className="status-badge">
            <ShieldCheck size={20} />
            Verified Assessment
          </div>
          <h1>Certification Verification</h1>
          <p className="serial-text">Serial No: <span>{record.supervisorSection.serialNo}</span></p>
        </header>

        <div className="verification-body">
          {/* Assessment Overview */}
          <section className="info-grid">
            <div className="info-item">
              <label><Building size={16} /> Center</label>
              <p>{record.supervisorSection.centerName}</p>
            </div>
            <div className="info-item">
              <label><BookOpen size={16} /> Course & Unit</label>
              <p>{record.supervisorSection.courseName}</p>
              <small>{record.supervisorSection.unitName}</small>
            </div>
          </section>

          <hr className="divider" />

          {/* Candidates */}
          <section className="detail-section">
            <h3><UserCheck size={20} className="icon-gold" /> Candidate Representatives</h3>
            <div className="candidate-grid">
              {record.candidates.map((c, i) => (
                <div key={i} className="candidate-verify-box">
                  <div className="verify-header">
                    <span className="candidate-label">Candidate {i + 1}</span>
                    <CheckCircle2 size={16} className="text-success" />
                  </div>
                  <p><strong>{c.name}</strong></p>
                  <p className="reg-no">{c.regNo}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Signatories */}
          <section className="detail-section signatures">
            <div className="sig-card">
              <label>Head of Institution</label>
              <p className="sig-name">{record.head.name}</p>
              <div className="digital-sig">Digitally Signed</div>
            </div>
            
            <div className="sig-card">
              <label>Supervisor Declaration</label>
              <p className="sig-name">{record.declaration.supervisorName}</p>
              <div className="digital-sig">Digitally Signed</div>
              <small className="timestamp">
                <Calendar size={12} /> {record.declaration.time}
              </small>
            </div>
          </section>
        </div>

        <footer className="verification-footer">
          <Award size={24} />
          <p>Official TVET CDACC Competence Certification System</p>
        </footer>
      </div>
    </div>
  );
}