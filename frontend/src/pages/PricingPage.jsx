import styled from "styled-components";
import Header from "../components/Header";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1.5rem;
  min-height: 100dvh;
  background: #ADCAF0;
`;

export default function TestingPage() {
  return (
    <Container>
      <Header />
      <h1>still working on pricing page</h1>
    </Container>
  );
}
