import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1.5rem;
  min-height: 100dvh;
  background: #6cb7bb;
`;

export default function TestingPage() {
  return (
    <Container>
      <b>PRICING</b>
    </Container>
  );
}
