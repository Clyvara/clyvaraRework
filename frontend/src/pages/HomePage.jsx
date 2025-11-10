// Clyvara Homepage (Clyvara.org/)
//Login/Signup

import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import ChatBot from "../components/ChatBot.jsx";
import Footer from "../components/Footer.jsx";
import Branie from "../components/Brainie.jsx";
import LeftHomePage from "../components/LeftHomePage.jsx";
import Testimonials from "../components/Testimonials.jsx";
import { useAuth } from "../utils/useAuth";


const Container = styled.main`
  display: grid;
  max-width: 1440px;
  grid-template-columns: 1fr 1fr;
  align-items: flex-start;
  justify-content: space-between;
  gap: 3rem;
  width: 100%;
  min-height: calc(100vh + 100px);
  background: var(--central-park-sky);
  padding: 48px 58px;
  box-sizing: border-box;
  margin-top 20px;
`;


const DashboardButton = styled.button`
  background: #20359a;
  color: #ffffff;
  padding: 10px 22px;
  border: none;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #1a2a7a;
    transform: translateY(-1px);
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

  // I like having just one landing page and having the dashboard get the welcome message
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
