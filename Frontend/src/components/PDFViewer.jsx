import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './PDFViewer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer = () => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [material, setMaterial] = useState(null);
  const { materialId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/subjects/materials/${materialId}/download`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPdfUrl(response.data.downloadUrl);
      } catch (error) {
        toast.error('Failed to load PDF');
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [materialId, navigate]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = material?.fileName || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started');
    }
  };

  const goToPrevPage = () => {
    setPageNumber(pageNumber - 1);
  };

  const goToNextPage = () => {
    setPageNumber(pageNumber + 1);
  };

  if (loading) {
    return <div className="loading">Loading PDF...</div>;
  }

  return (
    <div className="pdf-viewer">
      <header className="pdf-header">
        <button onClick={() => navigate(-1)} className="back-btn">
          <FaArrowLeft /> Back
        </button>
        <h1>PDF Viewer</h1>
        <button onClick={handleDownload} className="download-btn">
          <FaDownload /> Download
        </button>
      </header>

      <div className="pdf-container">
        {pdfUrl && (
          <>
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={() => toast.error('Failed to load PDF')}
              loading="Loading PDF..."
            >
              <Page pageNumber={pageNumber} />
            </Document>
            
            <div className="pdf-controls">
              <button 
                onClick={goToPrevPage} 
                disabled={pageNumber <= 1}
                className="nav-btn"
              >
                Previous
              </button>
              <span>
                Page {pageNumber} of {numPages}
              </span>
              <button 
                onClick={goToNextPage} 
                disabled={pageNumber >= numPages}
                className="nav-btn"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;