import styled from "styled-components";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../utils/useAuth";

const Shell = styled.main`
  min-height: 100dvh;
  padding: 2rem;
  background: #fafafa;
`;

const Container = styled.section`
  max-width: 960px;
  margin: 0 auto;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Brand = styled.h1`
  font-size: 1.75rem;
  margin: 0;
`;

const SignOut = styled.button`
  padding: 0.6rem 0.9rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.15s ease, box-shadow 0.2s ease;
  &:hover { background: #f8f8f8; box-shadow: 0 4px 12px rgba(0,0,0,0.07); }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 8px 20px rgba(0,0,0,0.04);
`;

const Muted = styled.p`
  color: #666;
`;

export default function Dashboard() {
  const { user } = useAuth();

  async function handleSignOut() {
    await supabase.auth.signOut();
    // ProtectedRoute will redirect to /signup after this fires
  }

  return (
    <Shell>
      <Container>
        <Header>
          <Brand>Dashboard</Brand>
          <SignOut onClick={handleSignOut}>Sign out</SignOut>
        </Header>

        <CardGrid>
          <Card>
            <h3>Welcome</h3>
            <Muted>Signed in as</Muted>
            <p><strong>{user?.email}</strong></p>
          </Card>

          <Card>
            <h3>Getting started</h3>
            <ul>
              <li>Add protected content here.</li>
              <li>Create tables in Supabase and enable RLS.</li>
              <li>Fetch data with your `supabase` client.</li>
            </ul>
          </Card>
        </CardGrid>
      </Container>
    </Shell>
  );
}
