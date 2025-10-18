import clyvaranewlogo from "../assets/clyvaranewlogo.svg";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 196px;
  background: #20359A;
  color: #E7A0CC;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 58px;
  box-sizing: border-box;
`;

const LeftGroup = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: inherit;
`;

const Logo = styled.img`
  height: 80%;
  max-height: 100px;
  object-fit: contain;
`;

const Title = styled.h1`
  font-size: 72px;
  font-weight: 700;
  margin: 0;
  color: #E7A0CC;
  font-family: 'Rethink Sans';
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: #E7A0CC;
  font-weight: 700;
  font-size: 50px;
  font-family: 'Rethink Sans';
  text-decoration: none;

  &:hover {
    opacity: 0.9;
  }
`;

const Header = () => {
  return (
    <Container>
      <LeftGroup to="/">
        <Logo src={clyvaranewlogo} alt="Clyvara logo" />
        <Title>Clyvara</Title>
      </LeftGroup>

      <NavLinks>
        <NavLink to="/pricing">Pricing</NavLink>
        <NavLink to="/login">Start for free</NavLink>
      </NavLinks>
    </Container>
  );
};

export default Header;
