import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatBot from "../components/ChatBot.jsx";
import { supabase } from "../utils/supabaseClient";

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-family: 'Rethink Sans';
  margin: 0;
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: white;
  font-weight: 500;
  font-family: 'General Sans';
  cursor: pointer;
  margin-left: 12px;
  
  &:hover {
    background: #f5f5f5;
  }
  &:focus {
    outline: none;
  }
`;

const ProgressBar = styled.div`
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  margin: 16px 0;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #20359A;
  border-radius: 3px;
  width: ${p => p.$progress}%;
  transition: width 0.3s ease;
`;

const ClassGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 24px;
`;

const ClassCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }
`;

const ClassHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const ClassTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #333;
  font-family: 'Rethink Sans';
`;

const ClassBadge = styled.div`
  background: ${p => p.$completed ? '#20359A' : '#4A90E2'};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
`;

const ClassDescription = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 12px 0;
`;

const StartButton = styled.button`
  all: unset;
  background: #20359A;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
  margin-right: 8px;
  
  &:hover {
    background: #1a2a7a;
  }
  &:focus {
    outline: none;
  }
`;

const DeleteButton = styled.button`
  all: unset;
  background: #e0e0e0;
  color: #666;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
  
  &:hover {
    background: #D1D1D6;
  }
  &:focus {
    outline: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  
  h3 {
    color: #666;
    margin-bottom: 8px;
  }
  
  p {
    color: #888;
    margin-bottom: 20px;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${p => p.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  color: #333;
`;

const ModalTitle = styled.h2`
  margin: 0 0 16px 0;
  font-family: 'Rethink Sans';
`;

const ParsedContent = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 16px 0;
  max-height: 400px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const FileInput = styled.input`
  display: none;
`;

export default function Dashboard() {
  const [materials, setMaterials] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showExpandedView, setShowExpandedView] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      // Get Supabase session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload to backend
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const result = await response.json();
      console.log('Upload result:', result);

      // Wait a moment for backend processing to complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reload materials to show the new upload
      await loadMaterials();

    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadMaterials = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('http://localhost:8000/api/materials', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        const materialsData = await response.json();
        console.log('Loaded materials:', materialsData);
        // Handle both array and object responses
        const materialsArray = Array.isArray(materialsData) ? materialsData : materialsData.materials || [];
        console.log('Materials statuses:', materialsArray.map(m => ({ id: m.id, title: m.title, status: m.status })));
        setMaterials(materialsArray);
      }
    } catch (error) {
      console.error('Error loading materials:', error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleStartMaterial = (material) => {
    console.log('Starting material:', material);
    console.log('Extracted text length:', material.extracted_text?.length || 0);
    console.log('First 200 chars of extracted text:', material.extracted_text?.substring(0, 200) || 'No text');
    try {
      setSelectedMaterial(material);
      setShowExpandedView(true);
    } catch (error) {
      console.error('Error opening material:', error);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!confirm('Are you sure you want to delete this material?')) {
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch(`http://localhost:8000/api/materials/${materialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (response.ok) {
        await loadMaterials(); // Reload materials after deletion
        console.log('Material deleted successfully');
      } else {
        const errorData = await response.json();
        console.error('Delete failed:', errorData);
        alert(`Failed to delete material: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      alert(`Error deleting material: ${error.message}`);
    }
  };

  return (
    <>
      <Header>
        <Title>Dashboard</Title>
        <div>
          <ActionButton 
            onClick={handleUploadClick} 
            disabled={loading}
            style={{
              backgroundColor: '#20359A',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#1a2a7a';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#20359A';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }
            }}
          >
            {loading ? 'Uploading...' : 'Upload Material'}
          </ActionButton>
          <FileInput
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt,.doc,.docx"
          />
        </div>
      </Header>

      {!materials || materials.length === 0 ? (
        <EmptyState>
          <h3>No materials yet</h3>
          <p>Upload your first study material to get started</p>
          <StartButton onClick={handleUploadClick}>
            Upload Material
          </StartButton>
        </EmptyState>
      ) : (
        <section>
          <ClassGrid>
            {(materials || []).map(material => (
              <ClassCard key={material.id}>
                <ClassHeader>
                  <ClassTitle>{material.title}</ClassTitle>
                  <ClassBadge $completed={material.status === 'processed'}>
                    {material.status === 'processed' ? "Ready" : material.status === 'processing' ? "Processing" : "Uploaded"}
                  </ClassBadge>
                </ClassHeader>

                <ClassDescription>
                  {material.status === 'processed' 
                    ? `Ready to study - ${material.chunk_count} chunks processed`
                    : material.status === 'processing'
                    ? 'Processing content...'
                    : `Uploaded ${new Date(material.uploaded_at).toLocaleDateString()}`
                  }
                </ClassDescription>

                <ProgressBar>
                  <ProgressFill $progress={material.status === 'processed' ? 100 : material.processing_progress || 0} />
                </ProgressBar>

                <div style={{ textAlign: "center" }}>
                  <StartButton onClick={() => handleStartMaterial(material)}>
                    {material.status === 'processed' ? "Study" : "View"}
                  </StartButton>
                  <DeleteButton onClick={() => handleDeleteMaterial(material.id)}>
                    Delete
                  </DeleteButton>
                </div>
              </ClassCard>
            ))}
          </ClassGrid>
        </section>
      )}

      <ModalOverlay $show={showExpandedView}>
        <ModalContent>
          <ModalTitle>{selectedMaterial?.title || 'Loading...'}</ModalTitle>
          <p><strong>File Type:</strong> {selectedMaterial?.file_type || 'Unknown'}</p>
          <p><strong>Status:</strong> {selectedMaterial?.status || 'Unknown'}</p>
          <p><strong>Uploaded:</strong> {selectedMaterial?.uploaded_at ? new Date(selectedMaterial.uploaded_at).toLocaleDateString() : 'Unknown'}</p>
          
          <h4>Content Preview:</h4>
          <ParsedContent>
            {selectedMaterial?.extracted_text && selectedMaterial.extracted_text.length > 0
              ? (() => {
                  const text = selectedMaterial.extracted_text;
                  const previewLength = 1500;
                  const preview = text.substring(0, previewLength);
                  const isTruncated = text.length > previewLength;
                  
                  // Clean up the text for better readability
                  const cleanedText = preview
                    .replace(/\n\s*\n/g, '\n\n') // Remove excessive line breaks
                    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                    .trim();
                  
                  return (
                    <div>
                      <div style={{ 
                        lineHeight: '1.6', 
                        fontSize: '14px',
                        color: '#2c3e50',
                        textAlign: 'left'
                      }}>
                        {cleanedText}
                        {isTruncated && (
                          <span style={{ 
                            color: '#7f8c8d', 
                            fontStyle: 'italic',
                            display: 'block',
                            marginTop: '10px',
                            padding: '8px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '4px',
                            border: '1px solid #e9ecef'
                          }}>
                            ... (showing first {previewLength.toLocaleString()} of {text.length.toLocaleString()} characters)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })()
              : selectedMaterial?.status === 'processing' 
                ? <div style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    color: '#6c757d',
                    fontStyle: 'italic'
                  }}>
                    <div style={{ fontSize: '18px', marginBottom: '10px' }}>⏳</div>
                    Content is being processed. Please wait...
                  </div>
                : selectedMaterial?.status === 'failed'
                ? <div style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    color: '#dc3545',
                    backgroundColor: '#f8d7da',
                    borderRadius: '6px',
                    border: '1px solid #f5c6cb'
                  }}>
                    <div style={{ fontSize: '18px', marginBottom: '10px' }}>❌</div>
                    Content processing failed. Please try uploading again.
                  </div>
                : selectedMaterial?.status === 'processed'
                ? <div style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    color: '#856404',
                    backgroundColor: '#fff3cd',
                    borderRadius: '6px',
                    border: '1px solid #ffeaa7'
                  }}>
                    <div style={{ fontSize: '18px', marginBottom: '10px' }}>⚠️</div>
                    Content processing completed but no text was extracted. This might be a scanned PDF or image-based document.
                  </div>
                : <div style={{ 
                    textAlign: 'center', 
                    padding: '20px',
                    color: '#6c757d',
                    fontStyle: 'italic'
                  }}>
                    Content is being processed. This will show the extracted text from your uploaded file.
                  </div>}
          </ParsedContent>
          
          {selectedMaterial?.extracted_text && selectedMaterial.extracted_text.length > 0 && (
            <div style={{ 
              marginTop: '10px', 
              padding: '8px 12px',
              backgroundColor: '#e9ecef',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#6c757d',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span><strong>Text Length:</strong> {selectedMaterial.extracted_text.length.toLocaleString()} characters</span>
              <span><strong>Words:</strong> {selectedMaterial.extracted_text.split(/\s+/).filter(word => word.length > 0).length.toLocaleString()}</span>
            </div>
          )}
          
          <ModalButtons>
            <ActionButton 
              onClick={() => setShowExpandedView(false)}
              style={{ 
                backgroundColor: '#4A90E2', 
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#357ABD';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#4A90E2';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              Close
            </ActionButton>
          </ModalButtons>
        </ModalContent>
      </ModalOverlay>
      
      {/* ChatBot Component */}
      <ChatBot />
      </>
  );
}