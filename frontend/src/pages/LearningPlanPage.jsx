import React from "react";
import styled from "styled-components";

const Title = styled.h1`
  font-size: 36px;
  font-family: 'Rethink Sans';
  margin: 0 0 12px 0;
  color: black;
`;

const Description = styled.p`
  font-size: 16px;
  color: #555;
  line-height: 1.6;
  max-width: 600px;
`;

export default function CarePlanPage() {
  return (
    <div>
      <Title>Learning Plan</Title>
    </div>

  );
}
