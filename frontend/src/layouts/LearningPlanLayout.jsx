import React, { useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { supabase } from "../utils/supabaseClient";

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
  background: ${props =>
    props.$variant === "primary"
      ? "#4f46e5"
      : props.$variant === "danger"
      ? "#dc2626"
      : "#e5e7eb"};
  color: ${props =>
    props.$variant === "primary" || props.$variant === "danger"
      ? "white"
      : "#1f2937"};
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
    background: ${props =>
      props.$variant === "primary"
        ? "#4338ca"
        : props.$variant === "danger"
        ? "#b91c1c"
        : "#d1d5db"};
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

// ---------- Video ----------
const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  background: #000;

  &::before {
    content: "";
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

const VideoElement = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`;

// ---------- Multi-Video Grid ----------
const VideoGrid = styled.div`
  display: grid;
  gap: 16px;

  grid-template-columns: ${({ count }) =>
    count === 1
      ? "1fr"
      : count === 2
      ? "repeat(2, 1fr)"
      : "repeat(3, 1fr)"};
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

const PdfStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
`;

const PdfFrame = styled.iframe`
  width: 90%;
  min-height: 600px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  
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

  input[type="radio"]:focus-visible + span.bubble {
    outline: 2px solid #4f46e5;
    outline-offset: 2px;
  }

  input[type="radio"]:checked + span.bubble {
    background: rgba(79, 70, 229, 0.15);
    border-color: #4f46e5;
  }
  input[type="radio"]:checked + span.bubble > span.dot {
    background: #4f46e5;
  }
`;

const HiddenRadio = styled.input.attrs({ type: "radio" })`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
`;

const Bubble = styled.span.attrs({ className: "bubble" })`
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  border: 2px solid #cbd5e1;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 120ms ease-in-out;
  box-sizing: border-box;
`;

const BubbleDot = styled.span.attrs({ className: "dot" })`
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: transparent;
  transition: background 120ms ease-in-out;
`;

const Feedback = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: ${p => (p.$correct ? "#047857" : "#b91c1c")};
`;

export function LearningPlanLayout({ title, subtitle, children }) {
  return (
    <PageWrapper>
      <HeaderCard>
        <Title>{title}</Title>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
      </HeaderCard>
      {children}
    </PageWrapper>
  );
}

// Lesson Video
export function LessonVideoSection({
  sectionTitle = "Lesson Video",
  videoUrl,
  videoUrls,
}) {

    const urls = useMemo(() => {
    if (Array.isArray(videoUrls) && videoUrls.length > 0) return videoUrls;
    if (videoUrl) return [videoUrl];
    return [];
  }, [videoUrls, videoUrl]);

  const isYouTubeUrl = (url) =>
    typeof url === "string" &&
    (url.includes("youtube.com") || url.includes("youtu.be"));

  return (
    <SectionCard>
      <SectionHeader>
        <SectionTitleRow>
          <SectionTitle>{sectionTitle}</SectionTitle>
        </SectionTitleRow>
      </SectionHeader>

      <Divider />

      {urls.length === 0 ? (
        <SmallNote>No video available.</SmallNote>
      ) : (
        <VideoGrid count={urls.length}>
          {urls.map((url, index) => (
            <VideoWrapper key={index}>
              {isYouTubeUrl(url) ? (
                <Iframe
                  src={url}
                  title={
                    urls.length > 1
                      ? `${sectionTitle} (${index + 1})`
                      : sectionTitle
                  }
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <VideoElement
                  controls
                  title={
                    urls.length > 1
                      ? `${sectionTitle} (${index + 1})`
                      : sectionTitle
                  }
                >
                  <source src={url} type="video/mp4" />
                  Your browser does not support the video tag.
                </VideoElement>
              )}
            </VideoWrapper>
          ))}
        </VideoGrid>
      )}
    </SectionCard>
  );
}

export function CaseStudySection({
    sectionTitle = "Case Study",
    initialText,
    allowEditing = false,
    pdfUrls,
  }) {
    const [text, setText] = useState(initialText ?? "");
    const hasText = text && text.trim().length > 0;
    const hasPdfs = Array.isArray(pdfUrls) && pdfUrls.length > 0;
  
    return (
      <SectionCard>
        <SectionHeader>
          <SectionTitleRow>
            <SectionTitle>{sectionTitle}</SectionTitle>
          </SectionTitleRow>
        </SectionHeader>
  
        <Divider />
        <CaseStudyGrid>
          {allowEditing ? (
            <div>
              <Label htmlFor="case-text">Edit Case Study</Label>
              <TextArea
                id="case-text"
                value={text}
                onChange={e => setText(e.target.value)}
                aria-label="Case study text"
              />
              <SmallNote>
                Tip: Disable editing in production by setting allowEditing=false.
              </SmallNote>
            </div>
          ) : (
            <>
              {hasText && (
                <CaseStudyBox>
                  {text.split("\n").map((line, i) => (
                    <p key={i} style={{ margin: "0 0 8px 0" }}>
                      {line}
                    </p>
                  ))}
                </CaseStudyBox>
              )}
  
              {hasPdfs && (
                <PdfStack>
                  {pdfUrls.map((url, idx) => (
                    <PdfFrame
                      key={idx}
                      src={url}
                      title={`${sectionTitle} PDF ${idx + 1}`}
                    />
                  ))}
                </PdfStack>
              )}
  
              {!hasText && !hasPdfs && (
                <SmallNote>No content available.</SmallNote>
              )}
            </>
          )}
        </CaseStudyGrid>
      </SectionCard>
    );
  }

// Quiz Section
export function QuizSection({
  sectionTitle = "Knowledge Check",
  questions: initialQuestions, // topic-specific questions
  topic = null, // e.g., "Opioids", "Inhaled Anesthetics"
  learningPlanTitle = null, // e.g., "Opioids", "Inhaled Anesthetics"
  caseStudy = "", // Optional case study text
  videoUrl = null, // Optional video URL
  enableDatabase = true, // Enable database integration
  numQuestions = 3, // Number of questions to generate
  enableGenerateQuestions = true, // Enable question generation button
}) {
  // Start with null questions - only show quiz after generation
  const [questions, setQuestions] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [learningPlanId, setLearningPlanId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [quizMapping, setQuizMapping] = useState({});
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState(null);

  // Don't use initialQuestions - we want to start blank

  const quiz = useMemo(() => {
    // Only use questions if they exist (after generation)
    if (!questions || questions.length === 0) {
      return [];
    }

    // No shuffling - keep options in original order
    // This ensures the index the user clicks matches what gets stored in the database
    const quizQuestions = questions.map(q => ({
      ...q,
      options: q.options, // Keep original order
      correctIndex: q.correctIndex, // Keep original correct index
    }));

    // No mapping needed since we're not shuffling
    setQuizMapping({});

    return quizQuestions;
  }, [questions]);

  const score = useMemo(() => {
    if (!submitted) return null;
    let correct = 0;
    quiz.forEach(q => {
      if (answers[q.id] === q.correctIndex) correct += 1;
    });
    return { correct, total: quiz.length };
  }, [submitted, answers, quiz]);

  const handleSelect = (qid, idx) => {
    if (submitted) return;
    setAnswers(prev => {
      const newAnswers = { ...prev, [qid]: idx };
      console.log(`Selected answer for ${qid}: index ${idx}`, {
        question: quiz.find(q => q.id === qid),
        newAnswers
      });
      return newAnswers;
    });
  };

  const createOrGetLearningPlan = useCallback(async (quizQuestions) => {
    if (!enableDatabase) return null;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return null;
      }

      const learningPlanData = {
        title: learningPlanTitle || topic || "Learning Plan",
        description: `Learning plan for ${topic || learningPlanTitle || "case study"}`,
        video_url: videoUrl || null,
        video_title: videoUrl ? "Lesson Video" : null,
        case_study: caseStudy || "",
        case_study_editable: false,
        quiz_questions: quizQuestions,
        topic: topic || null,
      };

      const response = await fetch("/api/learning-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify(learningPlanData)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.learning_plan_id) {
          setLearningPlanId(data.learning_plan_id);
          return data.learning_plan_id;
        }
      }
    } catch (error) {
      console.error("Error creating learning plan:", error);
    }
    return null;
  }, [enableDatabase, learningPlanTitle, topic, caseStudy, videoUrl]);

  const handleSubmit = async () => {
    if (submitted) return;
    
    setSubmitted(true);
    
    if (!enableDatabase) {
      // Just show results without saving
      return;
    }

    setIsSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.warn("No active session, quiz results not saved");
        setIsSaving(false);
        return;
      }

      // If we don't have a learning plan ID yet, create one first
      let planId = learningPlanId;
      if (!planId && questions) {
        planId = await createOrGetLearningPlan(questions);
      }

      if (planId) {
        // No mapping needed - answers are already in the correct format
        // The index the user clicks directly corresponds to the original index
        const originalAnswers = { ...answers };
        
        // Debug log to verify answers
        console.log('Quiz submission:', {
          userSelectedAnswers: answers,
          submittedAnswers: originalAnswers,
        });
        
        // Submit quiz results
        const submitData = {
          learning_plan_id: planId,
          quiz_answers: originalAnswers,
          video_watched: false,
          case_study_read: false,
        };

        const submitResponse = await fetch("/api/learning-plans/submit-quiz", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`
          },
          body: JSON.stringify(submitData)
        });

        if (submitResponse.ok) {
          const submitResult = await submitResponse.json();
          console.log("Quiz submitted successfully:", submitResult);
        } else {
          console.error("Failed to submit quiz");
        }
      } else {
        console.warn("No learning plan ID, quiz results not saved");
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const handleGenerateQuestions = async () => {
    if (!enableGenerateQuestions || !topic) {
      return;
    }

    setIsLoadingQuestions(true);
    setQuestionsError(null);
    // Reset answers immediately when generating new questions
    setAnswers({});
    setSubmitted(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.warn("No active session, cannot generate questions");
        setQuestionsError("Please log in to generate questions");
        setIsLoadingQuestions(false);
        return;
      }

      const requestBody = {
        num_questions: numQuestions,
        topic: topic, // Use the topic prop (e.g., "Opioids" or "Inhaled Anesthetics")
      };

      const response = await fetch("/api/learning-plan/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
          // Ensure answers are reset
          setAnswers({});
          setSubmitted(false);

          // Persist this new question set in the learning plan table
          if (enableDatabase) {
            const planId = await createOrGetLearningPlan(data.questions);
            if (planId) {
              setLearningPlanId(planId);
            }
          }
        } else {
          throw new Error("No questions generated");
        }
      } else {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(errorData.detail || "Failed to generate questions");
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      setQuestionsError(error.message);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  return (
    <SectionCard>
      <SectionHeader>
        <SectionTitleRow>
          <SectionTitle>{sectionTitle}</SectionTitle>
          {enableGenerateQuestions && topic && (
            <ActionButton
              onClick={handleGenerateQuestions}
              disabled={isLoadingQuestions}
              style={{ marginLeft: 'auto', fontSize: '12px', padding: '6px 12px' }}
            >
              {isLoadingQuestions ? 'Generating...' : '🔄 Generate Questions'}
            </ActionButton>
          )}
        </SectionTitleRow>
      </SectionHeader>

      <Divider />
      {isLoadingQuestions && (
        <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
          <p>Generating questions based on {topic} materials...</p>
        </div>
      )}
      {questionsError && (
        <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', marginBottom: '16px', color: '#991b1b' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            ⚠️ Could not generate questions: {questionsError}
          </p>
        </div>
      )}
      {!questions || questions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
          <p style={{ fontSize: '16px', marginBottom: '12px' }}>
            No questions available yet.
          </p>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>
            Click "Generate Questions" above to create topic-specific questions based on your materials.
          </p>
        </div>
      ) : (
        <>
          <QuizList>
            {quiz.map((q, qi) => (
              <QuestionCard key={q.id}>
                <QuestionText>
                  {qi + 1}. {q.text}
                </QuestionText>

                {q.options.map((opt, idx) => (
                  <OptionRow key={idx} htmlFor={`${q.id}-${idx}`}>
                    <HiddenRadio
                      id={`${q.id}-${idx}`}
                      name={q.id}
                      checked={answers[q.id] === idx}
                      onChange={() => handleSelect(q.id, idx)}
                    />
                    <Bubble>
                      <BubbleDot />
                    </Bubble>
                    <span>{opt}</span>
                  </OptionRow>
                ))}

                {submitted && (
                  <Feedback $correct={answers[q.id] === q.correctIndex}>
                    {answers[q.id] === q.correctIndex
                      ? "✅ Correct."
                      : "❌ Not quite."}{" "}
                    {q.explanation}
                  </Feedback>
                )}
              </QuestionCard>
            ))}
          </QuizList>

          <Divider />
          <ActionsRow>
            <ActionButton
              $variant="primary"
              onClick={handleSubmit}
              disabled={submitted || isSaving}
            >
              {isSaving ? "Saving..." : submitted ? "Submitted" : "Submit Quiz"}
            </ActionButton>
            <ActionButton onClick={handleReset}>Reset Answers</ActionButton>
            {submitted && score && (
              <span style={{ color: "#0f172a", fontWeight: 600 }}>
                Score: {score.correct} / {score.total} (
                {Math.round((score.correct / score.total) * 100)}%)
              </span>
            )}
          </ActionsRow>
        </>
      )}
    </SectionCard>
  );
}
