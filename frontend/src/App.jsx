import { useState } from "react";
import styled from "styled-components";
import Header from "./components/Header.jsx"
import ChatBot from "./components/ChatBot.jsx"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1rem;
`;

//everything below header
const BodyContainer = styled.div`
  width: 100%;
  margin-bottom: 5rem;
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  gap: 2rem;
  align-items: start;
`;

const Form = styled.form`
  display: grid;
  gap: 0.75rem;
  text-align: center;
  width: 100%;
  max-width: 300px;
  justify-self: end;
`;

const Field = styled.label`
  display: grid;
  width: auto;
  height: 5%;
`;

const Input = styled.input`
  padding: 0.6rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const Button = styled.button`
  width: auto;
  height: 50px;
  margin-top: 0.25rem;
  padding: 0.7rem 0.9rem;
  border: 0;
  border-radius: 8px;
  background: #111827;
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover { opacity: 0.9; }
`;

const Results = styled.div`
  display: grid;
  gap: 0.75rem;
  align-content: start;
`;

const ResultCard = styled.div`
  background: #f6f6f6;
  width: 20%;
  padding: 1rem;
  border-radius: 8px;
  text-align: left;
  color: #000;
  border: 1px solid #e5e5e5;
`;

export default function App() {
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [items, setItems] = useState([]);

  async function submitItem(e) {
    e.preventDefault();
    const res = await fetch("http://localhost:8000/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, school }),
    });
    const data = await res.json();
    const payload = data["json data"];
    setItems((prev) => [...prev, payload]);
    setName("");
    setSchool("");
  }

  return (
        <Container>
          <Header/>
          <BodyContainer>
            <Columns>
              {}
              <Form onSubmit={submitItem}>
                <Field>
                  Name
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="name"
                  />
                </Field>
                <Field>
                  School
                  <Input
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="school"
                  />
                </Field>
                <Button type="submit">Submit</Button>
              </Form>

              {/* Right column: results */}
              {items.length > 0 && (
                <Results>
                  {items.map((it, idx) => (
                    <ResultCard key={idx}>
                      <strong>Person {idx + 1}</strong>
                      <div><strong>Name:</strong> {it.name}</div>
                      <div><strong>School:</strong> {it.school}</div>
                    </ResultCard>
                  ))}
                </Results>
              )}
            </Columns>
          </BodyContainer>

          <ChatBot/>
        </Container>
  );
}
