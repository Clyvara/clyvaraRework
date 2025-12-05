//brainie logo

import React from "react";
import styled from "styled-components";
import brainie from "../assets/brainie.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 2rem;
  padding: 10px 0px; 
`;

const Title = styled.p`
  font-family: "Rethink Sans";
  width: 70%;
  font-size: 40px;
  color: #000;
  margin: 0;

  span {
    font-style: italic;
    font-weight: 500;
  }
    @media (max-width: 768px) {
    font-size: 24px;
    width: 90%;
  }
`;

const Image = styled.img`
  width: 30%;
  height: auto;
  @media (max-width: 768px) {
    width: 50%;
  }
`;



export default function Brainie() {
  return (
    <Container>
      <Title>
        The home for <span>all</span> healthcare students!
      </Title>
      <Image src={brainie} alt="Brainie" />
    </Container>
  );
}
