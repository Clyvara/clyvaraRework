import { useState } from "react";
import styled from "styled-components";
import Header from "./components/Header.jsx";
import ChatBot from "./components/ChatBot.jsx";
import BackEndTesting from "./components/BackEndTesting.jsx";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1rem;
`;

export default function App() {
  return (
    <Container>
      <Header />
      <BackEndTesting />
      <ChatBot />
    </Container>
  );
}
