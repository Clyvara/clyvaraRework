import React, { useMemo, useState } from "react";
import styled from "styled-components";
// If your file is named learningPlanQuestions.js, use:
// import learningPlanQuestions from "../utils/learningPlanQuestions";
import learningPlanQuestions from "../utils/learningPlanQuizQuestions";

// ---------- Shared Layout ----------
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  color: #0f172a;
  font-family: 'Rethink Sans', system-ui, sans-serif;
`;

const HeaderCard = styled.div`
  background: #eef3ff;
  border: 1px solid #dbe2ff;
  border-radius: 8px;
  padding: 24px;
`;

const Title = styled.h1`
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 600;
  color: #0f172a;
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 15px;
  font-weight: 400;
  color: #4b5563;
  text-align: center;
`;

const SectionCard = styled.div`
  background: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  padding: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0f172a;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #0f172a;
`;

// ---------- Buttons / Inputs ----------
const ActionButton = styled.button`
  background: ${props => props.$variant === 'primary' ? '#4f46e5' : props.$variant === 'danger' ? '#dc2626' : '#e5e7eb'};
  color: ${props => props.$variant === 'primary' ? 'white' : props.$variant === 'danger' ? 'white' : '#1f2937'};
  font-size: 14px;
  font-weight: 500;
  border: 0;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: ${props => props.$variant === 'primary' ? '#4338ca' : props.$variant === 'danger' ? '#b91c1c' : '#d1d5db'};
  }

  &:focus {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
`;

const TextArea = styled.textarea`
  width: 100%;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  color: #0f172a;
  min-height: 120px;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: 2px solid #4f46e5;
    border-color: #4f46e5;
  }
`;

// ---------- Video ----------
const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #000;

  /* 16:9 responsive */
  &::before {
    content: '';
    display: block;
    padding-top: 56.25%;
  }
`;

const Iframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`;

// ---------- Case Study ----------
const CaseStudyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const CaseStudyBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  line-height: 1.6;
  color: #0f172a;
`;

const SmallNote = styled.p`
  font-size: 12px;
  color: #64748b;
  margin: 0;
  font-style: italic;
`;

// ---------- Quiz ----------
const QuizList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
`;

const QuestionCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #ffffff;
`;

const QuestionText = styled.p`
  margin: 0 0 10px 0;
  font-weight: 600;
  color: #0f172a;
`;

/* Transparent bubble (unchecked) → shaded bubble (checked) */
const OptionRow = styled.label`
  display: grid;
  grid-template-columns: 22px 1fr;
  align-items: start;
  gap: 10px;
  padding: 10px 8px;
  cursor: pointer;
  color: #0f172a;
  border-radius: 8px;
  transition: background 120ms ease-in-out;

  /* focus ring on bubble when radio focused */
  input[type="radio"]:focus-visible + span.bubble {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
  }

  /* checked styles */
  input[type="radio"]:checked + span.bubble {
    background: rgba(79, 70, 229, 0.15); /* indigo tint */
    border-color: #4f46e5;
  }
  input[type="radio"]:checked + span.bubble > span.dot {
    background: #4f46e5;
  }
`;

const HiddenRadio = styled.input.attrs({ type: 'radio' })`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
`;

const Bubble = styled.span.attrs({ className: 'bubble' })`
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  border: 2px solid #cbd5e1; /* slate-300 */
  background: transparent;    /* transparent by default */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 120ms ease-in-out;
  box-sizing: border-box;
`;

const BubbleDot = styled.span.attrs({ className: 'dot' })`
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: transparent;    /* filled when checked */
  transition: background 120ms ease-in-out;
`;

const Feedback = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: ${p => (p.$correct ? '#047857' : '#b91c1c')};
`;

const Divider = styled.hr`
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 16px 0;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

// ---------- Component ----------
export default function LearningPlanPage({
  videoUrl = "https://www.youtube.com/embed/B_tTymvDWXk", 
  caseStudy,
  questions,
  allowCaseStudyEditing = false,
}) {

  const defaultCaseStudy = `CASE STUDY GOES HERE`;

  const quiz = useMemo(() => {
    const source = questions ?? learningPlanQuestions;
  
    return source.map(q => {
      const optionsWithIndex = q.options.map((opt, idx) => ({
        label: opt,
        originalIndex: idx,
      }));
  
      //shuffle
      for (let i = optionsWithIndex.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
      }
  
      const newCorrectIndex = optionsWithIndex.findIndex(
        opt => opt.originalIndex === q.correctIndex
      );
  
      return {
        ...q,
        options: optionsWithIndex.map(o => o.label),
        correctIndex: newCorrectIndex,
      };
    });
  }, [questions]);  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [editableCase, setEditableCase] = useState(caseStudy ?? defaultCaseStudy);

  const score = useMemo(() => {
    if (!submitted) return null;
    let correct = 0;
    quiz.forEach(q => {
      if (answers[q.id] === q.correctIndex) correct += 1;
    });
    return { correct, total: quiz.length };
  }, [submitted, answers, quiz]);

  const handleSelect = (qid, idx) => {
    if (submitted) return; // lock answers after submit
    setAnswers(prev => ({ ...prev, [qid]: idx }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <PageWrapper>
      {/* Header */}
      <HeaderCard>
        <Title>Learning Plan</Title>
        <Subtitle>Watch the lesson, study the case, then check your understanding with a short quiz.</Subtitle>
      </HeaderCard>

      {/* Video Section */}
      <SectionCard>
        <SectionHeader>
          <SectionTitleRow>
            <SectionTitle>Lesson Video</SectionTitle>
          </SectionTitleRow>
        </SectionHeader>

        <Divider />
        <VideoWrapper>
          <Iframe
            src={videoUrl}
            title="Learning plan video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </VideoWrapper>
      </SectionCard>

      {/* Case Study Section */}
      <SectionCard>
        <SectionHeader>
          <SectionTitleRow>
            <SectionTitle>Case Study</SectionTitle>
          </SectionTitleRow>
        </SectionHeader>

        <Divider />
        <CaseStudyGrid>
          {allowCaseStudyEditing ? (
            <div>
              <Label htmlFor="case-text">Edit Case Study</Label>
              <TextArea
                id="case-text"
                value={editableCase}
                onChange={(e) => setEditableCase(e.target.value)}
                aria-label="Case study text"
              />
              <SmallNote>Tip: You can toggle edit mode off by passing allowCaseStudyEditing={false} to freeze the text for learners.</SmallNote>
            </div>
          ) : (
            <CaseStudyBox>
              {editableCase.split('\n').map((line, i) => (
                <p key={i} style={{ margin: '0 0 8px 0' }}>{line}</p>
              ))}
            </CaseStudyBox>
          )}
        </CaseStudyGrid>
      </SectionCard>

      {/* Quiz Section */}
      <SectionCard>
        <SectionHeader>
          <SectionTitleRow>
            <SectionTitle>Knowledge Check</SectionTitle>
          </SectionTitleRow>
        </SectionHeader>

        <Divider />
        <QuizList>
          {quiz.map((q, qi) => (
            <QuestionCard key={q.id}>
              <QuestionText>{qi + 1}. {q.text}</QuestionText>

              {q.options.map((opt, idx) => (
                <OptionRow key={idx} htmlFor={`${q.id}-${idx}`}>
                  <HiddenRadio
                    id={`${q.id}-${idx}`}
                    name={q.id}
                    checked={answers[q.id] === idx}
                    onChange={() => handleSelect(q.id, idx)}
                  />
                  <Bubble><BubbleDot /></Bubble>
                  <span>{opt}</span>
                </OptionRow>
              ))}

              {submitted && (
                <Feedback $correct={answers[q.id] === q.correctIndex}>
                  {answers[q.id] === q.correctIndex ? '✅ Correct.' : '❌ Not quite.'} {q.explanation}
                </Feedback>
              )}
            </QuestionCard>
          ))}
        </QuizList>

        <Divider />
        <ActionsRow>
          <ActionButton $variant="primary" onClick={handleSubmit} disabled={submitted}>
            Submit Quiz
          </ActionButton>
          <ActionButton onClick={handleReset}>
            Reset Answers
          </ActionButton>
          {submitted && score && (
            <span style={{ color: '#0f172a', fontWeight: 600 }}>
              Score: {score.correct} / {score.total} ({Math.round((score.correct / score.total) * 100)}%)
            </span>
          )}
        </ActionsRow>
      </SectionCard>
    </PageWrapper>
  );
}
