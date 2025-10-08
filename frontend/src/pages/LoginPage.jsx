import { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import clyvaraIcon from "../assets/clyvaraIcon.png";
import { supabase } from "../utils/supabaseClient";
import GoogleSignInButton from '../components/GoogleSignInButton';

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
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(6px);
  border-radius: 16px;
  padding: 1.5rem;
  display: grid;
  gap: 1rem;
  box-shadow: 0 10px 24px rgba(0,0,0,0.12);
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
  gap: 0.9rem;
`;

const Field = styled.label`
  display: grid;
  gap: 0.35rem;
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 0.6rem 0.75rem;
  border: 1px solid #cfcfcf;
  border-radius: 10px;
  background: #fff;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #111827;
    box-shadow: 0 0 0 3px rgba(17,24,39,0.12);
  }
`;

const PasswordRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 0.5rem;
`;

const Toggle = styled.button`
  border: 0;
  background: transparent;
  color: #111827;
  font-weight: 600;
  cursor: pointer;
  padding: 0.25rem 0.4rem;
  border-radius: 6px;
  &:hover { background: rgba(0,0,0,0.05); }
`;

const Button = styled.button`
  padding: 0.8rem 0.95rem;
  border: 0;
  border-radius: 10px;
  background: #111827;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.06s ease;
  &:hover { opacity: 0.95; }
  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: .92rem;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const InlineLink = styled(Link)`
  color: #0b1c3f;
  text-decoration: none;
  font-weight: 700;
  &:hover { text-decoration: underline; }
`;

const Message = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
  color: ${(p) => (p.$error ? "#b00020" : "#0b1c3f")};
  font-weight: ${(p) => (p.$error ? 700 : 600)};
  text-align: center;
`;

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");
    setIsError(false);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setIsError(true);
      // Common Supabase responses: "Invalid login credentials", "Email not confirmed"
      setMsg(error.message || "Unable to log in. Please check your credentials.");
      return;
    }
    // Success → back to homepage
    nav("/", { replace: true });
  }

  return (
    <Page>
      <Card>
        <Logo src={clyvaraIcon} alt="Clyvara" />
        <Title>Log in</Title>

        <Form onSubmit={onSubmit}>
          <Field htmlFor="email">
            Email
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </Field>

          <Field htmlFor="password">
            Password
            <PasswordRow>
              <Input
                id="password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                minLength={6}
              />
              <Toggle type="button" onClick={() => setShowPass((v) => !v)}>
                {showPass ? "Hide" : "Show"}
              </Toggle>
            </PasswordRow>
          </Field>

          <GoogleSignInButton />

          <Button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Log In"}
          </Button>
        </Form>

        {msg && <Message $error={isError}>{msg}</Message>}

        <FooterRow>
          <InlineLink to="/">← Back to Homepage</InlineLink>
          <span>
            Don’t have an account?{" "}
            <InlineLink to="/signup">Sign up</InlineLink>
          </span>
        </FooterRow>
      </Card>
    </Page>
  );
}
