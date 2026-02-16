import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Plus, LayoutList, FileDown, Eye, Trash, PencilLine } from "lucide-react";
import jsPDF from "jspdf";
import axios from "axios";
import SideBar from "../utils/SideBar";
import Navbar from "../Components/Navbar";

const ApiUrl = import.meta.env.VITE_API_URL;

export default function TablePage() {
  const [qrData, setQrData] = useState([]);
  // 1. Lifted State: This controls both the Sidebar and this Page's margin
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 2. Dynamic width calculation
  const sidebarWidth = isCollapsed ? '80px' : '250px';

  useEffect(() => {
    async function fetchQrCodes() {
      try {
        const response = await axios.get(`${ApiUrl}/qr`);
        setQrData(response.data);
      } catch (err) { console.error("Fetch error:", err); }
    }
    fetchQrCodes();
  }, []);

  const handleDownloadAllPDF = () => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const margin = 15;
  const qrSize = 40; // Size of QR code in mm
  const colWidth = (pageWidth - (margin * 2)) / 3; // Space for each of the 3 columns
  
  let xOffset = margin;
  let yOffset = 25;
  let count = 0;

  qrData.forEach((item, index) => {
    const canvas = document.getElementById(`qr-${item._id}`);
    
    if (canvas) {
      const qrImage = canvas.toDataURL("image/png");

      // --- Text Formatting ---
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      // Center Name (Truncated if too long)
      const centerText = doc.splitTextToSize(item.centerName.toUpperCase(), colWidth - 5);
      doc.text(centerText, xOffset + (qrSize / 2), yOffset, { align: "center" });

      doc.setFontSize(7);
      doc.setFont(undefined, 'normal');
      // Course & Unit
      const courseText = doc.splitTextToSize(`${item.courseName} - ${item.unitName}`, colWidth - 5);
      doc.text(courseText, xOffset + (qrSize / 2), yOffset + 7, { align: "center" });

      // --- Draw QR Code ---
      // Positioned below the text
      doc.addImage(qrImage, 'PNG', xOffset, yOffset + 12, qrSize, qrSize);
      
      // Serial Number below QR
      doc.setFontSize(6);
      doc.text(`SN: ${item.serialNo}`, xOffset + (qrSize / 2), yOffset + qrSize + 16, { align: "center" });

      // --- Layout Logic ---
      count++;
      
      if (count % 3 === 0) {
        // Move to next row after 3 QRs
        xOffset = margin;
        yOffset += 75; // Vertical spacing between rows
      } else {
        // Move to next column
        xOffset += colWidth;
      }

      // --- Page Management ---
      // If the next row would exceed page height (A4 is ~297mm)
      if (yOffset > 240 && (index + 1) < qrData.length) {
        doc.addPage();
        yOffset = 25;
        xOffset = margin;
        count = 0;
      }
    }
  });

  doc.save("CDACC_Grid_QRs.pdf");
};

  async function DeleteQrCode(id) {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`${ApiUrl}/qr/${id}`);
      setQrData(prev => prev.filter(item => item._id !== id));
    } catch (err) { alert("Delete failed"); }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* 3. Pass state to Sidebar as props */}
      <SideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div style={{
        flex: 1,
        // 4. This is the FIX: Margin now reacts to the state
        marginLeft: sidebarWidth,
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        width: `calc(100% - ${sidebarWidth})`
      }}>
        <Navbar />
        <div className="table-container" style={{ padding: '2rem', marginTop: '70px' }}>
          <header className="table-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div className="header-left" style={{ display: 'flex', gap: '15px' }}>
              <LayoutList color="#f58220" size={28} />
              <div>
                <h2 style={{ margin: 0 }}>Assessment Register</h2>
                <p style={{ margin: 0, color: '#64748b' }}>Official CDACC Certification Records</p>
              </div>
            </div>

            <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleDownloadAllPDF} className="btn-secondary">
                <FileDown size={18} /> Download PDF
              </button>
              <Link to="/add" className="btn-primary no-underline">
                <Plus size={18} /> Add New
              </Link>
            </div>
          </header>

          <div className="table-wrapper">
            <table className="cdacc-table">
              <thead>
                <tr>
                  <th>S/NO</th>
                  <th>Center</th>
                  <th>Course & Unit</th>
                  <th>Serial</th>
                  <th className="text-center">Verification QR</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {qrData.map((r, index) => (
                  <tr key={r._id}>
                    <td>{index + 1}</td>
                    <td style={{ fontWeight: 'bold' }}>{r.centerName}</td>
                    <td>
                      <div className="course-info">
                        <span className="course-tag">{r.courseName}</span>
                        <small style={{ display: 'block' }}>{r.unitName}</small>
                      </div>
                    </td>
                    <td><code className="serial-badge">{r.serialNo}</code></td>
                    <td className="text-center">
                      <QRCodeCanvas
                        id={`qr-${r._id}`}
                        value={`${window.location.origin}/record/${r._id}`}
                        size={150}
                        style={{ width: "45px", height: "45px" }}
                      />
                    </td>
                    <td className="text-center">
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <Link to={`/edit/${r._id}`}><PencilLine size={20} color="#1a365d" /></Link>
                        <Link to={`/record/${r._id}`}><Eye size={20} color="#3b82f6" /></Link>
                        <Trash size={20} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => DeleteQrCode(r._id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}