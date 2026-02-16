import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  UserCheck,
  Building,
  BookOpen,
  Calendar,
  ShieldCheck,
  Award,
  Send,
  Check // Added for the success state
} from "lucide-react";
import axios from "axios";
import '../css/styles.css';
import { useEffect, useState } from "react";

const ApiUrl = import.meta.env.VITE_API_URL;
export default function VerificationDetail() {
  const [qrCode, setQrCode] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // 1. ADDED MISSING STATE
  const { id } = useParams();

  useEffect(() => {
    async function checkStatus() {
      try {
        // Fetch the main QR data
        const res = await axios.get(`${ApiUrl}/qr/${id}`);
        setQrCode(res.data);

        // 2. Optimized: Check if this serialNo exists in submissions
        const subRes = await axios.get(`${ApiUrl}/submissions`);
        const exists = subRes.data.some(sub => sub.serialNo === res.data.serialNo);
        if (exists) {
          setIsSubmitted(true);
        }
      } catch (err) {
        console.error("Error loading record status:", err);
      }
    }
    checkStatus();
  }, [id]);

  const handleSubmitVerification = async () => {
    setLoading(true);
    try {
      // 3. Remove the _id to avoid MongoDB Duplicate Key errors on the primary key
      const { _id, ...submissionData } = qrCode;

      await axios.post(`${ApiUrl}/submissions`, {
        ...submissionData,
        originalId: _id,
        verifiedAt: new Date().toLocaleString()
      });

      alert("Data submitted successfully!");
      setIsSubmitted(true); 
    } catch (error) {
      // 4. Improved Error Handling: Check if backend says it's a duplicate (400)
      if (error.response?.status === 400 || error.response?.data?.code === 11000) {
        alert("This record has already been submitted.");
        setIsSubmitted(true);
      } else {
        alert("Error submitting verification. Check console for details.");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Link to="/qrs" className="back-link">
          <ArrowLeft size={18} /> Back to Register
        </Link>

        <button
          onClick={handleSubmitVerification}
          // 5. BUTTON LOGIC: Disable if loading OR already submitted
          disabled={loading || isSubmitted}
          className="btn-submit"
          style={{
            backgroundColor: isSubmitted ? '#64748b' : '#16a34a',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: (loading || isSubmitted) ? 'not-allowed' : 'pointer',
            fontWeight: '600',
            opacity: isSubmitted ? 0.8 : 1
          }}
        >
          {isSubmitted ? <Check size={18} /> : <Send size={18} />} 
          {loading ? "Submitting..." : isSubmitted ? "Already Submitted" : "Submit Verification"}
        </button>
      </div>

      {/* --- REST OF YOUR UI REMAINS THE SAME --- */}
      <div className="verification-card">
        <header className="verification-header">
          <div className="status-badge">
            <ShieldCheck size={20} color="white" />
            Verified Assessment
          </div>
          <h1>Certification Verification</h1>
          <p className="serial-text">Serial No: <span>{qrCode.serialNo}</span></p>
        </header>

        <div className="verification-body">
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
                <p className="reg-no">{qrCode.c2reg}</p>
              </div>
            </div>
          </section>

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

        <div className="candidate-verify-box sig-card" style={{ margin: "30px" }}>
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