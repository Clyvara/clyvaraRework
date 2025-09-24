import { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import clyvaraIcon from "../assets/clyvaraIcon.png";

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #6cb7bb;
  padding: 2rem 1rem;
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  padding: 1.5rem;
  display: grid;
  gap: 1rem;
`;

const Logo = styled.img`
  height: 56px;
  width: auto;
  justify-self: center;
`;

const Title = styled.h1`
  margin: 0.25rem 0 0.5rem;
  text-align: center;
  font-size: 1.4rem;
`;

const Form = styled.form`
  display: grid;
  gap: 0.75rem;
`;

const Field = styled.label`
  display: grid;
  gap: 0.35rem;
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 0.6rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Button = styled.button`
  padding: 0.7rem 0.9rem;
  border: 0;
  border-radius: 8px;
  background: #111827;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  &:hover { opacity: 0.9; }
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: .9rem;
`;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();

    // TODO: hook to your backend auth
    // Example:
    // const res = await fetch("http://localhost:8000/auth/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email, password }),
    // });
    // const data = await res.json();
    // if (res.ok) navigate("/"); else show error

    console.log({ email, password });
    navigate("/"); // navigavtes back to homepage for now
  }

  return (
    <Page>
      <Card>
        <Logo src={clyvaraIcon} alt="Clyvara" />
        <Title>Log in!</Title>

        <Form onSubmit={onSubmit}>
          <Field>
            Email
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </Field>

          <Field>
            Password
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </Field>

          <Button type="submit">Log In</Button>
        </Form>

        <FooterRow>
          <Link to="/" style={{ color: "#0b1c3f", textDecoration: "none", fontWeight: 600 }}>
            ← Back to Homepage
          </Link>
        </FooterRow>
      </Card>
    </Page>
  );
}
