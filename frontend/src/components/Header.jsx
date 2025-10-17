import clyvaraIcon from "../assets/clyvaraIcon.png";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  width: 100%;
  height: 196px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #20359A;
  padding: 0 2rem;
`;

const Logo = styled.img`
  height: 80%;
  max-height: 150px;
  object-fit: contain;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: #ffffff;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
    opacity: 0.9;
  }
`;

const Header = () => {
  return (
    <Container>
      <Logo src={clyvaraIcon} alt="Clyvara logo" />
      <NavLinks>
        <NavLink to="/pricing">Pricing</NavLink>
        <NavLink to="/login">Login</NavLink>
      </NavLinks>
    </Container>
  );
};

export default Header;
