import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

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
`;

const ModalTitle = styled.h2`
  margin: 0 0 16px 0;
  font-family: 'Rethink Sans';
`;

const ParsedContent = styled.div`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
  max-height: 300px;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
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
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showExpandedView, setShowExpandedView] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    const saved = localStorage.getItem("clyvara-classes");
    if (saved) {
      setClasses(JSON.parse(saved));
    }
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newClass = {
      id: Date.now(),
      title: file.name.replace(/\.[^/.]+$/, ""),
      description: `Uploaded ${new Date().toLocaleDateString()}. Ready to study.`,
      progress: 0,
      completed: false,
      type: "uploaded",
      file: file.name,
      parsedContent: `This is sample parsed content from ${file.name}.\n\nIt would show the actual text extracted from your PDF, PPT, or DOCX file.\n\nFor now, this is just placeholder text to show how the expanded view would work.`
    };

    const updated = [...classes, newClass];
    setClasses(updated);
    localStorage.setItem("clyvara-classes", JSON.stringify(updated));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleStartClass = (classItem) => {
    setSelectedClass(classItem);
    setShowExpandedView(true);
  };

  const handleDeleteClass = (classId) => {
    const updated = classes.filter(c => c.id !== classId);
    setClasses(updated);
    localStorage.setItem("clyvara-classes", JSON.stringify(updated));
  };

  return (
    <>
      <Header>
        <Title>Dashboard</Title>
        <div>
          <ActionButton onClick={handleUploadClick}>
            Upload Material
          </ActionButton>
          <FileInput
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.txt,.doc,.docx"
          />
        </div>
      </Header>

      {classes.length === 0 ? (
        <EmptyState>
          <h3>No classes yet</h3>
          <p>Upload your first study material to get started</p>
          <StartButton onClick={handleUploadClick}>
            Upload Material
          </StartButton>
        </EmptyState>
      ) : (
        <section>
          <ClassGrid>
            {classes.map(classItem => (
              <ClassCard key={classItem.id}>
                <ClassHeader>
                  <ClassTitle>{classItem.title}</ClassTitle>
                  <ClassBadge $completed={classItem.completed}>
                    {classItem.completed ? "Done" : "In Progress"}
                  </ClassBadge>
                </ClassHeader>

                <ClassDescription>{classItem.description}</ClassDescription>

                <ProgressBar>
                  <ProgressFill $progress={classItem.progress} />
                </ProgressBar>

                <div style={{ textAlign: "center" }}>
                  <StartButton onClick={() => handleStartClass(classItem)}>
                    {classItem.progress === 0
                      ? "Start"
                      : classItem.progress === 100
                      ? "Review"
                      : "Continue"}
                  </StartButton>
                  <DeleteButton onClick={() => handleDeleteClass(classItem.id)}>
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
          <ModalTitle>{selectedClass?.title}</ModalTitle>
          <p><strong>File:</strong> {selectedClass?.file}</p>
          <p><strong>Uploaded:</strong> {selectedClass?.description}</p>
          
          <h4>Parsed Content:</h4>
          <ParsedContent>
            {selectedClass?.parsedContent || "No parsed content available. This would show the text extracted from your PDF, PPT, or DOCX file."}
          </ParsedContent>
          
          <ModalButtons>
            <ActionButton onClick={() => setShowExpandedView(false)}>
              Close
            </ActionButton>
          </ModalButtons>
        </ModalContent>
      </ModalOverlay>
      </>
  );
}