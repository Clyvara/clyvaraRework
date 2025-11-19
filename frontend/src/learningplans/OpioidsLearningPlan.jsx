import React from "react";
import {
  LearningPlanLayout,
  LessonVideoSection,
  CaseStudySection,
  QuizSection,
} from "../layouts/LearningPlanLayout";
import Video1 from "../assets/videos/Opioid1.mp4";
import Video2 from "../assets/videos/Opioid2.mp4";

import ConceptMap1 from "../assets/conceptmaps/OpioidMap1.pdf";
import ConceptMap2 from "../assets/conceptmaps/OpioidMap2.pdf";

export default function OpioidsLearningPlan() {
  return (
    <LearningPlanLayout
      title="Opioids"
      subtitle="Learn more about opioids and their relation to anesthesia pharmacology."
    >
      <LessonVideoSection
        sectionTitle="How do Opioids Work?"
        videoUrls={[Video1, Video2]}
      />

      <CaseStudySection
        sectionTitle="Concept Maps"
        initialText={""}
        allowEditing={false}
        pdfUrls={[
          ConceptMap1,
          ConceptMap2,
        ]}
      />

      <QuizSection 
        topic="Opioids"
        learningPlanTitle="Opioids"
        caseStudy=""
        videoUrl={Video1}
        enableDatabase={true}
        enableGenerateQuestions={true}
      />
    </LearningPlanLayout>
  );
}
