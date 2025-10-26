import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import clyvaralogo from "../assets/clyvaranewlogo.svg";
import ChatBot from "../components/ChatBot.jsx";
import { Link } from "react-router-dom";


/* ---------- Layout ---------- */
const Shell = styled.div`
  display: grid;
  grid-template-columns: ${p => p.$collapsed ? '80px' : '220px'} 1fr;
  min-height: 100vh;
  background: #f8f9fa;
  transition: grid-template-columns 0.3s ease;
`;

const Sidebar = styled.aside`
  background: #20359A;
  color: white;
  padding: 24px ${p => p.$collapsed ? '12px' : '16px'};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: padding 0.3s ease;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-family: 'Rethink Sans';
  font-size: 30px;
  white-space: nowrap;
  color: #E7A0CC;
  &:hover {
    text-decoration: none;
    color: #E7A0CC;
  }
`;

const LogoImg = styled.img`
  width: 50px;
  height: 50px;
  object-fit: contain;
  flex-shrink: 0;
`;

const LogoText = styled.span`
  opacity: ${p => p.$collapsed ? 0 : 1};
  visibility: ${p => p.$collapsed ? 'hidden' : 'visible'};
  transition: all 0.3s ease;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`;

const NavItem = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 400;
  font-family: 'General Sans';
  cursor: pointer;
  background: ${(p) => (p.$active ? "rgba(255,255,255,.2)" : "transparent")};
  white-space: nowrap;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
  &:focus {
    outline: none;
  }
`;

const NavIcon = styled.img`
  height: 80%;
  max-height: 50px;
  object-fit: contain;
  flex-shrink: 0;
`;

const NavText = styled.span`
  opacity: ${p => p.$collapsed ? 0 : 1};
  visibility: ${p => p.$collapsed ? 'hidden' : 'visible'};
  transition: all 0.3s ease;
  font-family: 'General Sans';
  font-weight: 400;
`;

const ToggleButton = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 400;
  font-family: 'General Sans';
  cursor: pointer;
  background: transparent;
  white-space: nowrap;
  margin-top: ${p => p.$collapsed ? '0' : '24px'};
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
  &:focus {
    outline: none;
  }
`;

const ToggleIcon = styled.svg`
  width: 18px;
  height: 18px;
  flex-shrink: 0;
`;

const ToggleText = styled.span`
  opacity: ${p => p.$collapsed ? 0 : 1};
  visibility: ${p => p.$collapsed ? 'hidden' : 'visible'};
  transition: all 0.3s ease;
  font-family: 'General Sans';
  font-weight: 400;
`;

/* ---------- Main Content ---------- */
const Main = styled.main`
  padding: 28px 32px;
  background: white;
`;

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

/* ---------- Progress Bar ---------- */
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

/* ---------- Class Cards ---------- */
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
  font-weight: 700;
  margin: 0;
  color: #333;
  font-family: 'General Sans';
  font-weight: 400;
`;

const ClassBadge = styled.div`
  background: ${p => p.$completed ? '#20359A' : '#4A90E2'};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 400;
  font-family: 'General Sans';
`;

const ClassDescription = styled.p`
  color: #666;
  font-size: 14px;
  font-family: 'General Sans';
  line-height: 1.5;
  margin: 0 0 12px 0;
  font-weight: 400;
`;

const StartButton = styled.button`
  all: unset;
  background: #20359A;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  font-family: 'General Sans';
  font-size: 14px;
  fomt-family: 'General Sans';
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
  font-weight: 500;
  font-family: 'General Sans';
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

/* ---------- Expanded View Modal ---------- */
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
  font-family: 'General Sans';
  font-weight: 400;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
  font-family: 'General Sans';
  font-weight: 500;
`;

/* ---------- Empty State ---------- */
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

const FileInput = styled.input`
  display: none;
`;

/* ---------- Component ---------- */
export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showExpandedView, setShowExpandedView] = useState(false);
  const fileInputRef = useRef();

  const navItems = [
    { label: "Account", icon: "/src/assets/account.png" },
    { label: "Dashboard", icon: "/src/assets/dashboard.png", active: true },
    { label: "Learning Plan", icon: "/src/assets/learningplan.png" },
    { label: "Care Plan", icon: "/src/assets/careplan.png" },
  ];

  // Load classes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("clyvara-classes");
    if (saved) {
      setClasses(JSON.parse(saved));
    }
  }, []);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Simple file upload - just adds a new class
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newClass = {
      id: Date.now(),
      title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
      description: `Uploaded ${new Date().toLocaleDateString()}. Ready to study.`,
      progress: 0,
      completed: false,
      type: "uploaded",
      file: file.name,
      // Add some sample parsed content for testing
      parsedContent: `This is sample parsed content from ${file.name}.\n\nIt would show the actual text extracted from your PDF, PPT, or DOCX file.\n\nFor now, this is just placeholder text to show how the expanded view would work.`
    };
    
    const updated = [...classes, newClass];
    setClasses(updated);
    localStorage.setItem("clyvara-classes", JSON.stringify(updated));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Combined Start/View function - opens the expanded view
  const handleStartClass = (classItem) => {
    setSelectedClass(classItem);
    setShowExpandedView(true);
  };

  const handleDeleteClass = (classId) => {
    const updated = classes.filter(classItem => classItem.id !== classId);
    setClasses(updated);
    localStorage.setItem("clyvara-classes", JSON.stringify(updated));
  };

  return (
    <Shell $collapsed={sidebarCollapsed}>
      {/* Sidebar */}
      <Sidebar $collapsed={sidebarCollapsed}>
        <div>
          <Logo to="/">
            <LogoImg src={clyvaralogo} alt="Clyvara logo" />
            <LogoText $collapsed={sidebarCollapsed}>Clyvara</LogoText>
          </Logo>

          {!sidebarCollapsed && (
            <Nav>
              {navItems.map(({ label, icon, active }) => (
                <NavItem key={label} $active={active}>
                  <NavIcon src={icon} alt="" onError={(e) => (e.target.style.display = "none")} />
                  <NavText>{label}</NavText>
                </NavItem>
              ))}
            </Nav>
          )}

          <ToggleButton 
            onClick={handleToggleSidebar}
            $collapsed={sidebarCollapsed}
          >
            <ToggleIcon viewBox="0 0 16 16">
              {sidebarCollapsed ? (
                <>
                  <line x1="2" y1="4" x2="14" y2="4" stroke="white" strokeWidth="2" />
                  <line x1="2" y1="8" x2="14" y2="8" stroke="white" strokeWidth="2" />
                  <line x1="2" y1="12" x2="14" y2="12" stroke="white" strokeWidth="2" />
                </>
              ) : (
                <path d="M11 2 L5 8 L11 14" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
              )}
            </ToggleIcon>
            {!sidebarCollapsed && <ToggleText>Collapse</ToggleText>}
          </ToggleButton>
        </div>
      </Sidebar>

      {/* Main */}
      <Main>
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
                      {classItem.completed ? 'Done' : 'In Progress'}
                    </ClassBadge>
                  </ClassHeader>
                  
                  <ClassDescription>{classItem.description}</ClassDescription>
                  
                  <ProgressBar>
                    <ProgressFill $progress={classItem.progress} />
                  </ProgressBar>
                  
                  <div style={{ textAlign: 'center' }}>
                    <StartButton onClick={() => handleStartClass(classItem)}>
                      {classItem.progress === 0 ? 'Start' : 
                       classItem.progress === 100 ? 'Review' : 'Continue'}
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
      </Main>

      {/* Expanded View Modal */}
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

      <ChatBot />
    </Shell>
  );
}