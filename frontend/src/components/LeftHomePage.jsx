import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  font-family: "Rethink Sans";

// manually pushes logo + text towards center of page
  transform: translateX(60px);
`;

const Box = styled.div`
  width: 60%;
  height: 500px;
  background: lightgray;
  border-radius: 48px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;


const Button = styled(Link)`
  padding: 0.7rem 2rem;
  border: 2px solid #111827;
  border-radius: 40px;
  background: #fff;
  color: #111827;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  font-family: "General Sans";

  &:hover {
    background: #111827;
    color: #fff;
  }
`;


export default function LeftHomePage() {
  return (
    <Container>
      <Box />
      <ButtonRow>
        <Button to="/signup">Get started</Button>
        <Button to="/login">Log in</Button>
      </ButtonRow>
    </Container>
  );
}
