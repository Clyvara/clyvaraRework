import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  background: #20359A;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  font-family: "General Sans";
  border-top-left-radius: 100px;
  border-top-right-radius: 100px;
  padding-bottom: 40px;
  margin-top: -80px;
  min-height: calc(100vh - 196px);
  
`;

const Tagline = styled.div`
  color: white;
  font-family: "General Sans", sans-serif;
  font-size: 40px;
  text-align: center;
  font-weight: 400;
  width: 100%;
  padding-top: 124px;
  padding-bottom: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 34px;
  width: 90%;
  margin: 0 auto;
`;

const Card = styled.div`
  background: #E9EBF3;
  border-radius: 20px;
  padding: 2rem;
  text-align: left;
  color: #20359A;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
  font-size: 1.25rem;
  line-height: 1.6;
  height: 300px;

  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
  }
`;

const Name = styled.div`
  font-weight: 700;
  margin-top: 1rem;
`;

const Role = styled.div`
  font-weight: 400;
  font-size: 0.95rem;
  color: #5a5a5a;
`;

const testimonialsData = [
  {
    quote: "Clyvara helped me turn an overwhelming syllabus into focused, high-yield study sessions.",
    name: "— Aidan L.",
    role: "2nd Year Medical Student",
  },
  {
    quote: "I assign Clyvara to every student I coach—it's concise, evidence-based, and practical.",
    name: "— Claryssa T.",
    role: "CRNA & Clinical Educator",
  },
  {
    quote: "The AI care plans feel like having a preceptor in my pocket.",
    name: "— Kei O.",
    role: "SRNA & Teaching Assistant",
  },
  {
    quote: "From concept maps to quizzes, Clyvara keeps me accountable without the stress.",
    name: "— Aidan L.",
    role: "1st Year Medical Student",
  },
  {
    quote: "As a program director, I trust Clyvara to keep our cohort synced and clinically ready.",
    name: "— Claryssa T.",
    role: "Program Director",
  },
  {
    quote: "Clyvara turned my PDF uploads into flashcards and questions faster than I could do it manually.",
    name: "— Kei O.",
    role: "CRNA Resident",
  },
];

const getRandomTestimonials = (count = 3) => {
  const shuffled = [...testimonialsData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const Testimonials = () => {
  const testimonials = getRandomTestimonials();

  return (
    <Container>
      <Tagline>Trusted by students.</Tagline>

      <Grid>
        {testimonials.map(({ quote, name, role }, idx) => (
          <Card key={`${name}-${idx}`}>
            {`“${quote}”`}
            <Name>{name}</Name>
            <Role>{role}</Role>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default Testimonials;
