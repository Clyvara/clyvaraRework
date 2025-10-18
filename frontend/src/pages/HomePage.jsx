// Clyvara Homepage (Clyvara.org/)
//Login/Signup

import styled from "styled-components";
import Header from "../components/Header.jsx";
import ChatBot from "../components/ChatBot.jsx";
import Footer from "../components/Footer.jsx";
import Branie from "../components/Branie.jsx";
import LeftHomePage from "../components/LeftHomePage.jsx";

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


export default function HomePage() {
  return (
    <div>
      <Header />
      <Container>
        <LeftHomePage/>
        <Branie/>
      </Container>
      <Footer />
    </div>
  );
}
