import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { supabase } from "../utils/supabaseClient";
import GoogleSignInButton from "../components/GoogleSignInButton";
import clyvaranewlogo from "../assets/clyvaranewlogo.svg";
import { Eye, EyeOff } from "lucide-react";

const Page = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #ADCAF0;
  padding: 2rem 1rem;
  color: #20359A;
`;

const Card = styled.section`
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

const LogoGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 10px;
`;

const Logo = styled.img`
  width: 20%;
  height: auto;
  object-fit: contain;
`;

const Clyvara = styled.h1`
  font-size: 60px;
  font-weight: 700;
  margin: 0;
  color: #E7A0CC;
  font-family: 'Rethink Sans';
`;

const Title = styled.h1`
  margin: 20px 0 0;
  text-align: center;
  font-size: 24px;
`;

const Form = styled.form`
  display: grid;
  gap: 0.9rem;
`;

const Field = styled.label`
  display: grid;
  gap: 0.35rem;
  font-size: 0.95rem;
  margin-bottom: 10px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 0.6rem 0.75rem;
  border: 1px solid #cfcfcf;
  border-radius: 10px;
  background: #fff;
  font-size: 1rem;
  color: #111827;

  &::placeholder { color: #9ca3af; }
  &:focus {
    outline: none;
    border-color: #111827;
    box-shadow: 0 0 0 3px rgba(17,24,39,0.12);
    color: #111827;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;
const PasswordInput = styled(Input)`
  padding-right: 2.5rem;
`;
const EyeButton = styled.button`
  position: absolute;
  right: 0.6rem;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #6b7280;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover { color: #111827; }
`;

const Button = styled.button`
  padding: 12.8px 15.2px;
  border: 0;
  border-radius: 999px;
  background: #111827;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.06s ease;
  &:hover { opacity: 0.95; }
  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const OrLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #20359A;
  font-weight: 600;
  font-size: 20px;
  margin-top: 10px;
`;

const OutlinedButtonLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  width: 100%;
  padding: 12px 0;
  border-radius: 999px;
  border: 2px solid #111827;
  background: transparent;
  color: #111827;
  font-weight: 700;
  text-decoration: none;
  font-size: 1rem;
  transition: background 0.15s ease, transform 0.06s ease;

  &:hover { background: rgba(0,0,0,0.08); }
  &:active { transform: translateY(1px); }
`;

const Message = styled.p`
  margin: 0.25rem 0 0;
  font-size: 0.95rem;
  color: #0b1c3f;
  font-weight: 600;
  text-align: center;
`;

const BottomRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;
const BackLink = styled(Link)`
  color: #0b1c3f;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  &:hover { text-decoration: underline; }
`;

export default function SignupPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
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
    <Page>
      <Card>
        <LogoGroup>
          <Logo src={clyvaranewlogo} alt="Clyvara logo" />
          <Clyvara>Clyvara</Clyvara>
        </LogoGroup>

        <Title>Sign Up</Title>

        <Form onSubmit={handleSubmit}>
          <Field htmlFor="email">
            Email
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field htmlFor="password">
            Password
            <PasswordWrapper>
              <PasswordInput
                id="password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPass(e.target.value)}
                required
                minLength={6}
              />
              <EyeButton
                type="button"
                onClick={() => setShowPass(v => !v)}
                aria-label={showPass ? "Hide password" : "Show password"}
                aria-pressed={showPass}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </EyeButton>
            </PasswordWrapper>
          </Field>

          <Button disabled={loading}>
            {loading ? "Working…" : "Create Account"}
          </Button>

          {/* Same Google button / OR / Switch button pattern as login */}
          <GoogleSignInButton />
          <OrLine>OR</OrLine>
          <OutlinedButtonLink to="/login">Log In</OutlinedButtonLink>
        </Form>

        {msg && <Message>{msg}</Message>}

        <BottomRow>
          <BackLink to="/">← Back</BackLink>
        </BottomRow>
      </Card>
    </Page>
  );
}
