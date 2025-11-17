import styled from "styled-components";
import Header from "../components/Header.jsx";
import BackEndTesting from "../components/BackEndTesting.jsx";

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

export default function TestingPage() {
  return (
    <Container>
      <Header />
      <Body>
        hello
        <BackEndTesting />
      </Body>
    </Container>
  );
}
