import React from "react";
import styled from "styled-components";
import brainie from "../assets/brainie.png"; // adjust path if needed

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* fill viewport vertically */
  text-align: center;
`;

const Title = styled.h1`
  font-family: "Rethink Sans";
  font-size: 2rem;
  color: #20359a;
  margin-bottom: 1rem;
`;

const Image = styled.img`
  width: 45%;
  height: auto;
`;

export default function Branie() {
  return (
    <Container>
      <Title>The home for all healthcare students!</Title>
      <Image src={brainie} alt="Brainie" />
    </Container>
  );
}
