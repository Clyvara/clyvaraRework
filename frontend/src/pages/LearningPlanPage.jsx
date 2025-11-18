import React, { useMemo, useState, useEffect } from "react";
import styled from "styled-components";
import { supabase } from "../utils/supabaseClient";
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
  justify-content: space-between;
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
  questions: propQuestions,
  allowCaseStudyEditing = false,
  topic,
  numQuestions = 3,
  autoGenerate = true, // New prop to control auto-generation
}) {

  const defaultCaseStudy = `CASE STUDY GOES HERE`;
  const [questions, setQuestions] = useState(propQuestions || null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [questionsError, setQuestionsError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [editableCase, setEditableCase] = useState(caseStudy ?? defaultCaseStudy);
  const [learningPlanId, setLearningPlanId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  // Store the quiz mapping when answers are selected to prevent re-shuffle issues
  const [quizMapping, setQuizMapping] = useState({});

  // Helper function to create or get learning plan (defined outside useEffect so it's accessible)
  const createOrGetLearningPlan = React.useCallback(async (quizQuestions) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return;
      }

      const learningPlanData = {
        title: topic || "Learning Plan",
        description: `Learning plan for ${topic || "case study"}`,
        video_url: videoUrl,
        video_title: videoUrl ? "Lesson Video" : null,
        case_study: editableCase !== defaultCaseStudy ? editableCase : "",
        case_study_editable: allowCaseStudyEditing,
        quiz_questions: quizQuestions,
        topic: topic || null,
      };

      const response = await fetch("http://localhost:8000/api/learning-plans", {
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
        }
      }
    } catch (error) {
      console.error("Error creating learning plan:", error);
    }
  }, [topic, videoUrl, editableCase, defaultCaseStudy, allowCaseStudyEditing]);

  // Fetch questions from backend when caseStudy or topic changes
  useEffect(() => {
    const generateQuestions = async () => {
      // Skip if questions are provided as prop or autoGenerate is false
      if (propQuestions || !autoGenerate) {
        return;
      }

      setIsLoadingQuestions(true);
      setQuestionsError(null);

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.warn("No active session, using default questions");
          setQuestions(null);
          setIsLoadingQuestions(false);
          return;
        }

        const requestBody = {
          num_questions: numQuestions,
        };

        // Add case study or topic if available, otherwise backend will use system PDFs
        if (editableCase && editableCase !== defaultCaseStudy) {
          requestBody.case_study = editableCase;
        } else if (topic) {
          requestBody.topic = topic;
        }
        // If neither is provided, backend will generate questions from system PDFs

        const response = await fetch("http://localhost:8000/api/learning-plan/generate-questions", {
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
            // Reset answers and submitted state when new questions are generated
            setAnswers({});
            setSubmitted(false);
            // Create or get learning plan after questions are generated
            await createOrGetLearningPlan(data.questions);
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
        // Fall back to default questions
        setQuestions(null);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    generateQuestions();
  }, [editableCase, topic, numQuestions, autoGenerate, propQuestions, defaultCaseStudy, videoUrl, allowCaseStudyEditing, createOrGetLearningPlan]);

  // Reset answers when questions change (safety check to prevent old answers persisting)
  // Use a ref to track previous questions and only reset when questions actually change
  const prevQuestionsRef = React.useRef(questions);
  useEffect(() => {
    // Only reset if questions changed from one set to another (not initial load)
    if (questions && prevQuestionsRef.current && 
        JSON.stringify(questions) !== JSON.stringify(prevQuestionsRef.current)) {
      // Questions changed - reset answers to prevent old answers being submitted
      setAnswers({});
      setSubmitted(false);
      setQuizMapping({}); // Also reset mapping when questions change
    }
    prevQuestionsRef.current = questions;
  }, [questions]);

  const quiz = useMemo(() => {
    const source = questions ?? learningPlanQuestions;
  
    const shuffledQuiz = source.map(q => {
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
  
      // Create mapping from shuffled index to original index
      const indexMapping = optionsWithIndex.map((opt, shuffledIdx) => ({
        shuffledIndex: shuffledIdx,
        originalIndex: opt.originalIndex
      }));
  
      return {
        ...q,
        options: optionsWithIndex.map(o => o.label),
        correctIndex: newCorrectIndex,
        indexMapping: indexMapping, // Store mapping for answer conversion
      };
    });
    
    // Store the mapping for each question to use during submission
    const mapping = {};
    shuffledQuiz.forEach(q => {
      mapping[q.id] = q.indexMapping;
    });
    setQuizMapping(mapping);
    
    return shuffledQuiz;
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
    if (submitted) return; // lock answers after submit
    // idx is the shuffled index (0-3) that the user clicked
    setAnswers(prev => {
      const newAnswers = { ...prev, [qid]: idx };
      console.log(`Selected answer for ${qid}: shuffled index ${idx}`, {
        question: quiz.find(q => q.id === qid),
        newAnswers
      });
      return newAnswers;
    });
  };

  const handleSubmit = async () => {
    if (submitted) return;
    
    setSubmitted(true);
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
        const learningPlanData = {
          title: topic || "Learning Plan",
          description: `Learning plan for ${topic || "case study"}`,
          video_url: videoUrl,
          video_title: videoUrl ? "Lesson Video" : null,
          case_study: editableCase !== defaultCaseStudy ? editableCase : "",
          case_study_editable: allowCaseStudyEditing,
          quiz_questions: questions,
          topic: topic || null,
        };

        const createResponse = await fetch("http://localhost:8000/api/learning-plans", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.access_token}`
          },
          body: JSON.stringify(learningPlanData)
        });

        if (createResponse.ok) {
          const createData = await createResponse.json();
          if (createData.success && createData.learning_plan_id) {
            planId = createData.learning_plan_id;
            setLearningPlanId(planId);
          }
        }
      }

      if (planId) {
        // Map answers from shuffled indices to original indices
        // The user selected answers using shuffled option indices, but backend expects original indices
        // Use the stored quizMapping to ensure we use the same mapping that was active when answers were selected
        const originalAnswers = {};
        Object.keys(answers).forEach((questionId) => {
          const userAnswerIndex = answers[questionId];
          const questionMapping = quizMapping[questionId];
          
          if (userAnswerIndex !== undefined && questionMapping && questionMapping[userAnswerIndex]) {
            // Convert shuffled index to original index using the stored mapping
            const mapping = questionMapping[userAnswerIndex];
            if (mapping.originalIndex !== undefined) {
              originalAnswers[questionId] = mapping.originalIndex;
            } else {
              console.warn(`Mapping for ${questionId} missing originalIndex, using shuffled index ${userAnswerIndex}`);
              originalAnswers[questionId] = userAnswerIndex;
            }
          } else if (userAnswerIndex !== undefined) {
            // Fallback: if no mapping available, use the shuffled index directly
            console.warn(`No mapping for ${questionId}, using shuffled index ${userAnswerIndex} directly`);
            originalAnswers[questionId] = userAnswerIndex;
          }
        });
        
        // Debug log to verify mapping
        console.log('Answer mapping debug:', {
          userSelectedAnswers: answers,
          mappedOriginalAnswers: originalAnswers,
          quizMapping: quizMapping,
          questions: quiz.map(q => ({ 
            id: q.id, 
            correctIndex: q.correctIndex,
            storedMapping: quizMapping[q.id]
          }))
        });
        
        // Submit quiz results
        const submitData = {
          learning_plan_id: planId,
          quiz_answers: originalAnswers,
          video_watched: false, // Could be tracked separately
          case_study_read: false, // Could be tracked separately
        };

        const submitResponse = await fetch("http://localhost:8000/api/learning-plans/submit-quiz", {
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
            {autoGenerate && !propQuestions && (
              <ActionButton
                onClick={async () => {
                  setIsLoadingQuestions(true);
                  setQuestionsError(null);
                  // Reset answers immediately when regenerate is clicked
                  setAnswers({});
                  setSubmitted(false);
                  
                  try {
                    const { data: { session } } = await supabase.auth.getSession();
                    if (!session) {
                      console.warn("No active session");
                      return;
                    }

                    const requestBody = {
                      num_questions: numQuestions,
                    };

                    // Add case study or topic if available, otherwise backend will use system PDFs
                    if (editableCase && editableCase !== defaultCaseStudy) {
                      requestBody.case_study = editableCase;
                    } else if (topic) {
                      requestBody.topic = topic;
                    }
                    // If neither is provided, backend will generate questions from system PDFs

                    const response = await fetch("http://localhost:8000/api/learning-plan/generate-questions", {
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
                        // Ensure answers are reset (in case questions failed to generate)
                        setAnswers({});
                        setSubmitted(false);
                        // Update learning plan with new questions
                        await createOrGetLearningPlan(data.questions);
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
                    // Reset answers even on error
                    setAnswers({});
                    setSubmitted(false);
                  } finally {
                    setIsLoadingQuestions(false);
                  }
                }}
                disabled={isLoadingQuestions}
                style={{ marginLeft: 'auto', fontSize: '12px', padding: '6px 12px' }}
              >
                {isLoadingQuestions ? 'Generating...' : '🔄 Regenerate Questions'}
              </ActionButton>
            )}
          </SectionTitleRow>
        </SectionHeader>

        <Divider />
        {isLoadingQuestions && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
            <p>Generating questions based on your materials...</p>
          </div>
        )}
        {questionsError && (
          <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', marginBottom: '16px', color: '#991b1b' }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              ⚠️ Could not generate questions: {questionsError}. Using default questions.
            </p>
          </div>
        )}
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
          <ActionButton $variant="primary" onClick={handleSubmit} disabled={submitted || isSaving}>
            {isSaving ? "Saving..." : submitted ? "Submitted" : "Submit Quiz"}
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
