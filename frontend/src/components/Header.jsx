import clyvaraIcon from "../assets/clyvaraIcon.png";
import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

//logo and login
const Container = styled.header`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.75rem 1rem;
  margin-bottom: 2rem;
`;

const HeaderInner = styled.div`
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.img`
  width: 100%;
  height: 100%;
`;

const LoginButton = styled(Link)`
  justify-self: end;
  padding: 0.55rem 1rem;
  border: 0;
  border-radius: 10px;
  background: #111827;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;

const Header = () => {
    return (
        <Container>
            <HeaderInner>
                <div />
                <Logo src={clyvaraIcon} alt="Clyvara logo" />
                <LoginButton to="/login">Log in / Sign Up</LoginButton>
            </HeaderInner>
        </Container>
    );
};

export default Header;

