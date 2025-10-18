// Clyvara Homepage (Clyvara.org/)
//Login/Signup

import styled from "styled-components";
import Header from "../components/Header.jsx";
import ChatBot from "../components/ChatBot.jsx";
import Footer from "../components/Footer.jsx";
import Branie from "../components/Branie.jsx";
import LeftHomePage from "../components/LeftHomePage.jsx";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: auto;
  background: #ADCAF0;
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
