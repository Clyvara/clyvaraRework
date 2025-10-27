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

const Testimonials = () => {
  return (
    <Container>
      <Tagline>Trusted by students.</Tagline>

      <Grid>
        <Card>
          “Clyvara is good.”
          <Name>— Aidan L.</Name>
          <Role>2nd Year Medical Student</Role>
        </Card>

        <Card>
          “Clyvara is good.”
          <Name>— Aidan L.</Name>
          <Role>2nd Year Medical Student</Role>
        </Card>

        <Card>
          “Clyvara is good.”
          <Name>— Aidan L.</Name>
          <Role>2nd Year Medical Student</Role>
        </Card>
      </Grid>
    </Container>
  );
};

export default Testimonials;
