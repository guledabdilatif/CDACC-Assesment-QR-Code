import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Plus, LayoutList, FileDown, Eye, Trash, EyeClosed, Pencil, PencilLine } from "lucide-react";
import jsPDF from "jspdf";
import axios from "axios";
import '../css/styles.css';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SideBar from "../utils/SideBar";
import Navbar from "../Components/Navbar";

const ApiUrl = import.meta.env.VITE_API_URL;

export default function TablePage() {
  const [qrData, setQrData] = useState([]);
  const handleDownloadAllPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const margin = 20;
    const qrSize = 40;
    const columnGap = 15;
    const rowGap = 30;
    let x = margin;
    let y = margin + 25;

    // Header logic
    doc.setDrawColor(179, 139, 77);
    doc.setLineWidth(1);
    doc.line(margin, 25, 190, 25);
    doc.setTextColor(44, 76, 148);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("TVET CDACC QR VERIFICATION SHEET", margin, 20);

    // FIXED: Changed 'records' to 'qrData'
    qrData.forEach((r, index) => {
      // FIXED: Changed 'r.id' to 'r._id' to match your MongoDB/API keys
      const canvas = document.getElementById(`qr-${r._id}`);

      if (canvas) {
        const qrImage = canvas.toDataURL("image/png", 1.0);

        doc.setFontSize(8);
        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "bold");

        // Text metadata
        const center = `Center: ${r.centerName.substring(0, 22)}`;
        const course = `Course: ${r.courseName.substring(0, 22)}`;
        const serial = `SN: ${r.serialNo}`;

        doc.text(center, x, y - 10);
        doc.setFont("helvetica", "normal");
        doc.text(course, x, y - 6);
        doc.text(serial, x, y - 2);

        // Draw QR
        doc.setDrawColor(230, 230, 230);
        doc.rect(x - 2, y - 14, qrSize + 4, qrSize + 16);
        doc.addImage(qrImage, "PNG", x, y, qrSize, qrSize);

        // Grid Math
        x += qrSize + columnGap;
        if (x + qrSize > 190) {
          x = margin;
          y += qrSize + rowGap;
        }

        // New Page Logic
        if (y + qrSize > 270) {
          doc.addPage();
          x = margin;
          y = margin + 25;
        }
      }
    });

    doc.save("CDACC_Official_QRs.pdf");
  };

  useEffect(() => {
    async function fetchQrCodes() {
      try {
        const response = await axios.get(`${ApiUrl}/qr`);
        setQrData(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }
    fetchQrCodes();
  }, []);
  //delete QrCode
  async function DeleteQrCode(id) {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const response = await axios.delete(`${ApiUrl}/qr/${id}`);
      if (response.status === 200) {
        alert("QR Code Deleted Successfully!!");
        setQrData(prevData => prevData.filter(item => item._id !== id));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete the record.");
    }
  }
  return (
    <>
      <div style=
        {{ display: 'flex', justifyContent: 'space-between', width: "100%" }}
      >
        <SideBar />
        < div style={{
          flex: 1,
          marginLeft: '250px', // Pushes content past the fixed sidebar
          width: 'calc(100% - 250px)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Navbar />
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
                    <th>S/NO</th>
                    <th>Center</th>
                    <th>Course & Unit</th>
                    <th>Serial</th>
                    <th className="text-center">Verification QR</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody >
                  {qrData.map((r, index) => (
                    <tr key={r._id} >
                      <td className="font-bold">{index + 1}</td>
                      <td className="font-bold">{r.centerName}</td>
                      <td>
                        <div className="course-info">
                          <span className="course-tag">{r.courseName}</span>
                          <small>{r.unitName}</small>
                        </div>
                      </td>
                      <td><code className="serial-badge">{r.serialNo}</code></td>
                      <td className="text-center">
                        {/* size=300 ensures the PDF grab is high-res */}
                        <QRCodeCanvas
                          id={`qr-${r._id}`}
                          value={`${window.location.origin}/record/${r._id}`}
                          size={300}
                          style={{ width: "50px", height: "50px" }}
                          level="H"
                        />
                      </td>
                      <td className="text-center" >
                        <div style={{ display: 'flex' }}>
                          <Link to={`/edit/${r._id}`} className="view-link">
                            <PencilLine size={30} color="black" />
                          </Link>
                          <Link to={`/record/${r._id}`} className="view-link" style={{ margin: '0 10px' }}>
                            <Eye size={30} />
                          </Link>
                          <Link onClick={() => DeleteQrCode(r._id)} className="view-link">
                            <Trash size={30} color="red" />
                          </Link>
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
    </>

  );
}