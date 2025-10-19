import React, { useState } from "react";
import styled from "styled-components";
import clyvaralogo from "../assets/clyvaranewlogo.svg";

/* ---------- Layout ---------- */
const Shell = styled.div`
  display: grid;
  grid-template-columns: ${p => p.$collapsed ? '80px' : '220px'} 1fr;
  min-height: 100vh;
  background: var(--beige);
  transition: grid-template-columns 0.3s ease;
`;

const Sidebar = styled.aside`
  background: var(--hudson-blue);
  color: white;
  padding: 24px ${p => p.$collapsed ? '12px' : '16px'};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: padding 0.3s ease;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  font-family: 'Rethink Sans';
  font-size: 30px;
  white-space: nowrap;
  color: var(--chelsea-rose);
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
  font-weight: 600;
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
  width: 18px;
  height: 18px;
  object-fit: contain;
  flex-shrink: 0;
`;

const NavText = styled.span`
  opacity: ${p => p.$collapsed ? 0 : 1};
  visibility: ${p => p.$collapsed ? 'hidden' : 'visible'};
  transition: all 0.3s ease;
`;

/* Toggle Button - Always visible but different styling */
const ToggleButton = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 600;
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

const SignOut = styled.button`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background: white;
  font-weight: 500;
  font-family: 'General Sans';
  cursor: pointer;
  &:hover {
    background: #f5f5f5;
  }
`;

/* ---------- Component ---------- */
export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems = [
    { label: "Account", icon: "/src/assets/account.png" },
    { label: "Dashboard", icon: "/src/assets/dashboard.png", active: true },
    { label: "Learning Plan", icon: "/src/assets/learningplan.png" },
    { label: "Care Plan", icon: "/src/assets/careplan.png" },
  ];

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Shell $collapsed={sidebarCollapsed}>
      {/* Sidebar */}
      <Sidebar $collapsed={sidebarCollapsed}>
        <div>
          <Logo>
            <LogoImg src={clyvaralogo} alt="Clyvara logo" />
            <LogoText $collapsed={sidebarCollapsed}>Clyvara</LogoText>
          </Logo>

          {/* Navigation - Only show when expanded */}
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

          {/* Toggle Button - Always visible but position changes */}
          <ToggleButton 
            onClick={handleToggleSidebar}
            $collapsed={sidebarCollapsed}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ToggleIcon viewBox="0 0 16 16">
              {sidebarCollapsed ? (
                // Hamburger icon - only thing visible when collapsed
                <>
                  <line x1="2" y1="4" x2="14" y2="4" stroke="white" strokeWidth="2" />
                  <line x1="2" y1="8" x2="14" y2="8" stroke="white" strokeWidth="2" />
                  <line x1="2" y1="12" x2="14" y2="12" stroke="white" strokeWidth="2" />
                </>
              ) : (
                // Collapse/arrow icon (points left) when expanded
                <path d="M11 2 L5 8 L11 14" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
              )}
            </ToggleIcon>
            {!sidebarCollapsed && (
              <ToggleText>Collapse</ToggleText>
            )}
          </ToggleButton>
        </div>
      </Sidebar>

      {/* Main */}
      <Main>
        <Header>
          <Title>Dashboard</Title>
          <SignOut>Sign Out</SignOut>
        </Header>

        <section>
          <h2>Welcome back!</h2>
          <p>Here's where your courses and progress will show.</p>
        </section>
      </Main>
    </Shell>
  );
}