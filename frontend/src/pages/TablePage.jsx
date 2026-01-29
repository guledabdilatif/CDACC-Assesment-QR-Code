import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Plus, LayoutList, FileDown, Eye } from "lucide-react";
import jsPDF from "jspdf";
import '../css/styles.css';

export default function TablePage({ records }) {

  const handleDownloadAllPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const margin = 20;
    const qrSize = 45; // Physical size in PDF
    const columnGap = 15;
    const rowGap = 25; // Large gap to fit text above QR
    let x = margin;
    let y = margin + 20; // Start below header

    // Add CDACC Header to PDF
    doc.setDrawColor(179, 139, 77); // Gold color
    doc.setLineWidth(1);
    doc.line(margin, 25, 190, 25);
    
    doc.setTextColor(44, 76, 148); // Navy Blue
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("TVET CDACC QR VERIFICATION SHEET", margin, 20);

    records.forEach((r, index) => {
      const canvas = document.getElementById(`qr-${r.id}`);
      if (canvas) {
        // High quality capture
        const qrData = canvas.toDataURL("image/png", 1.0);

        // 1. Draw metadata (Text)
        doc.setFontSize(8);
        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "bold");
        
        // Truncate text if too long to prevent overlapping
        const center = `Center: ${r.supervisorSection.centerName.substring(0, 25)}`;
        const course = `Course: ${r.supervisorSection.courseName.substring(0, 25)}`;
        const unit = `Unit: ${r.supervisorSection.unitName.substring(0, 25)}`;

        // Print text lines with small vertical spacing
        doc.text(center, x, y - 10);
        doc.setFont("helvetica", "normal");
        doc.text(course, x, y - 6);
        doc.text(unit, x, y - 2);
        
        // 2. Add QR Image (drawn below the text)
        doc.setDrawColor(230, 230, 230); // Light border for cutting guide
        doc.rect(x - 2, y - 14, qrSize + 4, qrSize + 16); 
        doc.addImage(qrData, "PNG", x, y, qrSize, qrSize);

        // 3. Grid Positioning Logic (3 per row)
        x += qrSize + columnGap;
        
        if (x + qrSize > 210 - margin) {
          x = margin;
          y += qrSize + rowGap;
        }

        // 4. New Page Logic
        if (y + qrSize > 280) {
          doc.addPage();
          x = margin;
          y = margin + 20;
        }
      }
    });

    doc.save("CDACC_Clear_QRs.pdf");
  };

  return (
    <div className="table-container">
      <header className="table-header">
        <div className="header-left">
          <LayoutList className="icon-gold" size={28} />
          <div>
            <h2>Assessment Register</h2>
            <p>Official CDACC Certification Records</p>
          </div>
        </div>
        
        <div className="header-actions">
          <button onClick={handleDownloadAllPDF} className="btn-secondary">
            <FileDown size={18} /> Download High-Res QRs
          </button>
          <Link to="/add" className="btn-primary no-underline">
            <Plus size={18} /> Add New Record
          </Link>
        </div>
      </header>

      <div className="table-wrapper">
        <table className="cdacc-table">
          <thead>
            <tr>
              <th>Center</th>
              <th>Course & Unit</th>
              <th>Serial</th>
              <th className="text-center">Verification QR</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.id}>
                <td className="font-bold">{r.supervisorSection.centerName}</td>
                <td>
                  <div className="course-info">
                    <span className="course-tag">{r.supervisorSection.courseName}</span>
                    <small>{r.supervisorSection.unitName}</small>
                  </div>
                </td>
                <td><code className="serial-badge">{r.supervisorSection.serialNo}</code></td>
                <td className="text-center">
                  <div className="qr-wrapper">
                    {/* Increased size to 150 for much higher PDF resolution */}
                    <QRCodeCanvas
                      id={`qr-${r.id}`}
                      value={`http://localhost:5173/record/${r.id}`}
                      size={150} 
                      style={{ width: "50px", height: "50px" }} // Displays small on screen
                      level={"H"}
                    />
                  </div>
                </td>
                <td className="text-center">
                  <Link to={`/record/${r.id}`} className="view-link"><Eye size={18} /> View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}