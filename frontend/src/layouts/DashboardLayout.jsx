//general layout for any page with the dashboard

import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar.jsx";

const Shell = styled.div`
  display: grid;
  grid-template-columns: ${p => p.$collapsed ? '80px' : '220px'} 1fr;
  min-height: 100vh;
  background: #f8f9fa;
  transition: grid-template-columns 0.3s ease;
`;

const Main = styled.main`
  padding: 28px 32px;
  background: white;
`;

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <Shell $collapsed={sidebarCollapsed}>
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(prev => !prev)}
      />

      <Main>
        <Outlet />
      </Main>
    </Shell>
  );
}
