//left half of the landing page

import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  font-family: "Rethink Sans";
`;

const Box = styled.div`
  width: 100%;
  height: 500px;
  background: lightgray;
  border-radius: 18px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-size: 20px;
  font-weight: 500;
  fomt-family: "General Sans";
`;


const Button = styled(Link)`
  padding: 0.7rem 2rem;
  border: 1px solid #111827;
  border-radius: 40px;
  background: #fff;
  color: #111827;
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
