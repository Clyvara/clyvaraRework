import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { supabase } from "../utils/supabaseClient";

const Wrapper = styled.main`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 2rem;
`;

const Card = styled.section`
  width: 100%;
  max-width: 440px;
  padding: 2rem;
  border: 1px solid #e6e6e6;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
`;

const Form = styled.form`
  display: grid;
  gap: 0.75rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  font-size: 1rem;
  &:focus {
    border-color: #6c5ce7;
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.15);
    outline: none;
  }
`;

const Button = styled.button`
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  background: #6c5ce7;
  color: white;
  cursor: pointer;
  transition: 0.2s;
  &:hover {
    opacity: 0.9;
  }
`;

const HelperText = styled.p`
  margin-top: 1rem;
  font-size: 0.92rem;
  text-align: center;
`;

const LoginLink = styled(Link)`
  color: #6c5ce7;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`;

export default function SignupPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const { error } = await supabase.auth.signUp({ email, password });

    setLoading(false);
    if (error) setMsg(error.message);
    else setMsg("Check your email to confirm your account before logging in.");
  }

  return (
    <Wrapper>
      <Card>
        <Title>Create your account</Title>

        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPass(e.target.value)}
            required
            minLength={6}
          />
          <Button disabled={loading}>
            {loading ? "Working…" : "Sign up"}
          </Button>
        </Form>

        {msg && <HelperText>{msg}</HelperText>}

        <HelperText>
          Already have an account? <LoginLink to="/login">Log in</LoginLink>
        </HelperText>
      </Card>
    </Wrapper>
  );
}
