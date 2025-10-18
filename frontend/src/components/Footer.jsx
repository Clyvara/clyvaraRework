import styled from "styled-components";
import clyvaranewlogo from "../assets/clyvaranewlogo.svg";
import { Link } from "react-router-dom";
// import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";

const Container = styled.footer`
  width: 100%;
  height: auto;
  background: #20359A;
  color: #E7A0CC;
  padding: 80px 200px 100px 100px;
  box-sizing: border-box;
  font-family: "Rethink Sans";

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 2rem;
`;

// Logo and Tagline
const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;             
  max-width: 600px;
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Logo = styled.img`
  width: 30%;
  height: auto;
`;

const Title = styled.h1`
  font-size: 72px;
  font-weight: 700;
  margin: 0;
  color: #E7A0CC;
`;

const Tagline = styled.p`
  margin: 0;
  font-size: 48px;
  font-weight: 700;
  color: #F9F9F9;
`;

const Columns = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7rem;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ColumnTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: white;
`;

const FooterLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
    opacity: 0.9;
  }
`;

const SocialRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 0.25rem;

  a {
    color: #E7A0CC;
    font-size: 1.25rem;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const Footer = () => {
  return (
    <Container>
      <Left>
        <Brand>
          <Logo src={clyvaranewlogo} alt="Clyvara logo" />
          <Title>Clyvara</Title>
        </Brand>
        <Tagline>Change lives.</Tagline>
      </Left>

      <Columns>
        <Column>
          <ColumnTitle>ABOUT</ColumnTitle>
          <FooterLink to="/">Mission</FooterLink>
          <FooterLink to="/">Courses</FooterLink>
          <FooterLink to="/pricing">Pricing</FooterLink>
        </Column>

        <Column>
          <ColumnTitle>SUPPORT</ColumnTitle>
          <FooterLink to="/">Contact Us</FooterLink>
        </Column>

        <Column>
          <ColumnTitle>LEGAL</ColumnTitle>
          <FooterLink to="/">Terms & Conditions</FooterLink>
          <FooterLink to="/">Privacy Policy</FooterLink>
        </Column>

        <Column>
          <ColumnTitle>SOCIAL</ColumnTitle>
          Temp holder
          {/* <SocialRow>
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="X (Twitter)"><FaXTwitter /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
          </SocialRow> */}
        </Column>
      </Columns>
    </Container>
  );
};

export default Footer;
