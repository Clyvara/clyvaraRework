import React from "react";
import styled from "styled-components";
import brainie from "../assets/brainie.png";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex: 1;
  gap: 1.5rem;

//manually pushes logo + text towards center of page
  transform: translateX(-60px);
`;

const Title = styled.p`
  font-family: "Rethink Sans";
  width: 50%;
  font-size: 48px;
  color: #000;
  margin: 0;
  font-weight: 400;

  span {
    font-style: italic;
    font-weight: 500;
  }
`;

const Image = styled.img`
  width: 30%;
  height: auto;
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
