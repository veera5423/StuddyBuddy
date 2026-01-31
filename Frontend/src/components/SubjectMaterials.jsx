import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaDownload, FaEye, FaArrowLeft } from 'react-icons/fa';
import './SubjectMaterials.css';

const SubjectMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { subjectId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const [materialsResponse, subjectsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/subjects/${subjectId}/materials`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/subjects', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setMaterials(materialsResponse.data);
        const currentSubject = subjectsResponse.data.find(s => s._id === subjectId);
        setSubject(currentSubject);
      } catch (error) {
        toast.error('Failed to load materials');
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectId, navigate]);

  const handleDownload = async (materialId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/subjects/materials/${materialId}/download`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Create download link
      const link = document.createElement('a');
      link.href = response.data.downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download started');
    } catch (error) {
      toast.error('Download failed');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="subject-materials">
      <header className="materials-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          <FaArrowLeft /> Back to Dashboard
        </button>
        <h1>{subject?.name} Materials</h1>
      </header>

      <div className="materials-content">
        {materials.length === 0 ? (
          <p className="no-materials">No materials available for this subject yet.</p>
        ) : (
          <div className="materials-list">
            {materials.map((material) => (
              <div key={material._id} className="material-card">
                <div className="material-info">
                  <h3>{material.title}</h3>
                  <p>{material.description}</p>
                  <div className="material-meta">
                    <span>Uploaded by: {material.uploadedBy.name}</span>
                    <span>Downloads: {material.downloads}</span>
                    <span>Size: {(material.fileSize / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                <div className="material-actions">
                  <Link to={`/pdf/${material._id}`} className="action-btn view-btn">
                    <FaEye /> View
                  </Link>
                  <button 
                    onClick={() => handleDownload(material._id, material.fileName)}
                    className="action-btn download-btn"
                  >
                    <FaDownload /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectMaterials;