// Clyvara Homepage (Clyvara.org/)
//Login/Signup

import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import ChatBot from "../components/ChatBot.jsx";
import Footer from "../components/Footer.jsx";
import Branie from "../components/Branie.jsx";
import LeftHomePage from "../components/LeftHomePage.jsx";
import Testimonials from "../components/Testimonials.jsx";
import { useAuth } from "../utils/useAuth";

const Container = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
  width: 100%;
  min-height: calc(100vh - 196px);
  background: #ADCAF0;
  padding: 48px 58px;
  box-sizing: border-box;
  margin-top 20px;
`;


const DashboardButton = styled.button`
  background: #20359A;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  margin: 20px auto;
  display: block;
  
  &:hover {
    background: #1a2a7a;
  }
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #20359A, #4A90E2);
  color: white;
  margin: 20px 0;
  border-radius: 12px;
`;

export default function HomePage() {
  const { user, checking } = useAuth();
  const navigate = useNavigate();

  // Show loading while checking auth
  if (checking) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        Loading...
      </div>
    );
  }

  // If user is logged in, show welcome message with dashboard access
  if (user) {
    return (
      <div>
        <Header />
        <WelcomeMessage>
          <h2>Welcome back, {user.email}!</h2>
          <p>Ready to continue your learning journey?</p>
          <DashboardButton onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </DashboardButton>
        </WelcomeMessage>
        <Container>
          <LeftHomePage/>
          <Branie/>
        </Container>
        <Testimonials/>
        <Footer />
      </div>
    );
  }

  // Default homepage for non-authenticated users
  return (
    <div>
      <Header />
      <Container>
        <LeftHomePage/>
        <Branie/>
      </Container>
      <Testimonials/>
      <Footer />
    </div>
  );
}
