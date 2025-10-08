import styled from "styled-components";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import ChatBot from "./components/ChatBot.jsx";
import BackEndTesting from "./components/BackEndTesting.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import GoogleSignInButton from './components/GoogleSignInButton.jsx'; 

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1.5rem;
  min-height: 100dvh;
  background: #6cb7bb;
`;

const Body = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-top: 1rem;
  padding-bottom: 5rem;
`;

// Public homepage
function HomePage() {
  return (
    <Container>
      <Header />
      <Body>
        <ChatBot />
      </Body>
    </Container>
  );
}

// Backend testing page
function TestingPage() {
  return (
    <Container>
      <Header />
      <Body>
        <BackEndTesting />
      </Body>
    </Container>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/testing" element={<TestingPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
