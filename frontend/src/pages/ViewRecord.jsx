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
import axios from "axios";
import '../css/styles.css'
import { useEffect } from "react";
import { useState } from "react";
const ApiUrl = import.meta.env.VITE_API_URL
export default function VerificationDetail() {
  const [qrCode, setQrCode] = useState({})
  const { id } = useParams();
  useEffect(() => {
    async function fetchQrCodes(id) {
      const response = await axios.get(`${ApiUrl}/qr/${id}`);
      setQrCode(response.data);
    }
    fetchQrCodes(id)
  }, [])



  return (
    <div className="view-container">
      {/* Back Button */}
      <Link to="/qrs" className="back-link">
        <ArrowLeft size={18} /> Back to Register
      </Link>

      <div className="verification-card">
        {/* Status Header */}
        <header className="verification-header">
          <div className="status-badge">
            <ShieldCheck size={20} color="white" />
            Verified Assessment
          </div>
          <h1>Certification Verification</h1>
          <p className="serial-text">Serial No: <span>{qrCode.serialNo}</span></p>
        </header>

        <div className="verification-body">
          {/* Assessment Overview */}
          <section className="info-grid">
            <div className="info-item">
              <label><Building size={16} /> Center</label>
              <p>{qrCode.centerName}</p>
            </div>
            <div className="info-item">
              <label><BookOpen size={16} /> Course, Unit and Unit Code</label>
              <p>Course Name: {qrCode.courseName}</p>
              <small>Unit name: {qrCode.unitName}</small> <br />
              <small>Unit Code: {qrCode.unitCode}</small>
            </div>
          </section>

          <hr className="divider" />

          {/* Candidates */}
          <section className="detail-section">
            <h3><UserCheck size={20} className="icon-gold" /> Candidate Representatives</h3>
            <div className="candidate-grid">

              <div className="candidate-verify-box">
                <div className="verify-header">
                  <span className="candidate-label">1</span>
                  <CheckCircle2 size={16} className="text-success" />
                </div>
                <p><strong>{qrCode.c1name}</strong></p>
                <p className="reg-no">{qrCode.c1reg}</p>
              </div>
              <div className="candidate-verify-box">
                <div className="verify-header">
                  <span className="candidate-label">2</span>
                  <CheckCircle2 size={16} className="text-success" />
                </div>
                <p><strong>{qrCode.c2name}</strong></p>
                <p className="reg-no">{qrCode.c1reg}</p>
              </div>

            </div>
          </section>

          {/* Signatories */}
          <section className="detail-section signatures">
            <div className="sig-card">
              <label>Head of Institution</label>
              <p className="sig-name">{qrCode.headName}</p>
              <div className="digital-sig">Digitally Signed</div>
            </div>

            <div className="sig-card">
              <label>Supervisor Declaration</label>
              <p className="sig-name">{qrCode.supervisorName}</p>
              <div className="digital-sig">Digitally Signed</div>
              <small className="timestamp">
                <Calendar size={12} /> {qrCode.time}
              </small>
            </div>
          </section>
        </div>
        <div className="candidate-verify-box sig-card" style={{margin:"30px"}}>
          <p><strong>Total Tools</strong></p>
          <p className="reg-no">{qrCode.totalTools}</p>
        </div>

        <footer className="verification-footer">
          <Award size={24} />
          <p>Official TVET CDACC Competence Certification System</p>
        </footer>
      </div>
    </div>
  );
}